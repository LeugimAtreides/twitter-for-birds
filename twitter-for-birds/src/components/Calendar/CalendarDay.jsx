/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default function CalendarDay({
  hasEvents, onDateSelect, date, day,
  isPastDay, isPrevMonthDay, isCurrentDay, isSelectedDate, isNextMonthDay,
}) {
  function classes() {
    return classNames('body-cell', {
      'past-day': isPastDay,
      'prev-month-day': isPrevMonthDay,
      'current-day': isCurrentDay,
      // eslint-disable-next-line quote-props
      'selected': isSelectedDate,
      'has-events': hasEvents,
      'next-month-day': isNextMonthDay,
    });
  }

  function handleClick(e) {
    e.preventDefault();

    if (hasEvents) {
      onDateSelect(date);
    }
  }

  const styles = classes();
  return (
    <div className={styles}>
      <span role="button" tabIndex="-1" onClick={(e) => handleClick(e, onDateSelect)} className="date-number">{day}</span>
    </div>
  );
}

CalendarDay.propTypes = {
  onDateSelect: PropTypes.func.isRequired,
  day: PropTypes.number.isRequired,
  isPastDay: PropTypes.bool.isRequired,
  isPrevMonthDay: PropTypes.bool.isRequired,
  isCurrentDay: PropTypes.bool.isRequired,
  isSelectedDate: PropTypes.bool.isRequired,
  hasEvents: PropTypes.bool.isRequired,
  isNextMonthDay: PropTypes.bool.isRequired,
  date: PropTypes.object.isRequired,
};
