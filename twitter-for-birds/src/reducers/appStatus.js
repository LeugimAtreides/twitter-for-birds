import Cookies from 'js-cookie';

const CHANGE_PROVIDER = 'ehr/scheduling/appStatus/CHANGE_PROVIDER';
const CHANGE_APPOINTMENT = 'ehr/scheduling/appStatus/CHANGE_APPOINTMENT';

const initialState = {
  selectedOwnerPhrId: Cookies.get('phr_id'),
  selectedProvider: null,
  selectedAppointment: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_PROVIDER:
      return { ...state, selectedProvider: action.payload };

    case CHANGE_APPOINTMENT:
      return { ...state, selectedAppointment: action.payload };
    case '@@hwui:selectOwnerPhrId':
      return { ...state, selectedOwnerPhrId: action.payload };

    default:
      return state;
  }
}

export function changeProvider(provider) {
  return {
    type: CHANGE_PROVIDER,
    payload: provider,
  };
}

export function changeAppointment(appointment) {
  return {
    type: CHANGE_APPOINTMENT,
    payload: appointment,
  };
}
