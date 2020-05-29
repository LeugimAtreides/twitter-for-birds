import _ from 'lodash';
import InitialState from './initialState';


// Create, Read, Update, Delete
export default function collectionReducer(state = InitialState.collections, action) {
  const newState = {
    ...state,
  };

  switch (action.type) {
    case '@@deaui:findCollection:success':
      newState[action.id] = {
        data: action.resp,
        meta: { loading: false, error: false },
      };
      break;
    case '@@deaui:findCollection:failure':
      newState[action.id] = {
        data: [],
        meta: { loading: false, error: true, errorResp: action.resp },
      };
      break;
    case '@@deaui:findCollection:loading':
      newState[action.id] = {
        data: [],
        meta: { loading: true, error: false },
      };
      break;
    case '@@deaui:deleteFromCollection:loading':
      newState[action.id] = {
        data: state[action.id].data,
        meta: { loading: true, error: false },
      };
      break;
    case '@@deaui:deleteFromCollection:error':
      newState[action.id] = {
        data: state[action.id].data,
        meta: { loading: false, error: true },
      };
      break;
    case '@@deaui:deleteFromCollection:success':
      _.remove(newState[action.id].data, (doc) => _.isEqual(doc, {
        ...doc,
        ...action.payload,
      }));
      newState[action.id] = {
        data: newState[action.id].data,
        meta: { loading: false, error: false },
      };
      break;
    case '@@deaui:updateFromCollection:loading':
      newState[action.id] = {
        data: state[action.id].data,
        meta: { loading: true, error: false },
      };
      break;
    case '@@deaui:updateFromCollection:error':
      newState[action.id] = {
        data: state[action.id].data,
        meta: { loading: false, error: true },
      };
      break;
    case '@@deaui:updateFromCollection:success':
      newState[action.id] = {
        data: action.resp,
        meta: { loading: false, error: false },
      };
      break;
    default:
      break;
  }

  return newState;
}
