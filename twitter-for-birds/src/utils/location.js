export const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const radius = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
    + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180))
    * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceInKilometers = radius * c;
  return distanceInKilometers;
};

export const havesineDistanceInMiles = (lat1, lon1, lat2, lon2) => Math.round(haversineDistance(lat1, lon1, lat2, lon2) * 0.621371 * 100) / 100;
