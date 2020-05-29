import React from 'react';
import { formatPhoneNumber } from '../../utils/strings';
import { StaticMapStyle } from '../../utils/constants';
import { EmptyDocumentType } from '../../utils/globalTypes';
import { EmptyDocument } from '../../utils/constants';

type OfficeDetailsProps = {
  blockName?: string,
  provider: any,
  mapImage: EmptyDocumentType,
  showMap: boolean
}

const OfficeDetails: React.FC<OfficeDetailsProps> = ({
  provider = {},
  mapImage = EmptyDocument,
  showMap = true,
  blockName = 'hwui-RegisterConfirm__Office-Card'
}) => {
  const { office, fullAddress } = provider
  return (
    <div className={`${blockName}`}>
      {
        showMap && (
          <a className={`${blockName}--Image-Link`} href={`https://maps.google.com/?q=${fullAddress}`} target="_blank" rel="noopener noreferrer">
            {mapImage && <img alt="Map" src={`${mapImage.data}${StaticMapStyle}`} />}
          </a>
        )
      }
      <h2 data-testid="officeDetailsH2" className={`${blockName}--Office-Name`}>{`${office.city} Office`}</h2>
      <p className={`${blockName}--Address`}>
        {office.address1}
        {' '}
        <br />
        {office.address2}
        {' '}
        {office.address2 && <br />}
        {`${office.city}, ${office.state[0]} ${office.zipcode}`}
      </p>
      <p className={`${blockName}--Phone`}>{formatPhoneNumber(office.phoneNumber)}</p>
      <a className={`${blockName}--Directions-Link`} href={`https://maps.google.com/?q=${fullAddress}`} target="_blank" rel="noopener noreferrer">Get Directions</a>
    </div>
  );
}

export default OfficeDetails;
