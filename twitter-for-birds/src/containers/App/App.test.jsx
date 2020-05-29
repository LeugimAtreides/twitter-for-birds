/*eslint-disable*/
import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import App from './App.jsx';

const mockStore = configureMockStore();
const store = mockStore({});

it('renders without crashing', () => {
  const props = {};

  render(
  <Provider store={store}>
    <App {...{ props }}/>
  </Provider>,
  );
});
