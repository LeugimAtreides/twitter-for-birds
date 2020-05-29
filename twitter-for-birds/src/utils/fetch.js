import 'whatwg-fetch';
import Cookies from 'js-cookie';

export default async function asyncFetch(fetch, num = 1) {
  const resp = await fetch();
  let callNum = num;
  if ((resp.status === 401 || resp.status === 500) && num < 3) {
    asyncFetch(fetch, callNum += 1);
  }
  return resp;
}

export const addPostMethod = (payload) => {
  const request = payload;
  request.method = 'POST';
  return request;
};

export const contentTypeJSON = (payload) => {
  const content = payload;
  content.headers = {
    'content-type': 'application/json',
    ...payload.headers,
  };

  return content;
};

export const contentTypePOST = (payload) => {
  const content = payload;
  content.headers = {
    'content-type': 'application/x-www-form-urlencoded',
    ...payload.headers,
  };

  return content;
};

export const addCredentials = (payload) => {
  const content = payload;
  content.credentials = 'include';
  return content;
};

export const addBody = (payload) => (fetchPayload) => {
  const request = fetchPayload;
  const queryString = Object.keys(payload).map((key) => `${key}=${encodeURIComponent(payload[key])}`).join('&');
  request.body = queryString;
  return request;
};

export async function ok(resp) {
  const response = await resp;
  if (!response.ok) {
    return Promise.reject(response);
  }
  return response;
}

export async function toJson(resp) {
  const json = await resp;
  const data = await json.json();
  return data;
}

export const addAuth = (payload) => {
  const request = payload;
  request.headers = {
    Authorization: `Bearer ${Cookies.get('id_token')}`,
    ...payload.headers,
  };
};

export const addPutMethod = (payload) => {
  const request = payload;
  request.method = 'PUT';
  return request;
};

// FOR DEV TESTING OF PROTECTED API ROUTES
async function refreshToken() {
  // const brendaF = 'https://phr-testing.ahss.io/api/v1/identity/oauth2/token?grant_type=password&client_id=client&client_secret=secret&username=brendaf%40mailinator.com&password=Testing123!';
  const sandraB = 'https://phr-testing.ahss.io/api/v1/identity/oauth2/token?grant_type=password&client_id=client&client_secret=secret&username=sandrab31%40mailinator.com&password=Testing123@';
  // const jamieB = 'https://phr-testing.ahss.io/api/v1/identity/oauth2/token?grant_type=password&client_id=client&client_secret=secret&username=jamiebarker%40mailinator.com&password=Testing123!';
  const response = await fetch(sandraB, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    referrerPolicy: 'no-referrer',
  });
  return response.json();
}

export function setAppToken() {
  // Set initial token
  refreshToken()
    .then((data) => {
      const { id_token } = data;
      Cookies.set('id_token', id_token);
    });

  // Refresh the token
  setInterval(
    () => {
      refreshToken()
        .then((data) => {
          const { id_token } = data;
          Cookies.set('id_token', id_token);
        });
    },
    290000,
  );
}
