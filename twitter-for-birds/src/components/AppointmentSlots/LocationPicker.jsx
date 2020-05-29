/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'hw-react-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatPhoneNumber } from '../../utils/strings';

const LocationPicker = ({
  locationId,
  changeLocation,
  showTitle,
  showAddress,
  provider,
}) => {
  const office = provider?.office ?? {};
  const providerLocations = provider?.locations ?? [];
  const addressLine = office.address2 ? `${office.address1} ${office.address2}`
    : `${office.address1}`;

  const onLocation = (value) => {
    changeLocation(value);
  };

  const locationOption = (location) => <option key={location.id} value={location.id}>{location.description}</option>;

  const locationSelect = providerLocations.length > 1 ? (
    <div className="location-select">
      {showTitle && <p className="location-title">More Locations</p>}
      <Select {...{
        id: `id_location_${locationId}`,
        onChange: (e) => onLocation(e.target.value),
        value: locationId,
        'aria-label': 'More locations',
      }}
      >
        {providerLocations.map(location => locationOption(location))}
      </Select>
    </div>
  ) : (
      <p className="location-miles-away">{office.milesAway}</p>
    );

  const currentLocation = (
    <div className="location-office">
      {office.facilityName && <p className="location-facility-name">{office.facilityName.toLowerCase()}</p>}
      <div className="location-office-address">
        <FontAwesomeIcon className="office-icon" icon={['fal', 'map-marker-alt']} />
        <div className="address-info">
          <p>{addressLine.toLowerCase()}</p>
          <p>{`${office?.city}, ${office.state && office.state[0]} ${office?.zipcode}`}</p>
        </div>
      </div>
      <div className="location-office-phone">
        <FontAwesomeIcon className="phone-icon" icon={['fal', 'phone-alt']} />
        <p>
          <a className="location-office-phone" href={`tel:${formatPhoneNumber(office?.phoneNumber)}`}>
            {formatPhoneNumber(office?.phoneNumber)}
          </a>
        </p>
      </div>
    </div>
  );

  return (
    <div className="location_picker">
      {locationSelect}
      {showAddress && currentLocation}
    </div>
  );
};

LocationPicker.propTypes = {
  locationId: PropTypes.string,
  changeLocation: PropTypes.func,
  showTitle: PropTypes.bool,
  showAddress: PropTypes.bool,
  provider: PropTypes.shape({
    locations: PropTypes.array,
    office: PropTypes.object,
  }),
};

LocationPicker.defaultProps = {
  locationId: null,
  changeLocation: () => false,
  showTitle: true,
  showAddress: true,
  provider: {
    locations: [],
    office: {},
  },
};

export default LocationPicker;
