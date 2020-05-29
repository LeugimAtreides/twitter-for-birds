import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import documentReducer from './documentReducer';
import collectionReducer from './collectionReducer';

export default combineReducers({
  documents: documentReducer,
  collections: collectionReducer,
  routing: routerReducer,
});
