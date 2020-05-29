/* eslint-disable */
import React, { useEffect, useState } from 'react';
import SalesForceContext from '../../context/SalesForceContext';
import TokenService from '../../services/sftoken';
import { BrowserRouter as RouterWrapper } from 'react-router-dom';
import Cookies from 'js-cookie';
import Routes from '../../components/AppRoute/Routes';
import { setAppToken } from '../../utils/fetch.js'
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fal } from '@fortawesome/pro-light-svg-icons';
import { fad } from '@fortawesome/pro-duotone-svg-icons';
import { fas } from '@fortawesome/pro-solid-svg-icons';

library.add(fab, fal, fad, fas);

// Set initial token & Refresh every 5 mins
setAppToken()

// For validation with token and phr_id
// Cookies.set('phr_id', '685ae71c-7333-47fe-bec8-2769c24981c6') // brendaF 
Cookies.set('phr_id', '3bedac43-97cf-4b56-b476-3a8677efe23c') // sandraB 
// Cookies.set('phr_id', '171a6e78-e3a5-4b12-8c25-594713d3ec07') // jamieB 

export const App = () => {
  const params = new URLSearchParams(window.location.search)
  const [sf, setSf] = useState({});
  useEffect(() => {
    TokenService.getToken(params).then((token) => {
      setSf(token);
    })
  }, [])
  return (
    <div>
      <SalesForceContext.Provider value={sf}>
        <RouterWrapper>
          <Routes />
        </RouterWrapper>
      </SalesForceContext.Provider>
    </div>
  );
}

export default App;
