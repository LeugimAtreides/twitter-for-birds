import { compose } from 'ramda';
import config from '../config';
import asyncFetch, {
  ok, addCredentials, contentTypeJSON, toJson,
} from '../utils/fetch';

export default class tokenService {
  static getToken = async (params) => {
    const resp = await compose(toJson, ok, asyncFetch)(() => fetch(`${config.salesforce.sf_url}/token/?sf_token=${config.salesforce.sf_token}&${params}`,
      compose(contentTypeJSON, addCredentials)({})));

    return resp;
  }
}
