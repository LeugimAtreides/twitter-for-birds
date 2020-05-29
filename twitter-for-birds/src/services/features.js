import Cookies from 'js-cookie';
import config from '../config';

export default class Features {
  static async getFeatures({ phrId, featureGroup }) {
    const resp = await fetch(`${config.api_url}/featureflexing/${phrId}/features/${featureGroup}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${Cookies.get('id_token')}`,
      },
    });
    if (!resp.ok) return Promise.reject(resp.json());
    const features = await resp.json();
    return features.features;
  }
}
