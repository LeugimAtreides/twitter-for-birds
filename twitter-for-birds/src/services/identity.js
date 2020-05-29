/* eslint-disable consistent-return */
/* eslint-disable no-return-await */
import { compose } from 'ramda';
import Cookies from 'js-cookie';
import http from './http';
import config from '../config';
import asyncFetch, {
  ok,
  toJson,
  addAuth,
  addPutMethod,
  contentTypeJSON,
} from './fetch';

const BASE_URL = `${config.api_url}/identity`;

const USER_ENDPOINT = `${BASE_URL}/user`;

export default class Identity {
  static getProfile(phrId) {
    return http.auth.get(`${USER_ENDPOINT}/${phrId}/profile`);
  }

  static async setPreferredLocation({ phrId, ...body }) {
    const resp = await http.auth.post(
      `${USER_ENDPOINT}/${phrId}/preferredLocation`,
      { body },
    );
    if (!resp.ok) return Promise.reject(resp);
    return resp;
  }

  static updateProfile(phrId, body) {
    return http.auth.put(`${USER_ENDPOINT}/${phrId}/profile`, { body });
  }

  static async SearchProfile(body) {
    const resp = await http.auth.post(
      `${BASE_URL}/verification/verifyIdentity`,
      { body },
    );
    if (!resp.ok) return Promise.reject(resp);
    return resp;
  }

  static async verifyIdentitySession(sessionID) {
    const resp = await http.auth.get(`${BASE_URL}/verification/${sessionID}`);
    if (!resp.ok) return Promise.reject(resp);
    return resp.ok;
  }

  static async userProfile({ phrId }) {
    // User Profile has to be fetched often for changes,
    // appending the date so it doesn't cache the response
    const resp = await http.auth.get(
      `${USER_ENDPOINT}/${phrId}/profile?${Date.now()}`,
    );
    if (!resp.ok) return Promise.reject(resp);
    return resp.json();
  }

  static async profile({ phrId }) {
    const resp = await http.auth.get(`${USER_ENDPOINT}/${phrId}/personProfile`);
    if (!resp.ok) return Promise.reject(resp);
    return await resp.json();
  }

  static async updatePassword(phrId, body) {
    const resp = await http.auth.put(`${USER_ENDPOINT}/${phrId}/password`, {
      body,
    });
    if (!resp.ok) {
      return Promise.reject(resp);
    }
  }

  static async startEmailChange(phrId, body) {
    const resp = await http.auth.post(
      `${BASE_URL}/emailchange/${phrId}/start`,
      { body },
    );
    if (!resp.ok) {
      return Promise.reject(resp);
    }
  }

  static async completeEmailChange(phrId, body) {
    const resp = await http.auth.post(
      `${BASE_URL}/emailchange/${phrId}/complete`,
      { body },
    );
    if (!resp.ok) {
      return Promise.reject(resp);
    }
  }

  static async updateProfilePhoto(phrId, body) {
    const headers = new Headers();
    headers.append('Content-Type', undefined);

    const resp = await http.auth.post(`${USER_ENDPOINT}/${phrId}/photo`, {
      body,
      headers,
    });
    if (!resp.ok) {
      return Promise.reject(resp);
    }
  }

  static async athenaAccess({ phrId }) {
    const resp = await http.auth.get(
      `${USER_ENDPOINT}/${phrId}/sso/athena/practicesAndBrands`,
    );
    if (!resp.ok) return Promise.reject(resp);
    return await resp.json();
  }

  static async getEMPIsByPhrId({ phrId }) {
    const resp = await fetch(`${BASE_URL}/person/${phrId}/empi`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${Cookies.get('id_token')}`,
      },
    });
    if (!resp.ok) return Promise.reject(resp);
    return await resp.json();
  }


  static async getSourceNameAndValue({ ownerPhrId }) {
    const viewerPhrId = Cookies.get('phr_id');
    const resp = await fetch(
      `${BASE_URL}/sourcesystem/${viewerPhrId}/${ownerPhrId}/getSourceNameAndValue`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${Cookies.get('id_token')}`,
        },
      },
    );
    if (!resp.ok) return Promise.reject(resp);
    return await resp.json();
  }

  static async getSourceInfoForPatient({ ownerPhrId }) {
    const viewerPhrId = Cookies.get('phr_id');
    const resp = await http.auth.get(
      `${config.api_url}/healthrecords/${viewerPhrId}/${ownerPhrId}/getSourceInfoForPatient`,
    );
    if (resp.status === 404) return [];
    if (!resp.ok) return Promise.reject(resp);
    return resp.json();
  }

  static async getGuestPersons() {
    const resp = await http.auth.get(
      `${BASE_URL}/guestPerson/${Cookies.get('phr_id')}/getGuestPersons`,
    );
    if (!resp.ok) return Promise.reject(resp);
    return await resp.json();
  }

  static async toggleBetaFlag({ phrId }) {
    const resp = await compose(toJson, ok, asyncFetch)(() => fetch(`${config.api_url}/betaconsumerterms/${phrId}/toggleBetaFeatureEnabledFlag`,
      compose(addAuth, addPutMethod, contentTypeJSON)({})));
    return resp;
  }
}
