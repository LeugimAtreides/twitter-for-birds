/* eslint-disable */
// import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import { useParams, Route, Redirect } from 'react-router-dom';
import { Button, WarningModal } from 'hw-react-components';
import Cookies from 'js-cookie';
import { ThemeProvider } from 'styled-components';
import hwuiOverrides from './overrides.scss';
import useRegisterData from './hook'
import Scheduling from '../../services/scheduling';
import usePersonProfile from '../../connector-hooks/usePersonProfile/usePersonProfile';
import * as StringUtils from '../../utils/strings';
import LoaderAnimation from '../../components/Loader/Loader';
import RegisterForm from './Form';
import RegisterConfirm from './Confirm';
import RegisterConfirmation from './Confirmation';
import RegisterConflict from './Conflict';

const AuthRoute = ({
  match,
  params,
  registration,
  component,
  ...props
}) => {
  return (
    <Route
      {...props}
      render={() =>
        registration.size ? (
          component()
        ) : (
            <Redirect to={{ pathname: match.url, search: params.toString() }} />
          )
      }
    />
  );
};

export default function Register({
  match, history, redirect,
  changeProvider = () => null,
  updateSlotFilters = () => null,
  notify = () => false,
  dismiss = () => false }) {

  // GENERAL VARS
  let phr_id = Cookies.get('phr_id');
  const { appointmentId, locationId, physicianId } = useParams();
  const params = new URLSearchParams(window.location.search);
  const appointmentReason = params.get('reasonForVisit')
  const date = moment(params.get('appointmentDate'), 'MM-DD-YYYY');
  const location = params.get('location').split(',');
  const [lat, lon] = location

  // LOCAL STATE 
  const [registration, setRegistration] = React.useState(new Map())
  const [selectedPhrId, setSelectedPhrId] = React.useState(Cookies.get('phr_id'))
  const [confirming, setConfirming] = React.useState(false)

  // API HOOKS
  const {
    appointments, reasons, provider, userProfile, owners, googleMapImage, doneLoading,
  } = useRegisterData({ physicianId, phr_id, appointmentReason, date, location, lat, lon })

  const calendarPageURL = () => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.delete('appointmentDate');
    return `/scheduling/appointments/location/${locationId}/physician/${physicianId}?${searchParams.toString()}`;
  }

  const appointmentWarning = () => {
    return (
      <WarningModal
        {...{
          title: 'Appointment has expired.',
          open: expired(),
          onClose: history.goBack
        }}
      >
        <p>
          <Button
            modifier="info"
            onClick={() => history.push(calendarPageURL())}
          >
            &laquo; Appointment Calendar
          </Button>
        </p>
      </WarningModal>
    );
  }

  const findAppt = () => {
    const matchingAppt = [...appointments?.data].find(
      appt => (String(appt.appointmentid) === appointmentId)
    );
    return matchingAppt
  }

  const expired = () => {
    const appt = findAppt();
    return !appt;
  }

  const register = async ({ appt, provider }) => {
    let resp = {};
    const searchParams = new URLSearchParams(window.location.search);

    const registerToast = notify({
      message: 'Confirming your appointment',
      status: 'info'
    });

    const reasonsDescription = reasons?.data?.data.find(reason => reason.reason_id == appointmentReason);
    const trueDate = moment(`${appt.date} ${appt.time}`, 'MM-DD-YYYY HH:mm');

    const appointment = { // are these .get() helpers working ???
      appointment_id: appointmentId,
      reason_id: parseInt(appointmentReason, 10),
      department_id: provider.office.departmentId,
      dob: moment(registration.get('date_of_birth').value).format('YYYY-MM-DD'),
      first_name: registration.get('first_name').value,
      last_name: registration.get('last_name').value,
      insurance: registration.get('insurance_name').value,
      email: registration.get('email_address').value,
      phone: StringUtils.stripNonNumeric(registration.get('phone').value),
      practice_id: provider.office.practiceId,
      npi: provider.npi,
      physicianName: provider.displayName,
      appointmentReason: reasonsDescription.reason_desc ? reasonsDescription.reason_desc : "",
      scheduledDay: trueDate.format('YYYY-MM-DD'),
      scheduledTime: trueDate.format('h:mm a')
    };
    setConfirming(true);

    try { // can the useCreateAppointment hook be used here ???
      resp = await Scheduling.createAppointmentAtlas({
        ownerPhrId: selectedPhrId,
        body: appointment
      });
    } catch (err) {
      resp = err;
      const json = await resp.json();
      if (json.fieldErrors.includes('North American Number'))
        notify(
          {
            message: 'Please enter a correct phone number',
            status: 'danger'
          },
          6500
        );
      else if (json.fieldErrors[0].message.includes('Birth')) {
        notify(
          {
            message: 'Please ensure your date of birth is correct',
            status: 'danger'
          },
          6500
        );
      } else
        notify(
          {
            message: 'There was an issue scheduling your appointment',
            status: 'danger'
          },
          6500
        );
    }

    dismiss(registerToast);
    setConfirming(false);

    if (resp.status === 200) {
      history.push(`${match.url}/confirmation?${searchParams.toString()}`);
    } else {
      history.push(`${match.url}/conflict?${searchParams.toString()}`);
    }

    return resp;
  };

  const saveRegistration = (schema, selectedPhrId) => {
    const searchParams = new URLSearchParams(window.location.search);
    setRegistration(schema)
    setSelectedPhrId(selectedPhrId)
    history.push(`${match.url}/confirm?${searchParams.toString()}`); // useHistory ???
  };

  const registerForm = () => {
    return (
      <RegisterForm
        owners={owners}
        profile={userProfile}
        usePersonProfile={usePersonProfile}
        provider={provider}
        onSubmit={saveRegistration}
      />
    );
  }

  const registerConfirm = () => {
    return (
      <RegisterConfirm
        provider={provider.data}
        appointment={findAppt()}
        registration={registration}
        confirming={confirming}
        register={register}
        mapImage={googleMapImage}
        reasons={reasons.data.data}
        appointmentReason={appointmentReason}
      />
    );
  }

  const registerConfirmation = () => {
    return (
      <RegisterConfirmation
        provider={provider.data}
        history={history}
        appointment={findAppt()}
        registration={registration}
        mapImage={googleMapImage}
        reasons={reasons.data.data}
        appointmentReason={appointmentReason}
      />
    );
  }

  const registerConflict = () => {
    return (
      <RegisterConflict
        provider={provider.data}
        history={history}
        appointment={findAppt()}
        registration={registration}
        mapImage={googleMapImage}
        reasons={reasons.data.data}
        appointmentReason={appointmentReason}
      />
    );
  }

  return doneLoading && appointments?.data ? (
    <ThemeProvider theme={hwuiOverrides}>
      <div>
        {expired() && appointmentWarning()}
        <Route exact path={match.url} render={() => registerForm()} />
        <AuthRoute
          {...{
            match,
            registration,
            params,
            exact: true,
            path: `${match.url}/confirm`,
            component: registerConfirm
          }}
        />
        <AuthRoute
          {...{
            match,
            registration,
            params,
            exact: true,
            path: `${match.url}/confirmation`,
            component: registerConfirmation
          }}
        />
        <AuthRoute
          {...{
            match,
            registration,
            params,
            exact: true,
            path: `${match.url}/conflict`,
            component: registerConflict
          }}
        />
      </div>
    </ThemeProvider>
  ) : (
      <LoaderAnimation />
    )
}
