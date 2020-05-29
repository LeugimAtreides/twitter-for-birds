import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Button } from 'hw-react-components';
import { ThemeProvider } from 'styled-components';
import Loader from '../Loader/Loader.jsx';
import ProviderCardForResults from '../Provider/ProviderCardForResults.tsx';
import * as ProviderCardForResultsTheme from './themes/providerCardForResults.scss';

import { formatPhoneNumber } from '../../utils/strings';

import { useResultsAppointments } from '../../connector-hooks/useAppointments/useAppointments.js';

import LocationPicker from '../LocationPicker/LocationPicker.jsx';
import AppointmentPicker from '../AppointmentPicker/AppointmentPicker.jsx';

import * as AppointmentPickerTheme from './themes/appointmentPicker.scss';
import * as LocationPickerTheme from './themes/locationPicker.scss';

const ProviderResults = ({
  provider,
  reasonForVisit,
  requestAppointment,
  moreAppointments,
  bookAppointment,
  viewProvider,
  ratingOnClick,
  theme,
}) => {
  const currentDate = moment(Date.now()).format('YYYY-MM-DD');
  const endDate = moment(currentDate).add(1, 'M').format('YYYY-MM-DD');
  const officeId = provider?.office?.id;
  const [selectedId, setSelectedId] = useState(null);

  const providerId = provider?.id;
  const hideReqAppt = provider?.hideRequestAppointment;
  const office = provider?.office;

  const appointmentParams = {
    appointmentReason: reasonForVisit,
    physicianId: providerId,
    startDate: currentDate,
    endDate,
    office: provider.office,
  };

  const appointments = useResultsAppointments({...appointmentParams})

  const onLocation = (id) => setSelectedId(id);

  const requestApptButton = hideReqAppt ? null : (
    <div className={`${ProviderResults.blockName}__Request-Appointment`}>
      <Button onClick={() => requestAppointment({ office, provider })} modifier="default" size="sm">Request Appointment</Button>
    </div>
  );

  const scheduleAppointment = () => {
    const { phoneNumber } = office;
    const {
      nonAthenaAndOutOfState,
      nonAthenaOrNoOnlineScheduling,
    } = provider;
    let result;
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
    if (nonAthenaAndOutOfState) {
      result = (
        <>
          <p>Please call the office to access the most up-to-date availability.</p>
          <div className={`${ProviderResults.blockName}__No-Request`}>
            <Button onClick={() => window.location.href = `tel:${formattedPhoneNumber}`} modifier="default" size="sm">Call the Office</Button>
          </div>
        </>
      );
    } else if (nonAthenaOrNoOnlineScheduling) {
      result = (
        <>
          <p>Please call the office or complete the request form for the most up-to-date availability.</p>
          <div className={`${ProviderResults.blockName}__No-Online-Availability`}>
            <Button onClick={() => window.location.href = `tel:${formattedPhoneNumber}`} modifier="default" size="sm">Call the Office</Button>
            {requestApptButton}
          </div>
        </>
      );
    } else if (!reasonForVisit) {
      result = (
        <div className={`${ProviderResults.blockName}__cta--enable`}>
          To view availability, please select a reason for visit from the filters.
        </div>
      );
    } else {
      const { meta, data } = appointments;
      const noOnlineSchedulingAvailability = !Object.keys(data).length;
      if (meta.loading) {
        result = <Loader {...{ fixed: false }} />;
      } else if (noOnlineSchedulingAvailability) {
        result = (
          <div>
            <p>Please call the office or complete the request form for the most up-to-date availability.</p>
            <div className={`${ProviderResults.blockName}__No-Online-Availability`}>
              <Button onClick={() => window.location.href = `tel:${formattedPhoneNumber}`} modifier="default" size="sm">Call the Office</Button>
              {requestApptButton}
            </div>
          </div>
        );
      } else {
        result = (
          <AppointmentPicker
            provider={provider}
            appointments={appointments.data}
            moreAppointments={moreAppointments}
            bookAppointment={bookAppointment}
            office={office}
            theme={AppointmentPickerTheme}
          />
        );
      }
    }
    return result;
  };


  const viewProviderProfile = (e) => {
    e.preventDefault();
    viewProvider(officeId, providerId);
  };

  const ratingOnClickNow = () => {
    ratingOnClick(providerId, officeId);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={ProviderResults.blockName}>
        <div className={`${ProviderResults.blockName}__Profile`}>
          <ProviderCardForResults showVideoVisitFlag theme={ProviderCardForResultsTheme} provider={provider} showButton buttonOnClick={(e) => viewProviderProfile(e)} ratingOnClick={() => ratingOnClickNow()} />
          <div className={`${ProviderResults.blockName}__Appointments`}>
            <LocationPicker
              locationId={officeId}
              selectedId={selectedId}
              provider={provider}
              changeLocation={onLocation}
              theme={LocationPickerTheme}
            />
            <div className={`${ProviderResults.blockName}__Appointments--picker`}>
              {scheduleAppointment()}
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

ProviderResults.blockName = 'deaui-ProviderResults';

ProviderResults.propTypes = {
  provider: PropTypes.object.isRequired,
  reasonForVisit: PropTypes.string,
  appointments: PropTypes.func,
  requestAppointment: PropTypes.func,
  moreAppointments: PropTypes.func,
  bookAppointment: PropTypes.func,
  viewProvider: PropTypes.func,
  ratingOnClick: PropTypes.func,
};

ProviderResults.defaultProps = {
  provider: {},
  reasonForVisit: undefined,
  appointments: () => undefined,
  requestAppointment: () => false,
  moreAppointments: () => false,
  bookAppointment: () => false,
  viewProvider: () => false,
  ratingOnClick: () => false,
};

export default ProviderResults;
