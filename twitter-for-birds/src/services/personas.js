import http from '../utils/http';
import config from '../config';

const BASE_URL = `${config.api_url}/personas`;
const GET_DEFAULT_ENDPOINT = `${BASE_URL}/default`;
const GET_ENDPOINT = BASE_URL;

export default class Personas {
  static getDefault() {
    return http.get(GET_DEFAULT_ENDPOINT);
  }

  static get(phrId) {
    return http.auth.get(`${GET_ENDPOINT}/${phrId}`);
  }

  static async getDefaultPersona() {
    const resp = await http.auth.get(GET_DEFAULT_ENDPOINT);
    if (!resp.ok) return Promise.reject(resp);
    return resp.json();
  }

  static async getPersonasByPHRID({ phrId }) {
    const resp = await http.auth.get(`${BASE_URL}/${phrId}`);
    if (!resp.ok) return Promise.reject(resp);
    return resp.json();
  }
}
