/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import CalendarRow from './CalendarRow';
import CalendarDay from './CalendarDay';

export default function Body({
  currentDate, onDateSelect, selectedDate, events,
}) {
  const monthMoment = moment(currentDate).startOf('month');
  const monthLength = monthMoment.clone().endOf('month').date();
  const offset = monthMoment.day();
  const weeks = Math.ceil((monthLength + offset) / 7);
  const rows = [];

  function getCurrentDateMoment() {
    return moment(currentDate).startOf('day');
  }

  function getDayMoment(weekDay) {
    return moment(currentDate).date(weekDay).startOf('week');
  }

  function getRow(week) {
    const weekDay = (week * 7) + 1;
    const currentMoment = getCurrentDateMoment();
    const dayMoment = getDayMoment(weekDay);
    const days = [];

    for (let day = 0; day < 7; day += 1) {
      let eventsCopy = [];

      if (dayMoment.isSame(currentMoment, 'month')) {
        eventsCopy = events[dayMoment.date()] || [];
      }

      const dayProps = {
        day: dayMoment.date(),
        isPrevMonthDay: dayMoment.isBefore(currentMoment, 'month'),
        isNextMonthDay: dayMoment.isAfter(currentMoment, 'month'),
        isCurrentDay: dayMoment.isSame(moment(), 'day'),
        isPastDay: dayMoment.isBefore(moment(), 'day'),
        isSelectedDate: dayMoment.isSame(moment(selectedDate).startOf('day')),
        onDateSelect,
        date: dayMoment.toDate(),
        hasEvents: eventsCopy.length !== 0,
      };

      dayMoment.add(1, 'days');
      days.push(<CalendarDay key={dayMoment.format('X')} {...dayProps} />);
    }

    return <CalendarRow key={week}>{days}</CalendarRow>;
  }

  for (let i = 0; i < weeks; i += 1) {
    rows.push(getRow(i));
  }

  return (
    <div className="body">
      {rows}
    </div>
  );
}

Body.prototype = {
  currentDate: PropTypes.string.isRequired,
  selectedDate: PropTypes.string.isRequired,
  onDateSelect: PropTypes.func.isRequired,
  events: PropTypes.array.isRequired,
};
