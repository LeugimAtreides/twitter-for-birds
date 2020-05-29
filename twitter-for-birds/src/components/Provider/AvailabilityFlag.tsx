import React from 'react';
import './provider-profile.sass';

type AvailabilityFlagProps = {
  availability: number,
  blockName?: string
}

// eslint-disable-next-line react/prop-types
const AvailabilityFlag: React.FC<AvailabilityFlagProps> = ({ availability, blockName = 'hwui-ProviderProfile__Provider-Stats--appointments--availability' }) => {
  if (availability == null) {
    return null;
  } return (
    <p className={`${blockName}`}>
      <i className="fa fa-clock-o" />
      {' '}
      Usually available within
      <b>
        {availability}
        {' '}
        days
      </b>
    </p>
  );
};

export default AvailabilityFlag;
