/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Controls from './Controls';
import Header from './Header';
import Body from './Body';

export default function Calendar({
  defaultDate, selectedDate, onDateSelect, events, minDate, onMonthChange, currentDate,
}) {
  function displayPrevMonth() {
    const newDate = moment(defaultDate).subtract(1, 'month').toDate();

    if (onMonthChange) {
      onMonthChange(newDate);
    }
  }

  function displayNextMonth() {
    const newDate = moment(defaultDate).add(1, 'month').toDate();

    if (onMonthChange) {
      onMonthChange(newDate);
    }
  }

  return (
    <div className="hwui-ProviderProfile hw-calendar">
      <Controls
        currentDate={currentDate}
        minDate={minDate}
        onPrevMonthClick={() => displayPrevMonth()}
        onNextMonthClick={() => displayNextMonth()}
      />
      <Header />
      <Body
        currentDate={currentDate}
        selectedDate={selectedDate || currentDate}
        onDateSelect={onDateSelect}
        events={events}
      />
    </div>
  );
}

Calendar.propTypes = {
  defaultDate: PropTypes.string.isRequired,
  selectedDate: PropTypes.string,
  onDateSelect: PropTypes.func.isRequired,
  events: PropTypes.array.isRequired,
  minDate: PropTypes.string,
  onMonthChange: PropTypes.func,
  currentDate: PropTypes.string.isRequired,
};
