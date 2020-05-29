import Cookies from 'js-cookie';
import { compose } from 'ramda';
import config from '../config';
import asyncFetch, {
  ok,
  toJson,
  addFormBody,
  addPostMethod,
  contentTypeFormEncoded,
} from './fetch';

export default class Auth {
  static async refreshToken() {
    const BASE_URL = `${config.api_url}/identity/oauth2/token`;
    const resp = await compose(toJson, ok, asyncFetch)(() => fetch(BASE_URL,
      compose(addFormBody({
        grant_type: 'refresh_token',
        client_id: 'org.ahss.hellowell.consumer.portal_1.0.0',
        client_secret: 'secret',
        refresh_token: Cookies.get('refresh_token'),
      }), contentTypeFormEncoded, addPostMethod)({})));

    return resp;
  }
}
