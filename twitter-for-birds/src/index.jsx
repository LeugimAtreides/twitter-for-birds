import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import App from './containers/App/App';
import reducer from './reducers';
import apiMiddleware from './utils/apiMiddleware';
import './style-variables/main.scss';

const store = createStore(
  reducer,
  compose(
    applyMiddleware(thunk, apiMiddleware),
    // eslint-disable-next-line no-underscore-dangle
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  ),
);

ReactDOM.render(
  <div className="deaui">
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    </Provider>
  </div>,
  document.getElementById('root'),
);
