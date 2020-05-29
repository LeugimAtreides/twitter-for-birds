import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'hw-react-components';
import moment from 'moment';
import Provider from '../../components/Provider/Provider';
import OfficeDetails from './OfficeDetails';
import PatientDetails from './PatientDetails';
import './styles/confirmation.sass';

type RegisterFormProps = {
  blockName?: string,
  provider: any,
  appointment: any,
  registration(): any,
  register(): any,
  reasons: any,
  appointmentReason: string,
  confirming: boolean,
  mapImage: any
}

const RegisterConfirm: React.FC<RegisterFormProps> = ({
  blockName = 'hwui-RegisterConfirm',
  provider = {},
  appointment = {},
  registration = new Map(),
  register = (appt: any) => false,
  reasons = [],
  appointmentReason = '',
  confirming = false,
  mapImage = {},
}) => {

  async function submitHanlder(e: any) {
    e.preventDefault();
    register({
      appt: appointment,
      provider
    });
  }

  function editPatient() {
    const searchParams = new URLSearchParams(window.location.search);
    return `/scheduling/appointments/${appointment.appointmentid}/location/${provider.office.id}/physician/${provider.providerId}?${searchParams.toString()}`;
  }

  function editAppointment() {
    const searchParams = new URLSearchParams(window.location.search);
    return `/scheduling/appointments/location/${provider.office.id}/physician/${provider.providerId}?${searchParams.toString()}`;
  }

  const reasonDescription = () => {
    const description = [...reasons].find(
      (reason: any) => (String(reason.reason_id) === appointmentReason)
    );
    return description.reason_desc
  }

  const trueDate = moment(`${appointment.date} ${appointment.time}`, 'MM-DD-YYYY HH:mm')
  return (
    <div className={`${blockName}`}>
      <section className={`${blockName}__Header`}>
        <h1>Please review and submit your information</h1>
      </section>
      <main>
        <div className={`${blockName}__LeftSide`}>
          <div className={`${blockName}__Provider-Card`}>
            <Provider
              provider={provider}
              showVideoVisitFlag={false}
              showAvailability={false}
              showNewPatientFlag={false}
              showRating={false}
            />
          </div>
          <OfficeDetails provider={provider} mapImage={mapImage} showMap={false} />
        </div>
        <div className={`${blockName}__Appointment-Card`}>
          <section className={`${blockName}__section-heading`}>
            <h2>Appointment Details</h2>
            <Link to={editAppointment()} className={`${blockName}__Edit-Link`}>Select New</Link>
          </section>
          <section className={`${blockName}__confirmation-group`}>
            <div id="detail-grid" className={`${blockName}__detail-group`}>
              <p className={`${blockName}__detail-group--title`}>Date</p>
              <p className={`${blockName}__detail-group--date`}>{trueDate.format('dddd, MMMM D, YYYY')}</p>
            </div>
            <div id="detail-grid" className={`${blockName}__detail-group`}>
              <p className={`${blockName}__detail-group--title`}>Time</p>
              <p className={`${blockName}__detail-group--time`}>{trueDate.format('h:mm a')}</p>
            </div>
            <div id="detail-grid" className={`${blockName}__detail-group`}>
              <p className={`${blockName}__detail-group--title`}>Reason</p>
              <p className={`${blockName}__detail-group--plain`}>{reasonDescription()}</p>
            </div>
          </section>
          <section className={`${blockName}__section-heading`}>
            <h2>Patient Details</h2>
            <Link to={editPatient()} className={`${blockName}__Edit-Link`}>Edit</Link>
          </section>
          <PatientDetails registration={registration} />
        </div>
        <div className={`${blockName}__button-container`}>
          <Button onClick={(e: any) => submitHanlder(e)} disabled={confirming} modifier="info" size="lg" className={`${blockName}__Button`}>
            Confirm Appointment
          </Button>
        </div>
      </main>
    </div>
  );
}

export default RegisterConfirm