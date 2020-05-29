/* eslint-disable import/no-extraneous-dependencies */
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import AppointmentSlot from '../components/AppointmentSlot/AppointmentSlot';
import { changeProvider, changeAppointment } from '../reducers/appStatus';

const mapStateToProps = (state, ownProps) => ownProps;

const mapDispatchToProps = (dispatch, ownProps) => ({
  appointmentSelect() {
    const {
      provider,
      appointment,
      appointmentReason: appointment_reason_id,
      match: {
        params: { locationId, physicianId },
      },
    } = ownProps;

    dispatch(changeProvider({
      provider,
      office: provider.officeAddress.find(office => office.id === locationId),
    }));
    dispatch(changeAppointment({
      ...appointment,
      appointment_reason_id,
    }));

    const currentSearchParams = new URLSearchParams(window.location.search);

    const searchParams = new URLSearchParams();

    searchParams.append('location', currentSearchParams.get('location'));
    searchParams.append('appointmentDate', appointment.date);
    searchParams.append('reasonForVisit', appointment_reason_id);
    ownProps.history.push(`/scheduling/appointments/${appointment.appointmentid}/location/${locationId}/physician/${physicianId}?${searchParams.toString()}`);

    window.scrollTo(0, 0);
  },
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(AppointmentSlot),
);
