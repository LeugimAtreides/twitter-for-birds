/* eslint-disable react/prop-types */
import React from 'react';
// import PropTypes from 'prop-types';
import { Button } from 'hw-react-components';
import { convert24HourTime } from '../../utils/dates';

const AppointmentSlot = ({ appointment, appointmentSelect }) => {
  const handleClick = (event) => {
    event.preventDefault();
    appointmentSelect();
  };

  const { time } = appointment;
  const realTime = convert24HourTime(time);

  return <Button modifier="primary" onClick={e => handleClick(e)} className="appointment-slot">{realTime}</Button>;
};

// AppointmentSlot.propTypes = {
//   appointment: PropTypes.object.isRequired,
//   provider: PropTypes.object.isRequired,
//   appointmentSelect: PropTypes.func.isRequired,
// };

export default AppointmentSlot;
