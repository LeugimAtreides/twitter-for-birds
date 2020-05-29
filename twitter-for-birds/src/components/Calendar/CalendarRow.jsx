/* eslint-disable react/destructuring-assignment */
import React from 'react';
import PropTypes from 'prop-types';

const CalendarRow = (props) => (
  <div className="body-row">
    {props.children}
  </div>
);

CalendarRow.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CalendarRow;
