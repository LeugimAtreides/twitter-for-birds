import { useState, useEffect } from 'react';
import moment from 'moment';
import { useSelector, useDispatch } from '../../utils/react-redux-hooks';
import { findCollection } from '../../actions';
import Scheduling from '../../services/scheduling';

export const useAppointments = ({ physicianId, appointmentReason = '', date = '' }) => {
  const [physId, setPhysicianId] = useState(physicianId);
  const [refetch, setRefetch] = useState(false);
  const [id, setId] = useState(null);
  const dispatch = useDispatch();

  function refetchAppointments() {
    setRefetch(true);
  }

  const dateTime = moment(Date.now())
    .format('YYYY-MM-DD HH:mm')
    .valueOf();

  const phId = `${physId}${dateTime}`;
  const selectedDate = moment(date).format('YYYY-MM-DD');
  const endTimestamp = moment(selectedDate)
    .add(1, 'days')
    .format('YYYY-MM-DD');

  useEffect(() => {
    const id = dispatch(
      findCollection({
        id: phId,
        callApi: Scheduling.appointments,
        payload: {
          appointmentReason,
          providerId: physId,
          startDate: selectedDate,
          endDate: endTimestamp,
        },
        // force: true,
      }),
    );
    setId(id);
    return () => {
      setRefetch(false);
    };
  }, [refetch, dispatch, appointmentReason, endTimestamp, phId, physId, selectedDate]);

  const appointments = useSelector(state => state.collections[id]);

  return {
    ...appointments,
    refetchAppointments,
    setPhysicianId,
  };
};


export const useCalendarAppointments = ({
  provider, physicianId, appointmentReason, date,
}) => {
  const slots = [];
  const start = 1;
  const end = Number(moment(date).endOf('month').format('D'));
  const { office } = provider;
  const dateTime = moment(date);
  const currentTimestamp = moment(date).startOf('month').format('YYYY-MM-DD');
  const endTimestamp = moment(date).endOf('month').startOf('day').format('YYYY-MM-DD');
  const departmentId = office?.departmentId;
  const phId = `${physicianId}:${appointmentReason}:${dateTime}`;
  const dispatch = useDispatch();

  const id = dispatch(
    findCollection({
      id: phId,
      callApi: Scheduling.appointments,
      payload: {
        appointmentReason,
        providerId: physicianId,
        startDate: currentTimestamp,
        endDate: endTimestamp,
      },
      // force: true,
    }),
  );

  const appointments = useSelector(state => state.collections[id]);

  for (let i = start; i <= end; i += 1) {
    slots[i] = appointments.data.filter(item => (moment(item.date, 'MM-DD-YYYY').date() === i));
  }
  const data = slots.map(item => [...item].filter(slot => String(slot.departmentid) === departmentId));
  return { meta: appointments.meta, data };
};

export const useResultsAppointments = ({
  office,
  physicianId,
  appointmentReason,
  startDate,
  endDate,
}) => {
  const dateTime = moment(Date.now()).format('YYYY-MM-DD HH:mm').valueOf();
  const departmentId = Number(office?.departmentId);
  const phId = `${physicianId}:${appointmentReason}:${dateTime}`;
  const dispatch = useDispatch();

  const id = dispatch(
    findCollection({
      id: phId,
      callApi: Scheduling.appointments,
      payload: {
        appointmentReason,
        providerId: physicianId,
        startDate,
        endDate,
      },
    }),
  );

  const appointments = useSelector(state => state.collections[id]);

  const appointmentDates = appointments?.data?.filter(item => item.departmentid === departmentId);

  const appointmentsForProviders = appointmentDates.length > 0 ?
    appointmentDates.reduce((data, item) => {
      const dateKey = moment(item.date, 'MM-DD-YYYY').format('MM-DD-YYYY');
      const date_and_time = `${item.date} ${item.time}`;
      if (moment(date_and_time).valueOf() > Date.now()) {
        data[dateKey] = data[dateKey] ? data[dateKey].concat([item]) : [item];
      }
      return data;
    }, {}) : {};

  return { meta: appointments.meta, data: appointmentsForProviders };

};
