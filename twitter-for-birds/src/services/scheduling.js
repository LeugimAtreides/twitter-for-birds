import { compose } from 'ramda';
import Cookie from 'js-cookie';
import asyncFetch, {
  toJson,
  addAuth,
  ok,
  contentTypeJSON,
} from '../utils/fetch';
import ProviderModel from '../utils/providerModel';
import config from '../config';

const PROVIDERS_URL = `${config.ps_url}/provider`;
const SCHEDULING_URL = `${config.scheduling_url}/scheduling`;
const viewerPhrId = Cookie.get('phr_id');
const SF_APP = config.salesforce.scheduling_sf_app;

export default class Scheduling {
  static async reasons() {
    const resp = await compose(toJson, ok, asyncFetch)(() => fetch(`${SCHEDULING_URL}/appointment/atlas/reasons`,
      compose(addAuth)({})));
    return resp;
  }

  static async providers({ params }) {
    const resp = await compose(toJson, ok, asyncFetch)(() => fetch(`${PROVIDERS_URL}/search?${params}`,
      compose(addAuth, contentTypeJSON)({})));
    const modeledProviders = resp.providers.map((provider) => new ProviderModel(provider));
    const providers = {
      ...resp,
      providers: modeledProviders,
    };
    return providers;
  }

  static async provider({ params }) {
    const resp = await fetch(`${PROVIDERS_URL}/search?ID=${params}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!resp.ok) return Promise.reject(resp);
    const json = await resp.json();
    return new ProviderModel(json.providers[0]);
  }

  static async typeAhead(input) {
    const resp = await compose(toJson, ok, asyncFetch)(() => fetch(`${PROVIDERS_URL}/autocomplete?terms=${input}`,
      compose(contentTypeJSON)({})));
    return resp;
  }

  static async providerRatings({ uuid, page, size }) {
    const resp = await compose(toJson, ok, asyncFetch)(() => fetch(`${PROVIDERS_URL}/reviews?providerId=${uuid}&sort=reviewDate,DESC&page=${page}&size=${size}`,
      compose(addAuth)({})));
    return resp;
  }

  static async appointments({
    appointmentReason, providerId, startDate, endDate,
  }) {
    const resp = await fetch(`${SCHEDULING_URL}/appointment/atlas/${appointmentReason}/${providerId}?startDate=${startDate}&endDate=${endDate}`);
    if (!resp.ok) return Promise.reject(resp);
    const json = await resp.json();
    return json.data;
  }

  static async createAppointmentAtlas({ ownerPhrId, body }) {
    const resp = await fetch(`${SCHEDULING_URL}/appointment/atlas/${viewerPhrId}/create/${ownerPhrId}?sf_app=${SF_APP}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${Cookie.get('id_token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return resp;
  }
}
