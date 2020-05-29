/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
import React from 'react';
import PropTypes from 'prop-types';
import { Accordion } from 'hw-react-components';
import MapPreview from '../MapPreview/MapPreview.tsx';
import { havesineDistanceInMiles } from '../../utils/location';
import { formatPhoneNumber } from '../../utils/strings';
import '../Provider/provider-profile.sass';

const Locations = ({
  previewImage, mapOnClick, provider, latitude, longitude, blockName = 'hwui-ProviderProfile__Location',
}) => {
  const officeList = provider.officeAddress?.map((office, index) => {
    const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    const addressLine = office.address2 ? `${office.address1} ${office.address2 || ''}` : `${office.address1}`;
    const dist = office.geoLocation && havesineDistanceInMiles(
      latitude,
      longitude,
      office.geoLocation.x,
      office.geoLocation.y,
    );

    const titleContent = (
      <div className={`${blockName}__Office-List--office--header`}>
        <div className={`${blockName}__Office-List--office--header--marker`}><p>{alphabet[index]}</p></div>
        <p className={`${blockName}__Office-List--office--header--city`}>{office.city}</p>
        <p className={`${blockName}__Office-List--office--header--distance`}>
          {' '}
          {dist}
          {' '}
          miles away
        </p>
      </div>
    );

    const phoneNumber = formatPhoneNumber(office.phoneNumber);
    const phoneLink = `tel:${phoneNumber}`;

    return (
      <Accordion title={titleContent} show={index === 0} key={office.id}>
        <div className={`${blockName}__Office-List--office`}>
          <div className={`${blockName}__Office-List--office--expanded`}>
            {office.facilityName && <p className={`${blockName}__Office-List--office--expanded--name`}>{office.facilityName}</p>}
            <p className={`${blockName}__Office-List--office--expanded--address`}>
              {addressLine.toLowerCase()}
              {' '}
              <br />
              {' '}
              {office.city}
              ,
              {' '}
              {office.state[0]}
              {' '}
              {office.zipcode}
            </p>
            <p className={`${blockName}__Office-List--office--expanded--phone`}><a href={phoneLink}>{phoneNumber}</a></p>
          </div>
        </div>
      </Accordion>
    );
  });

  return (
    <div className={`${blockName}`}>
      <div className={`${blockName}__Office-List`}>
        {officeList}
      </div>
      <MapPreview
        previewImage={previewImage}
        clickHandler={mapOnClick}
      />
    </div>
  );
};

Locations.propTypes = {
  blockName: PropTypes.string,
  provider: PropTypes.object.isRequired,
  previewImage: PropTypes.object,
  mapOnClick: PropTypes.func.isRequired,
  latitude: PropTypes.string,
  longitude: PropTypes.string,
};

export default Locations;
