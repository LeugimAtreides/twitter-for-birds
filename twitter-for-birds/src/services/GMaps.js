/* eslint-disable no-undef */
import 'whatwg-fetch';
import { compose } from 'ramda';
import config from '../config';
import asyncFetch, {
  ok,
  toJson,
} from '../utils/fetch';

const { google } = window;

export default class GMaps {
  static async newReverseGeocode(position) {
    return new Promise((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      geocoder.geocode({ location }, (results, status) => {
        if (status === 'OK') {
          if (results[0]) {
            resolve(results[0]);
          }
        } else {
          reject(results);
        }
      });
    });
  }

  static async newGeocode(position) {
    return new Promise((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: position }, (results, status) => {
        if (status === 'OK') {
          if (results[0]) {
            const lat = results[0].geometry.location.lat();
            const lng = results[0].geometry.location.lng();
            const location = { ...results[0], lat, lng };
            resolve(location);
          }
        } else {
          reject(results);
        }
      });
    });
  }

  static async GeocodeRequest(params) {
    const resp = await compose(toJson, ok, asyncFetch)(() => fetch(`https://maps.googleapis.com/maps/api/geocode/json?${params}`));
    return resp;
  }

  static Geocode(locationString) {
    return GMaps.GeocodeRequest(new URLSearchParams({
      key: config.googleMapsKey,
      address: locationString,
    }).toString());
  }

  static ReverseGeocode(latitude, longitude) {
    return GMaps.GeocodeRequest(new URLSearchParams({
      key: config.googleMapsKey,
      latlng: `${latitude},${longitude}`,
    }).toString());
  }
}

export function getMapImage(args) {
  return new Promise(res => {
    const defaults = {
      center: [28.547948, -81.36402199999999],
      size: [195, 150],
      zoom: 14,
      maptype: 'roadmap',
    };

    const params = { ...defaults, ...args };

    const parsedParams = {
      center: typeof (params.center) === 'string' ? (params.center) : params.center.join(','),
      zoom: params.zoom,
      size: params.size.join('x'),
      mapType: params.maptype,
      markers: `color:0xFBAA49|${typeof (params.center) === 'string' ? (params.center) : params.center.join(',')}`,
      // eslint-disable-next-line no-undef
      key: KEY,
    };

    return res(`${STATIC_URL}?${queryString.stringify(parsedParams)}`);
  });
}
