import React from 'react';
import moment from 'moment';
import { compose } from 'ramda';
import * as StringUtils from '../../utils/strings';
import { Button, Form, Input, InputModifiers, Select, Checkbox, } from 'hw-react-components';
import ProfilePicker from './ProfilePicker';
import {
  EmptyCollection,
  EmptyDocument,
} from '../../utils/constants';
import LoaderAnimation from '../../components/Loader/Loader';
import './styles/form.sass';

// @ts-ignore
const ValidatingCheckBox: React.ComponentType = compose(InputModifiers.validates)(Checkbox);
const ValidatingInput = InputModifiers.validates(Input);
const MaskedValidatingInput = InputModifiers.mask(ValidatingInput);

type RegisterFormProps = {
  blockName: string,
  profile: any,
  owners: any,
  provider: any,
  usePersonProfile(phr_id: string): any,
  onSubmit(e: any, schema: any): any
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  blockName = 'hwui-RegisterForm',
  profile = EmptyDocument,
  owners = EmptyCollection,
  provider = EmptyDocument,
  usePersonProfile = () => null,
  onSubmit = () => false,
}) => {
  const personProfile = usePersonProfile(profile?.data?.phr_id)

  function profilePicker() {
    return owners?.data && profile?.data && personProfile?.data &&
      <ProfilePicker
        firstName={profile?.data?.first_name}
        lastName={profile?.data?.last_name}
        owners={owners}
        setProfile={personProfile?.setProfileId} // setSelectedProfile,
        selectedPhrId={personProfile?.data?.phr_id ?? personProfile?.phrId}
        ownerPhrId={profile?.data?.phr_id}
      />
  }

  function schema() {
    const {
      first_name: firstName,
      last_name: lastName,
      date_of_birth: dob,
      gender,
      email_address: email,
      insurance_name,
      mobile_phone: mobilePhone,
      home_phone: homePhone,
    } = personProfile?.data;

    const formattedDOB = dob ? moment(dob).format('MM/DD/YYYY') : undefined;

    return ({
      first_name: {
        value: firstName || '',
        validation: {
          required: true
        }
      },
      last_name: {
        value: lastName || '',
        validation: {
          required: true
        }
      },
      date_of_birth: {
        value: formattedDOB || '',
        validation: {
          required: true
        }
      },
      phone: {
        value: (mobilePhone && StringUtils.formatPhoneNumber(mobilePhone))
          || (homePhone && StringUtils.formatPhoneNumber(homePhone)) || '',
        validation: {
          required: true,
          phoneFormat: true
        }
      },
      gender: {
        value: gender || '',
        validation: {
          required: true
        }
      },
      email_address: {
        value: email || '',
        validation: {
          required: true,
          emailFormat: true
        }
      },
      insurance_name: {
        value: insurance_name || '',
        validation: {
          required: false
        }
      },
      contact: {
        value: '',
        validation: {
          required: false
        }
      }
    });
  }

  function submitHandler(e: any, schema: any) {
    e.preventDefault();
    onSubmit(schema, personProfile?.data.phr_id);
  }

  function insuranceField() {
    return provider?.data.insuranceAccepted ?
      <div className="hwui-InlineFormGroup">
        <Select {...{
          name: 'insurance_name',
          id: 'id_insurance_name',
          label: 'Insurance Provider'
        }}>
          <option value="" disabled>Please select your insurance provider</option>
          {insurancesForVisit()}
        </Select>
      </div>
      :
      <div className="hwui-InlineFormGroup">
        <ValidatingInput {...{
          name: 'insurance_name',
          id: 'id_insurance_name',
          label: 'Insurance Provider',
          placeholder: 'Insurance Provider'
        }} />
      </div>
  }

  function insurancesForVisit() {
    return (provider?.meta?.loading ? [] :
      provider?.data?.insuranceAccepted.map((insurance: any) =>
        <option
          value={insurance}
          key={insurance}>
          {insurance}
        </option>
      )
    );
  }

  function contactField() {
    return (
      <div className="hwui-InlineFormGroup">
        <ValidatingCheckBox {...{
          onSelectValue: 'agreed',
          name: 'contact',
          id: 'id_contact',
          validateOn: new Set(['onClick'])
        }}>
          <p className={`${blockName}__contact-message`}>I&apos;d like AdventHealth to send me information about its various <br /> services via phone, email, or direct mail.</p>
        </ValidatingCheckBox>
      </div>
    )
  }

  return (
    <div className={blockName}>
      {profile?.meta?.loading && personProfile?.meta?.loading && <LoaderAnimation />}
      {
        profile?.data && personProfile?.data && (
          <Form {...{
            onSubmit: submitHandler,
            schema: schema(),
          }}>
            <main>
              <h3>Please provide us with your details</h3>
              <div className="hwui-Card">
                {profilePicker()}
              </div>
              <fieldset className="hwui-Card">
                <div className="hwui-InlineFormGroup">
                  <ValidatingInput {...{
                    name: 'first_name',
                    id: 'id_first_name',
                    label: 'First Name',
                    placeholder: 'First Name'
                  }} />
                  <ValidatingInput {...{
                    name: 'last_name',
                    id: 'id_last_name',
                    label: 'Last Name',
                    placeholder: 'Last Name'
                  }} />
                </div>
                <div className="hwui-InlineFormGroup">
                  <MaskedValidatingInput {...{
                    name: 'date_of_birth',
                    id: 'id_date_of_birth',
                    label: 'Date of Birth',
                    placeholder: 'Date of Birth',
                    mask: '99/99/9999'
                  }} />
                  <MaskedValidatingInput {...{
                    name: 'phone',
                    id: 'id_phone',
                    label: 'Phone Number',
                    placeholder: 'Phone Number',
                    mask: '(999) 999-9999'
                  }} />
                </div>
                <div className="hwui-InlineFormGroup">
                  <ValidatingInput {...{
                    name: 'email_address',
                    id: 'id_email_address',
                    label: 'Email Address',
                    placeholder: 'Email Address'
                  }} />
                  <Select {...{
                    name: 'gender',
                    id: 'id_gender',
                    label: 'Gender',
                  }}>
                    <option disabled value="">Please select your gender</option>
                    <option value="male">male</option>
                    <option value="female">female</option>
                  </Select>
                </div>
                {insuranceField()}
                {contactField()}
              </fieldset>
              <div className="button-wrapper">
                <Button {...{
                  type: 'submit',
                  modifier: 'info',
                  size: 'md'
                }}>
                  Next
                  </Button>
              </div>
            </main>
          </Form>
        )
      }
    </div>
  );
};

export default RegisterForm