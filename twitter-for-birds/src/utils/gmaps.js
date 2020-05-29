import queryString from 'query-string';
import http from './http';
import config from '../config';

const STATIC_URL = 'https://maps.googleapis.com/maps/api/staticmap';
const GEOCODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
const KEY = config.googleMapsKey;

export function getMapImagePath(args) {
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
    key: KEY,
  };

  return `${STATIC_URL}?${queryString.stringify(parsedParams)}`;
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
      key: KEY,
    };

    return res(`${STATIC_URL}?${queryString.stringify(parsedParams)}`);
  });
}

const geocodeRequest = (params) => http.get(`${GEOCODE_URL}?${params}`)
  .then(response => response.json())
  .then(json => {
    if (!json.results.length) {
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject('No Results');
    }

    const { address_components, formatted_address, geometry: { location } } = json.results[0];

    return { address_components, formatted_address, location };
  })
  // eslint-disable-next-line prefer-promise-reject-errors
  .catch(error => Promise.reject(`There was an error: ${error}`));

export function geocode(locationString) {
  return geocodeRequest(queryString.stringify({
    key: KEY,
    address: locationString,
  }));
}

export function reverseGeocode(latitude, longitude) {
  return geocodeRequest(queryString.stringify({
    key: KEY,
    latlng: `${latitude},${longitude}`,
  }));
}
