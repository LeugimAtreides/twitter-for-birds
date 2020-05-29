import React from 'react';
import { Button } from 'hw-react-components';
import moment from 'moment';
import Provider from '../../components/Provider/Provider';
import OfficeDetails from './OfficeDetails';
import PatientDetails from './PatientDetails';
import './styles/confirmation.sass';

type ConfirmationProps = {
  blockName?: string,
  provider: any,
  history: {
    push(url: string): void;
  },
  appointment: any,
  registration(): any,
  mapImage: any
  reasons: any,
  appointmentReason: string,
}

const Confirmation: React.FC<ConfirmationProps> = ({
  blockName = 'hwui-RegisterConfirm',
  provider = {},
  history,
  appointment = {},
  registration = new Map(),
  mapImage = {},
  reasons = [],
  appointmentReason = '',
}) => {

  const onClick = async (e: any) => {
    e.preventDefault();
    history.push('/');
  }

  const reasonDescription = () => {
    const description = [...reasons].find(
    (reason: any) => (String(reason.reason_id) === appointmentReason)
    );
    return description.reason_desc
    }

  const trueDate = moment(`${appointment.date} ${appointment.time}`, 'MM-DD-YYYY HH:mm');
  return (
    <div className={`${blockName}`}>
      <section className={`${blockName}__Header`}>
        <i className="fa fa-check-circle-o" />
        <h1>Your appointment date is set!</h1>
      </section>
      <section className={`${blockName}__Buttons`}>
        <Button onClick={(e: any) => onClick(e)} className={`${blockName}__Buttons--home`} modifier="info" size="lg">
          Return to Home Page
        </Button>
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
          </section>
          <PatientDetails registration={registration} />
        </div>
      </main>
    </div>
  );
}

export default Confirmation;