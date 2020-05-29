import React, { useEffect, Suspense, lazy } from 'react';

// Utils
import Cookies from 'js-cookie';
import moment from 'moment';
import { compose } from 'ramda';
import * as StringUtils from '../../utils/strings';
import AppointmentService from '../../services/appointments';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import config from '../../config';

// Components
import {
    Button,
    Form,
    Input,
    InputModifiers,
    Label,
    Radio,
    Checkbox,
    Toaster,
    Textarea,
    Select
} from 'hw-react-components';

// import ProfilePicker from '../Register/ProfilePicker';
import LoaderAnimation from '../../components/Loader/Loader';

// Hooks
import useRequestData from './useRequestData';
import usePersonProfile from '../../connector-hooks/usePersonProfile/usePersonProfile';

import {
    useHistory,
    useLocation,
    useParams,
} from 'react-router-dom';

// Style & Overrides
import './request.scss';
import hwOverrides from './request-hwui-overrides.scss';
import { ThemeProvider } from 'styled-components';

const ProfilePicker = lazy(() => import('../Register/ProfilePicker'));
//@ts-ignore
const ValidatingCheckBox: React.ComponentType = compose(InputModifiers.validates)(Checkbox);
const ValidatingRadio = InputModifiers.validates(Radio);
const ValidatingInput = InputModifiers.validates(Input);
const ValidatingTextArea = InputModifiers.validates(Textarea);
const MaskedValidatingInput = InputModifiers.mask(ValidatingInput);

type RequestProps = {
    blockName: string,
}

const Request: React.FC<RequestProps> = ({
    blockName = 'deaui-Request',
}) => {
    // State
    const notify = Toaster.show;
    const dismiss = Toaster.dismiss;
    const phr_id = Cookies.get('phr_id');
    const [selectedUser] = React.useState(phr_id);
    const [loading, setLoading] = React.useState(false);
    const [isAHMG, setAHMG] = React.useState(false);

    type Iday = {
        [key: string]: boolean
    }

    const [dayPreference, setDayPreference] = React.useState<Iday | null>({ 'No Preference': true });

    type Itime = {
        [key: string]: boolean
    }

    const [timePreference, setTimePreference] = React.useState<Itime | null>({ 'No Preference': true });

    // Hooks
    const location = useLocation()
    const history = useHistory();
    const { locationId, physicianId } = useParams();
    const searchParams = new URLSearchParams(location.search);
    const {
        userProfile,
        owners,
        provider,
        isDisney,
        doneLoading,
    } = useRequestData({ phr_id, physicianId });

    const personProfile = usePersonProfile(selectedUser);

    useEffect(() => {
        setAHMG(provider?.data?.isFhmg);
    }, [provider])

    const isLoading = loading && !doneLoading && <LoaderAnimation />;

    const insurancesForVisit = () => {
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

    const insuranceField = () => {
        return provider?.data?.insuranceAccepted ?
            <Select {...{
                name: 'insurance_name',
                id: 'id_insurance_name',
                label: 'Insurance Provider'
            }}>
                <option value="" disabled>Please select your insurance provider</option>
                <option value="*">Self-Pay</option>
                {insurancesForVisit()}
            </Select>
            :
            <ValidatingInput {...{
                name: 'insurance_name',
                id: 'id_insurance_name',
                label: 'Insurance Provider',
                placeholder: 'Insurance Provider'
            }} />
    }

    const profilePicker = () =>
        owners?.data && userProfile?.data &&
        <ProfilePicker
            firstName={userProfile?.data?.first_name}
            lastName={userProfile?.data?.last_name}
            owners={owners}
            blockName={`${blockName}__ProfilePicker`}
            setProfile={personProfile?.setProfileId} // setSelectedProfile,
            selectedPhrId={personProfile?.data?.phr_id}
            ownerPhrId={userProfile?.data?.phr_id}
        />

    const schemaCB = React.useCallback(() => {
        const {
            first_name,
            last_name,
            date_of_birth,
            gender,
            email_address,
            mobile_phone,
            home_phone,
            address1,
            address2,
            city,
            state,
            zip,
            insurance_name,
        } = personProfile?.data;

        const formattedDOB = date_of_birth ? moment(date_of_birth).format('MM/DD/YYYY') : undefined;

        return ({
            first_name: {
                value: first_name ?? '',
                validation: {
                    required: true
                }
            },
            last_name: {
                value: last_name ?? '',
                validation: {
                    required: true
                }
            },
            email_address: {
                value: email_address ?? '',
                validation: {
                    required: true,
                    emailFormat: true,
                }
            },
            insurance_name: {
                value: insurance_name ?? '',
                validation: {
                    required: false
                }
            },
            phone: {
                value: (mobile_phone && StringUtils.formatPhoneNumber(mobile_phone))
                    || (home_phone && StringUtils.formatPhoneNumber(home_phone)) || '',
                validation: {
                    required: true,
                    phoneFormat: true,
                },
            },
            date_of_birth: {
                value: formattedDOB ?? '',
                validation: {}
            },
            gender: {
                value: gender ?? '',
                validation: {
                    required: true
                }
            },
            address1: {
                value: address1 ?? '',
                validation: {}
            },
            address2: {
                value: address2 ?? '',
                validation: {}
            },
            city: {
                value: city ?? '',
                validation: {}
            },
            state: {
                value: state ?? '',
                validation: {
                    minLength: 2
                }
            },
            zip: {
                value: zip ?? '',
                validation: {
                    numbers: true,
                    minLength: 5
                }
            },
            preferred_contact_method: {
                value: '',
                validation: {},
            },
            contact: {
                value: '',
                validation: {
                    required: false
                }
            },
            additional_notes: {
                value: '',
                validation: {},
            }
        });
    }, [personProfile])

    const providerLink = () => {
        const { displayName } = provider?.data;
        return (
            <Button {...{
                onClick: () => history.push(`/scheduling/appointments/location/${locationId}/physician/${physicianId}?${searchParams.toString()}`),
                modifier: 'link',
            }}>
                {displayName}
            </Button>
        )
    }

    // Date and Time Selectors

    const selectDay = (day: string) => {
        if (day === 'No Preference') {
            return setDayPreference({ 'No Preference': true })
        }
        setDayPreference((prevState: any) => ({
            ...dayPreference,
            'No Preference': false,
            [day]: !prevState[day]
        }))
    }

    const selectTime = (time: string) => {
        if (time === 'No Preference') {
            return setTimePreference({ 'No Preference': true });
        }
        setTimePreference((prevState: any) => ({
            ...timePreference,
            'No Preference': false,
            [time]: !prevState[time],
        }))
    }

    const getDaySelector = (day: string) => {
        const check = dayPreference?.[day] === true ? <FontAwesomeIcon icon={['fas', 'check']} /> : null;
        const buttonMod = dayPreference?.[day] === true ? 'success' : 'default';

        return (
            <Button {...{
                type: 'button',
                onClick: () => selectDay(day),
                modifier: buttonMod,
            }}>
                {check} {day}
            </Button>
        )
    }

    const getTimeSelector = (time: string) => {
        const check = timePreference?.[time] === true ? <FontAwesomeIcon icon={['fas', 'check']} /> : null;
        const buttonMod = timePreference?.[time] === true ? 'success' : 'default';

        return (
            <Button {...{
                type: 'button',
                onClick: () => selectTime(time),
                modifier: buttonMod,
            }}>
                {check} {time}
            </Button>
        )
    }

    const appointmentPreferences = (
        <div className={`${blockName}__Appointment-Preferences`}>
            <Label required={false}>Preferred Appointment Date and Time</Label>
            <div className={`${blockName}__Appointment-Preferences--selector-field`}>
                <Label>Preferred Days</Label>
                <div className={`${blockName}__Appointment-Preferences--selector-group`}>
                    {getDaySelector('Monday')}
                    {getDaySelector('Tuesday')}
                    {getDaySelector('Wednesday')}
                    {getDaySelector('Thursday')}
                    {getDaySelector('Friday')}
                    {getDaySelector('No Preference')}
                </div>
            </div>

            <div className={`${blockName}__Appointment-Preferences--selector-field`}>
                <Label>Preferred Times</Label>
                <div className={`${blockName}__Appointment-Preferences--selector-group`}>
                    {getTimeSelector('Morning')}
                    {getTimeSelector('Afternoon')}
                    {getTimeSelector('Evening')}
                    {getTimeSelector('No Preference')}
                </div>
            </div>
        </div>
    )

    const genderField = () => (
        <div className={`${blockName}__Gender`}>
            <Label required={true}>Gender</Label>
            <div className={`${blockName}__Gender--radios`}>
                <ValidatingRadio {...{
                    name: 'gender',
                    id: 'id_gender_male',
                    onSelectValue: 'male'
                }}>Male</ValidatingRadio>
                <ValidatingRadio {...{
                    name: 'gender',
                    id: 'id_gender_female',
                    onSelectValue: 'female'
                }}>Female</ValidatingRadio>
            </div>
        </div>
    )

    const preferredContactMethod = () => (
        <div className={`${blockName}__Preferred-Contact-Method`}>
            <Label required={false}>Preferred Contact Method</Label>
            <div className={`${blockName}__Preferred-Contact-Method--radios`}>
                <Radio {...{
                    name: 'preferred_contact_method',
                    id: 'id_contact_method_phone',
                    onSelectValue: 'phone'
                }}>Phone</Radio>
                <Radio {...{
                    name: 'preferred_contact_method',
                    id: 'id_contact_method_email',
                    onSelectValue: 'email'
                }}>Email</Radio>
            </div>
        </div>
    )

    const parseString = (obj: any) => {
        let keys = Object.keys(obj).filter((key: any) => obj[key]);
        if (keys.length > 0) {
            return keys.join(', ');
        } else {
            return 'No Preference';
        }
    }

    const requestNonAHMGAppointment = (schema: any) => {
        const request = {
            address1: schema.get('address1').value,
            address2: schema.get('address2').value,
            first_name: schema.get('first_name').value,
            last_name: schema.get('last_name').value,
            date_of_birth: moment(schema.get('date_of_birth').value).format('YYYY-MM-DD'),
            city: schema.get('city').value,
            state: schema.get('state').value,
            zip: schema.get('zip').value,
            phone_number: schema.get('phone').value,
            gender: schema.get('gender').value,
            email_address: schema.get('email_address').value,
            insurance: schema.get('insurance_name').value,
            internal_note: `
            Preferred days: ${parseString(dayPreference)}
            Preferred times: ${parseString(timePreference)}
            `,
            request_reason: isDisney ? 'Member Inquiry Request' : 'Request an Appointment AHA',
            RecordTypeId: isDisney ? config.salesforce.member_inquiry_id : config.salesforce.consumer_inquiry_id,
            additional_notes: schema.get('additional_notes').value,
            WebForm__c: config.salesforce.webform_id,
            Campaign_Channel__c: config.salesforce.campaign_channel,
            physician_name: provider?.data?.fullName,

            description: `Requested provider location address ${provider?.data?.fullAddress}`,
            // ...( this.isDisney ? {
            //   preferred_date_1: schema.get('preferred_date_1').value ? moment(schema.get('preferred_date_1').value).format('YYYY-MM-DD') : '',
            //   preferred_time_1: schema.get('preferred_time_1').value,
            //   preferred_date_2: schema.get('preferred_date_2').value ? moment(schema.get('preferred_date_2').value).format('YYYY-MM-DD') : '',
            //   preferred_time_2: schema.get('preferred_time_2').value
            // } : {})
        };

        return AppointmentService.requestSalesForceAppointment(request);
    }


    const requestAHMGAppointment = (schema: any) => {
        const anonymous = !selectedUser;
        const { athenaProviderId, departmentId, practiceId } = provider?.data.office;

        const request = {
            address1: schema.get('address1').value,
            address2: schema.get('address2').value,
            first_name: schema.get('first_name').value,
            last_name: schema.get('last_name').value,
            date_of_birth: moment(schema.get('date_of_birth').value).format(
                'YYYY-MM-DD'
            ),
            gender: schema.get('gender').value,
            city: schema.get('city').value,
            state: schema.get('state').value,
            zip:
                schema.get('zip').value === ''
                    ? null
                    : parseInt(schema.get('zip').value, 10),
            athena_provider_id: athenaProviderId,
            department_id: departmentId,
            practice_id: practiceId,
            preferred_contact_method: schema.get('preferred_contact_method').value,
            contact: schema.get('contact').value,
            mobile_phone: schema.get('phone').value.replace(/\D/g, ''),
            email: schema.get('email_address').value,
            insurance: schema.get('insurance_name').value,
            patient_id: '',
            internal_note: `
              Preferred days: ${parseString(dayPreference)}
              Preferred times: ${parseString(timePreference)}
            `,
            additional_notes: schema.get('additional_notes').value
        };

        if (anonymous) {
            return AppointmentService.createPatientCaseForAnonymousPatient(request);
        } else {
            return AppointmentService.createPatientCaseForSelfOrDelegatedPatient(
                selectedUser,
                request
            );
        }
    }

    const requestAppointment = async (e: MouseEvent, schema: any) => {
        console.log(schema);
        e.preventDefault();

        const requestAppointment = notify({
            message: 'Requesting appointment',
            status: 'info'
        });
        let resp;

        setLoading(true);

        try {
            resp = isAHMG ? await requestAHMGAppointment(schema) : await requestNonAHMGAppointment(schema);
        } catch (err) {
            resp = err;
        }

        dismiss(requestAppointment);
        setLoading(false)

        if (resp.ok) {
            notify(
                {
                    message: 'Appointment successfully requested',
                    status: 'success'
                },
                6500
            );
            history.push('/scheduling/request/confirmation');
        } else if (resp.status === 500) {
            notify(
                {
                    message: 'There was an issue requesting your appointment',
                    status: 'danger'
                },
                6500
            );
        } else if (resp.Status === 'Success') {
            notify({
                message: "Appointment successfully requested",
                status: "success"
            }, 6500)
            history.push('/scheduling/request/confirmation');
        } else {
            console.log(resp);
            resp.text().then((body: any) => {
                const invalidPhoneNumber = /invalid phone numbers/.test(body);

                notify(
                    {
                        message: invalidPhoneNumber
                            ? 'There was an error submitting your form. Please enter a valid phone number and try again.'
                            : 'There was an issue requesting your appointment',
                        status: 'danger'
                    },
                    6500
                );
            });
        }
    };

    const scheme = !personProfile?.meta?.loading && doneLoading && schemaCB();

    return (
        <ThemeProvider theme={hwOverrides}>
            <div className={blockName}>
                <Toaster />
                {isLoading}
                {doneLoading && !personProfile?.meta?.loading &&
                    <Form {...{
                        schema: scheme,
                        onSubmit: requestAppointment,
                        showRequired: true,
                    }}>
                        <div className={`${blockName}__Title`}>
                            <h1 className={`${blockName}__Title--header`}>
                                Request Appointment
                            </h1>
                            <h2 className={`${blockName}__Title--command`}>
                                Enter Your Patient Information
                            </h2>
                            <div className={`${blockName}__Title--provider-name`}>
                                Provider: {providerLink()}
                            </div>
                            <Suspense fallback={<LoaderAnimation fixed={false}/>}>
                            {profilePicker()}
                            </Suspense>
                            <div className={`${blockName}__Title--required-message`}>
                                <span className={`${blockName}__Title--required-message--notice`}>*</span> Required Field
                            </div>
                        </div>
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
                        <ValidatingInput {...{
                            label: 'Email Address',
                            placeholder: 'example@domain.com',
                            id: 'id_email_address',
                            name: 'email_address'
                        }}
                        />
                        {insuranceField()}
                        <MaskedValidatingInput {...{
                            name: 'phone',
                            id: 'id_phone',
                            label: 'Phone Number',
                            placeholder: 'Phone Number',
                            mask: '(999) 999-9999'
                        }} />
                        <MaskedValidatingInput {...{
                            name: 'date_of_birth',
                            id: 'id_date_of_birth',
                            label: 'Date of Birth',
                            placeholder: 'Date of Birth',
                            mask: '99/99/9999'
                        }} />
                        {genderField()}
                        <ValidatingInput {...{
                            label: 'Street',
                            placeholder: 'Street',
                            id: 'id_address1',
                            name: 'address1'
                        }}
                        />
                        <ValidatingInput {...{
                            label: 'Unit',
                            placeholder: 'Unit',
                            id: 'id_address2',
                            name: 'address2'
                        }}
                        />
                        <ValidatingInput {...{
                            label: 'City',
                            placeholder: 'City',
                            id: 'id_city',
                            name: 'city'
                        }}
                        />
                        <ValidatingInput {...{
                            label: 'State',
                            placeholder: 'State',
                            id: 'id_state',
                            name: 'state'
                        }}
                        />
                        <ValidatingInput {...{
                            label: 'Zip/Postal Code',
                            placeholder: 'Zipcode',
                            id: 'id_zip',
                            name: 'zip'
                        }}
                        />
                        {preferredContactMethod()}
                        {appointmentPreferences}
                        <ValidatingTextArea {...{
                            name: 'additional_notes',
                            id: 'id_additional_notes',
                            label: 'Additional Notes',
                            rows: 5,
                            placeholder: 'Anything we need to know before your visit?...'
                        }} />
                        <ValidatingCheckBox {...{
                            onSelectValue: 'agreed',
                            name: 'contact',
                            id: 'id_contact',
                            validateOn: new Set(['onClick']),
                        }}>
                            <p className={`${blockName}__contact-message`}>I&apos;d like AdventHealth to send me information about its various services via phone, email, or direct mail.</p>
                        </ValidatingCheckBox>
                        <Button {...{
                            type: 'submit',
                            modifier: 'info',
                            size: 'md'
                        }}>Submit</Button>
                    </Form>
                }
            </div >
        </ThemeProvider>
    )
};

export default Request