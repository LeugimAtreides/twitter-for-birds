// TODO: Build Out Necessary Constants

export const BuildCollection = ({ data, meta }) => ({ data: data || [], meta });
export const BuildDocument = ({ data, meta }) => ({ data: data || {}, meta });
export const SchedulingFeatures = (phrId) => `SchedulingFeatures:${phrId}`;
export const Reasons = 'Reasons';
export const Providers = search => `Providers:${search}`;
export const TypeAheadParams = 'qf=fullName&page-size=15000';
export const DisneyTypeAheadParams = 'qf=fullName&page-size=15000&persona=2';
export const DelegationOwners = 'DelegationOwners';
export const PersonProfile = phrId => `PERSON_PROFILE:${phrId}`;
export const UserPersonas = (phrId) => `USER_PERSONAS:${phrId}`;
export const UserProfile = (phrId) => `USER_PROFILE:${phrId}`;
export const Appointments = (providerId, dateTime, reasonForVisit) => `APPOINTMENTS:${providerId}:${dateTime}:${reasonForVisit}`;
export const StaticMapStyle = '&style=feature:landscape.man_made|element:geometry|color:0xf7f1df&style=feature:landscape.natural|element:geometry|color:0xd0e3b4&style=feature:landscape.natural.terrain|element:geometry|visibility:off&style=feature:poi|element:labels|visibility:on&style=feature:poi.business|element:all|visibility:off&style=feature:poi.medical|element:geometry|color:0xfbd3da&style=feature:poi.park|element:geometry|color:0xbde6ab&style=feature:road|element:geometry.stroke|visibility:on&style=feature:road|element:labels|visibility:on&style=feature:road.highway|element:geometry.fill|color:0xffe15f&style=feature:road.highway|element:geometry.stroke|color:0xefd151&style=feature:road.arterial|element:geometry.fill|color:0xffffff&style=feature:road.local|element:geometry.fill|color:0xffffff&style=feature:transit.station.airport|element:geometry.fill|color:0xcfb2db&style=feature:water|element:geometry|color:0xa2daf2';
export const LocationMapImageID = (location, size) => `${location}${size.join()}`;
export const schedulingDisclaimer = 'Ratings are collected through our partner Press Ganey and are screened to ensure patient privacy. AdventHealth does not manipulate scores, pay for ratings or compensate patients in any way. For any questions about ratings please contact us.';
export const EmptyCollection = {
  data: [],
  meta: { error: false, loading: false },
};
export const EmptyDocument = {
  data: {},
  meta: { error: false, loading: false },
};
export const DynamicMapStyle = [
  {
    featureType: 'landscape.man_made',
    elementType: 'geometry',
    stylers: [
      {
        color: '#f7f1df',
      },
    ],
  },
  {
    featureType: 'landscape.natural',
    elementType: 'geometry',
    stylers: [
      {
        color: '#d0e3b4',
      },
    ],
  },
  {
    featureType: 'landscape.natural.terrain',
    elementType: 'geometry',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi.business',
    elementType: 'all',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi.medical',
    elementType: 'geometry',
    stylers: [
      {
        color: '#fbd3da',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#bde6ab',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#ffe15f',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#efd151',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#ffffff',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: 'black',
      },
    ],
  },
  {
    featureType: 'transit.station.airport',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#cfb2db',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#a2daf2',
      },
    ],
  },
];
