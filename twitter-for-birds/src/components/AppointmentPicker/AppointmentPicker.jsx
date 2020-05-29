import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ThemeProvider } from 'styled-components';

const AppointmentPicker = ({
    provider,
    appointments,
    moreAppointments,
    bookAppointment,
    office,
    theme,
}) => {
    const [dateKeys] = useState(Object.keys(appointments));
    const [dateKeyIndex, setDateKeyIndex] = useState(0);
    const appointmentDay = moment(dateKeys[dateKeyIndex]) === moment(Date.now()).format('MM-DD-YYYY') ? moment(dateKeys[dateKeyIndex].replace(/-/g, '/')).format('[Today], MMMM D') : moment(dateKeys[dateKeyIndex].replace(/-/g, '/')).format('dddd, MMMM D');
    const previousDay = (dateKeyIndex > 0) ? 'previousday' : 'previousday-inactive';
    const nextDay = ((dateKeyIndex + 1) < dateKeys.length) ? 'nextday' : 'nextday-inactive';
    const dayAppointments = appointments[dateKeys[dateKeyIndex]] ? appointments[dateKeys[dateKeyIndex]] : [];

    const onNextDay = () => {
        const nextKey = dateKeyIndex + 1;
        if (dateKeys.length > nextKey) {
            setDateKeyIndex(nextKey);
        }
    };

    const onPreviousDay = () => {
        if (dateKeyIndex > 0) {
            setDateKeyIndex(prevState => prevState - 1)
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <div className="appointment-picker">
                <div className="day-picker">
                    <div className="day-picker--day"><span>{appointmentDay}</span></div>
                    <div className={`day-picker--${previousDay}`} aria-label="previous day" role="button" tabIndex="0" onClick={() => onPreviousDay()}>
                        <FontAwesomeIcon icon={['fal', 'chevron-left']} />
                    </div>
                    <div className={`day-picker--${nextDay}`} aria-label="next day" role="button" tabIndex="0" onClick={() => onNextDay()}>
                        <FontAwesomeIcon icon={['fal', 'chevron-right']} />
                    </div>
                </div>
                <div className="appointment-times">
                    {dayAppointments.slice(0, 3).map((item, i) =>
                        <div className="appointment-times--time" key={i} aria-label={moment(`${item.date} ${item.time}`).format('hh:mm a')} role="button" tabIndex="0" onClick={() => bookAppointment(office, item, provider)} size="sm">
                            <span>
                                <b>{moment(`${item.date} ${item.time}`).format('h:mm a')}</b>
                            </span>
                        </div>
                    )}
                    <div className="appointment-times--all" aria-label="all times" role="button" tabIndex="0" onClick={() => moreAppointments({ office, provider })} size="sm">
                        <span>All</span>
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
};

AppointmentPicker.propTypes = {
    provider: PropTypes.object.isRequired,
    appointments: PropTypes.object,
    moreAppointments: PropTypes.func,
    bookAppointment: PropTypes.func,
    office: PropTypes.object
};

AppointmentPicker.defaultProps = {
    appointments: {},
    moreAppointments: () => undefined,
    bookAppointment: () => undefined,
    office: {},
};

export default AppointmentPicker;
