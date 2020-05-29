/* eslint-disable react/prop-types */
import React from 'react';
// import PropTypes from 'prop-types';
import moment from 'moment';
import short from 'short-uuid';
import { useParams } from 'react-router-dom';
import { OGSelect, Anchor } from 'hw-react-components';
import LocationPicker from './LocationPicker';
import LoaderAnimation from '../Loader/Loader';
import AppointmentSlot from '../../containers/AppointmentSlotContainer';

const SelectAppointmentReason = () => (
  <span className="hwui-Provider__cta--enable">
    To View the Available Appointments, Please Select a Reason for Visit
  </span>
);

const AppointmentSlots = ({
  date,
  appointments,
  reasons,
  onChange,
  isFetching,
  provider,
  appointmentReason,
  history,
  blockName = 'hwui-AppointmentSlot',
}) => {
  const hasAppointments = appointments && appointments.length > 0;
  const { physicianId, locationId } = useParams();

  const locations = () => provider.officeAddress.map(office => {
    const officeCity = office.city ? `${office.city} office` : '';
    // eslint-disable-next-line no-param-reassign
    office.description = officeCity;
    return office;
  });

  const getParams = () => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.toString();
  };

  const onRequestAppointment = (e) => {
    e.preventDefault();
    history.push(`/scheduling/request/location/${locationId}/physician/${physicianId}?${getParams()}`);
  };

  const onLocation = (locationId) => {
    history.push(`/scheduling/appointments/location/${locationId}/physician/${physicianId}?${getParams()}`);
  };

  const AppointmentSlots = () => {
    let slots;
    if (isFetching) {
      slots = <LoaderAnimation />;
    } else if (!appointmentReason) {
      slots = <SelectAppointmentReason />;
    } else if (!hasAppointments) {
      slots = (
        <div className="message">
          There are no available online appointment times for this day at this location.
          {' '}
          <br />
          <Anchor onClick={onRequestAppointment}>Please request an appointment.</Anchor>
        </div>
      );
    } else {
      slots = (
        <div className={`${blockName}__slot-container`}>
          {appointments.map((appointment) => (
            <AppointmentSlot
              key={short.generate()}
              appointment={appointment}
              provider={provider}
              appointmentReason={appointmentReason}
            />
          ))}
          <div className="message">
            Looking for another time?
            <Anchor onClick={onRequestAppointment}>Request an appointment.</Anchor>
          </div>
        </div>
      );
    }
    return slots;
  };


  return (
    <div className="slots">
      <OGSelect value={appointmentReason} onChange={onChange}>
        <option value="" disabled>Select Appointment Reason</option>
        {reasons?.data?.map(reason => <option key={reason.reason_id} value={reason.reason_id}>{reason.reason_desc}</option>)}
      </OGSelect>
      <LocationPicker
        locationId={locationId}
        locations={locations()}
        changeLocation={onLocation}
        showTitle={false}
        showAddress={false}
      />
      <h3 className="current-date">
        Appointments available for
        {' '}
        <br />
        <strong>{moment(date).format('MMMM D, YYYY')}</strong>
      </h3>
      <AppointmentSlots />
    </div>
  );
};

export default AppointmentSlots;

// AppointmentSlots.propTypes = {
//   appointments: PropTypes.array,
//   date: PropTypes.string.isRequired,
//   appointmentReason: PropTypes.string,
//   isFetching: PropTypes.bool.isRequired,
//   provider: PropTypes.object.isRequired,
//   reasons: PropTypes.array,
//   onChange: PropTypes.func,
//   history: PropTypes.object,
//   match: PropTypes.object,
// };
