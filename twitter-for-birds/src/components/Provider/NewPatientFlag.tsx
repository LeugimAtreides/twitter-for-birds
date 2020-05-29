import React from 'react';
import './provider-profile.sass';

type NewPatientFlagProps = {
  newPatients: boolean,
  blockName?: string
}

// eslint-disable-next-line react/prop-types
const NewPatientFlag: React.FC<NewPatientFlagProps> = ({ newPatients, blockName = 'hwui-ProviderProfile__Provider-Stats--appointments' }) => {
  // Returns appropriate flag depending on the status of the provider.
  if (newPatients == null) {
    return null;
  } return (newPatients
    ? (
      <p className={`${blockName}--true`}>
        <i className="fa fa-check" />
        {' '}
        {' '}Accepting{' '}
        <b className={`${blockName}--true`}>new patients</b>
      </p>
    )
    : (
      <p className={`${blockName}--false`}>
        <i className="fa fa-exclamation" />
        {' '}
        Not accepting
        <b className={`${blockName}--false`}>new patients</b>
      </p>
    )
  );
};

export default NewPatientFlag;
