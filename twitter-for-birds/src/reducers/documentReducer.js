import InitialState from './initialState';

// Create, Read, Update, Delete
export default function documentReducer(state = InitialState.documents, action) {
  const newState = {
    ...state,
  };

  switch (action.type) {
    case '@@deaui:findDocument:success':
      newState[action.id] = { data: action.resp, meta: { loading: false, error: false } };
      break;
    case '@@deaui:findDocument:failure':
      newState[action.id] = {
        data: {},
        meta: { loading: false, error: true, errorResp: action.resp },
      };
      break;
    case '@@deaui:findDocument:loading':
      newState[action.id] = { data: {}, meta: { loading: true, error: false } };
      break;

    case '@@deaui:updateDocument:success':
      newState[action.id] = { data: action.resp, meta: { loading: false, error: false } };
      break;
    case '@@deaui:updateDocument:failure':
      newState[action.id] = { data: state[action.id].data, meta: { loading: false, error: true } };
      break;
    case '@@deaui:updateDocument:loading':
      newState[action.id] = { data: state[action.id].data, meta: { loading: true, error: false } };
      break;

    case '@@deaui:deleteDocument:success':
      if (newState[action.id]) delete newState[action.id];
      break;
    case '@@deaui:deleteDocument:failure':
      newState[action.id] = { data: {}, meta: { loading: false, error: true } };
      break;
    case '@@deaui:deleteDocument:loading':
      newState[action.id] = { data: {}, meta: { loading: true, error: false } };
      break;
    default:
      break;
  }

  return newState;
}
