/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/button-has-type */
/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

export default function Controls({
  currentDate,
  minDate,
  previousClass = 'fal fa-chevron-circle-left',
  nextClass = 'fal fa-chevron-circle-right',
  onPrevMonthClick = () => null,
  onNextMonthClick = () => null,
}) {
  const displayMoment = moment(currentDate);
  const showBackButton = (
    (minDate === undefined)
    || (moment(minDate).isBefore(displayMoment, 'month'))
  );

  return (
    <div className="controls">
      {(showBackButton)
        ? (<button onClick={() => onPrevMonthClick()}><i className={previousClass} /></button>)
        : (<button disabled onClick={() => onPrevMonthClick()}><i className={previousClass} /></button>)}
      <h2 className="month-title">
        <span className="month-name">{displayMoment.format('MMMM')}</span>
        <span className="month-year">{displayMoment.format('YYYY')}</span>
      </h2>
      <button onClick={() => onNextMonthClick()}><i className={nextClass} /></button>
    </div>
  );
}

Controls.prototype = {
  currentDate: PropTypes.string.isRequired,
  onPrevMonthClick: PropTypes.func.isRequired,
  onNextMonthClick: PropTypes.func.isRequired,
  minDate: PropTypes.string,
  previousClass: PropTypes.string,
  nextClass: PropTypes.string,
};
