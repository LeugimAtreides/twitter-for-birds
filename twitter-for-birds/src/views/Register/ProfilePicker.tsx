import React from 'react'
import { SectionTitle } from 'hw-react-components';
import { ProfilePickerProps, ownerType } from './types'
import './styles/profile-picker.sass';
import { EmptyCollection } from '../../utils/constants';

const ProfilePicker: React.FC<ProfilePickerProps> = ({
  blockName = 'hwui-ProfilePicker',
  firstName = '',
  lastName = '',
  ownerPhrId = '',
  selectedPhrId = '',
  owners = EmptyCollection,
  setProfile = () => null,
}) => {
  return (
    <div className={`${blockName}__nav`}>
      <SectionTitle>
        Who is this appointment for?
      </SectionTitle>
      <ul className={`${blockName}__nav--list`}>
        <li>
          <p role="button" tabIndex={-1} className={selectedPhrId === ownerPhrId ? 'is-active' : ''} onClick={() => setProfile(ownerPhrId)}>
            <span>
              {firstName && firstName.slice(0, 1)}
              {lastName && lastName.slice(0, 1)}
            </span>
          </p>
        </li>
        {owners?.data
          .filter((owner: ownerType) => ownerPhrId !== owner.owner_phr_id)
          .map((owner: ownerType) => (
            <li key={owner.owner_phr_id}>
              <p role="button" tabIndex={-1} className={selectedPhrId === owner.owner_phr_id ? 'is-active' : ''} onClick={() => setProfile(owner.owner_phr_id)}>
                <span>
                  {owner.owner_first_name[0]}
                  {owner.owner_last_name[0]}
                </span>
              </p>
            </li>
          ))}
        <li>
          <p role="button" tabIndex={-1} className={selectedPhrId === '0' ? 'is-active' : ''} onClick={() => setProfile('0')}>
            <span>Other</span>
          </p>
        </li>
      </ul>
    </div>
  );
}

export default ProfilePicker
