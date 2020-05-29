import http from './http';
// import queryString from 'query-string';
import config from '../config';
import Cookie from 'js-cookie';

const BASE_URL = config.api_url + '/scheduling/appointment';

// const OPEN_ENDPOINT = BASE_URL + '/open';
// const SET_ENDPOINT = BASE_URL + '/';
// const GET_REASONS = BASE_URL + '/reasons';
// const GET_BOOKED = BASE_URL + '/booked/';
const SF_URL = config.salesforce.api_url;
const viewerPhrId = Cookie.get('phr_id');

export default class Appointments {
  static async createPatientCaseForAnonymousPatient(body) {
    const resp = await http.auth.post(`${BASE_URL}/${viewerPhrId}/createPatientCaseForAnonymousPatient`, {
      body
    });

    if (!resp.ok) return Promise.reject(resp);

    return resp;
  }

  static async createPatientCaseForSelfOrDelegatedPatient(ownerPhrId, body) {
    console.log(body)
    const resp = await http.auth.post(`${BASE_URL}/${viewerPhrId}/createPatientCaseForSelfOrDelegatedPatient/${ownerPhrId}`, {
      body
    });

    if (!resp.ok) return Promise.reject(resp);

    return resp;
  }

  static async requestSalesForceAppointment(body){
    const resp = await fetch(SF_URL, {
      method: 'POST',
      headers: {
        "Token": config.salesforce.api_token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...body
      })
    });

    if (!resp.ok) return Promise.reject(resp.json());
    return resp.json();
  }
}