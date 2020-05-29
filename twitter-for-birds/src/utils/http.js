/*eslint-disable*/
import Cookies from 'js-cookie';
import queryString from 'query-string';
import httpRequest from './request';
import Auth from './Auth';

// Unauthenticated requests
const methods = ['get', 'post', 'delete', 'put'];

const encodeBody = (fetchOptions) => {
  if (fetchOptions.body == null) {
    return null;
  } if (
    fetchOptions.headers.get('Content-Type')
    === 'application/x-www-form-urlencoded'
  ) {
    return queryString.stringify(fetchOptions.body);
  } if (fetchOptions.headers.get('Content-Type') === 'application/json') {
    return JSON.stringify(fetchOptions.body);
  }

  return fetchOptions.body;
};

const request = (method, url, options) => {
  const fetchOptions = {
    ...options,
    method: method.toUpperCase(),
  };

  fetchOptions.headers = fetchOptions.headers || new Headers();

  if (
    fetchOptions.headers.has('Content-Type') !== true
    && fetchOptions.body != null
  ) {
    fetchOptions.headers.append('Content-Type', 'application/json');
  } else if (fetchOptions.headers.get('Content-Type') === 'undefined') {
    fetchOptions.headers.delete('Content-Type');
  }

  fetchOptions.body = encodeBody(fetchOptions);

  return httpRequest(url, fetchOptions);
};

const http = { auth: {} };

methods.forEach((method) => {
  http[method] = request.bind(null, method);
});

// Authenticated Request

const getAuthentificationHeader = () => `Bearer ${Cookies.get('id_token')}`;

const authRequest = (method, requestPath, options = {}, numTry = 0) => {
  const token = getAuthentificationHeader();
  const fetchOptions = { ...options };

  fetchOptions.headers = fetchOptions.headers || new Headers();
  fetchOptions.headers.append('Authorization', token);

  return http[method](requestPath, fetchOptions).then((response) => {
    if (!response.ok && response.status === 401 && numTry < 3) {
      return updateToken(() => authRequest(method, requestPath, options, numTry + 1));
    }

    return response;
  });
};

let updateToken = (callback) => Auth.refreshToken()
  .then(callback)
  .catch((error) => {
    throw new Error(error);
  });

methods.forEach((method) => {
  http.auth[method] = authRequest.bind(null, method);
});

// export

export default http;
