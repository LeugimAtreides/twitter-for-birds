/* eslint-disable no-return-assign */
import 'whatwg-fetch';
import Cookies from 'js-cookie';
import queryString from 'query-string';


export default async function asyncFetch(fetch, num = 1) {
  const resp = await fetch();
  let callNum = num;
  if (resp.status >= 400 && num < 3) {
    return asyncFetch(fetch, callNum += 1);
  }
  return resp;
}

export const addAuth = payload => {
  const request = payload;
  request.headers = {
    Authorization: `Bearer ${Cookies.get('id_token')}`,
    ...payload.headers,
  };

  return request;
};

export const noCache = payload => {
  const request = payload;
  request.headers = {
    'cache-control': 'no-cache',
    ...payload.headers,
  };

  return request;
};

export const credentialsSameOrigin = payload => {
  const request = payload;
  request.credentials = 'same-origin';
  return request;
};

export const credentialsInclude = payload => {
  const request = payload;
  request.credentials = 'include';
  return request;
};

export const addPostMethod = payload => {
  const request = payload;
  request.method = 'POST';
  return request;
};

export const addPutMethod = payload => {
  const request = payload;
  request.method = 'PUT';
  return request;
};

export const contentTypeJSON = payload => {
  const content = payload;
  content.headers = {
    'content-type': 'application/json',
    ...payload.headers,
  };

  return content;
};

export const contentTypeFormEncoded = payload => {
  const content = payload;
  content.headers = {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    ...payload.headers,
  };

  return content;
};

export const contentTypePDF = payload => {
  const content = payload;
  content.headers = {
    accept: 'application/pdf',
    'content-type': 'application/pdf',
    ...payload.headers,
  };

  return content;
};

export const addBody = payload => fetchPayload => {
  const request = fetchPayload;
  request.body = JSON.stringify(payload);
  return request;
};

export const addFormBody = payload => fetchPayload => {
  const request = fetchPayload;
  request.body = queryString.stringify(payload);
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

export async function toText(resp) {
  const response = await resp;
  const text = await response.text();

  return text;
}

export async function toBlob(resp) {
  const response = await resp;
  const blob = await response.blob();

  return blob;
}
