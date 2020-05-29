import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';
import {
    Checkbox,
    Label,
    Radio,
    Select,
    Accordion
} from 'hw-react-components';

const Affiliations = (value, onChange, blockName) => {
    if (value.length > 5) {
        return (
            <div className={`${blockName}__Affiliations`}>
                <Label>Hospital Affiliations</Label>
                <Accordion title={''}
                    fromBottom={true}
                    topContent=
                    {value.slice(0, 5).map(affiliation => <Checkbox key={affiliation.value}
                        {...{
                            onChange,
                            onSelectValue: affiliation.value,
                            name: affiliation.name,
                            id: `id_${affiliation.name}_${affiliation.value}`,
                            value: affiliation.enabled ? affiliation.value : ''
                        }}>{affiliation.label} ({affiliation.recordCount})</Checkbox>)}>
                    {value.slice(5, value.length).map(affiliation => <Checkbox key={affiliation.value}
                        {...{
                            onChange,
                            onSelectValue: affiliation.value,
                            name: affiliation.name,
                            id: `id_${affiliation.name}_${affiliation.value}`,
                            value: affiliation.enabled ? affiliation.value : ''
                        }}>{affiliation.label} ({affiliation.recordCount})</Checkbox>)}
                </Accordion>
            </div>)
    } else return (
        value.length !== 0 &&
        <div className={`${blockName}__Affiliations`}>
            <Label>Hospital Affiliations</Label>
            {value.map(affiliation => <Checkbox key={affiliation.value}
                {...{
                    onChange,
                    onSelectValue: affiliation.value,
                    name: affiliation.name,
                    id: `id_${affiliation.name}_${affiliation.value}`,
                    value: affiliation.enabled ? affiliation.value : ''
                }}>{affiliation.label} ({affiliation.recordCount})</Checkbox>)}
        </div>
    )
}
const Gender = (key, onChange, value, blockName) => (
    <div className={`${blockName}__Gender`}>
        <Label>{key}</Label>
        <Radio {...{
            onChange,
            name: 'gender',
            id: 'id_all',
            onSelectValue: '*',
            value: !value.some(gender => gender.enabled) ? '*' : '',
        }}>All</Radio>
        {value.map(gender => <Radio key={gender.value} {...{
            onChange,
            name: gender.name,
            id: `id_${gender.value}`,
            onSelectValue: gender.value,
            value: gender.enabled ? gender.value : ''
        }}>{gender.label} ({gender.recordCount})</Radio>)}
    </div>
);

const Language = (key, onChange, value, blockName) => (
    <div className={`${blockName}__Language`}>
        <Label>Language</Label>
        <Select {...{
            onChange,
            value: value.find(language => language.enabled) && value.find(language => language.enabled).value,
            name: key,
            'aria-label': 'Language',
            id: `id_${key}`
        }}>
            <option value="*">Choose Language</option>
            {value.filter(language => language.recordCount > 0).map(language =>
                <option key={language.value}
                    {...{
                        value: language.value
                    }}>
                    {language.label} ({language.recordCount})
                </option>)}
        </Select>
    </div>
)

const Availability = (key, onChange, value, blockName) => (
    <div className={`${blockName}__Availability`}>
        <Label>{key}</Label>
        {value.map(avail => <Checkbox key={avail.value}
            {...{
                onChange,
                onSelectValue: avail.value,
                name: avail.name,
                id: `id_${avail.name}_${avail.value}`,
                value: avail.enabled ? avail.value : ''
            }}>{avail.label} ({avail.recordCount})</Checkbox>)}
    </div>
);

const NewPatients = (onChange, value, blockName) => (
    <div className={`${blockName}__New`}>
        <Label>Accepting New Patients</Label>
        {value.map(avail => <Checkbox key={avail.value}
            {...{
                onChange,
                onSelectValue: avail.value,
                name: avail.name,
                id: `id_${avail.name}_${avail.value}`,
                value: avail.enabled ? avail.value : ''
            }}>{`Yes (${avail.recordCount})`}</Checkbox>)}
    </div>
)

const Age = (key, onChange, value, blockName) => (
    <div className={`${blockName}__Age`}>
        <Label>Patient Age Groups Seen</Label>
        <Select {...{
            onChange: onChange,
            value: value.find(age => age.enabled) && value.find(age => age.enabled).value,
            name: 'age-accepted',
            'aria-label': 'Age Accepted',
            id: `id_${key}`
        }}>
            <option value="*">All age groups</option>
            {value.map(age => <option key={age.value}
                {...{
                    value: age.value
                }}>
                {age.label} ({age.recordCount})
        </option>)}
        </Select>
    </div>
)

const Facets = ({ resultFacets, onChange, theme, blockName }) => {

    const affiliations = resultFacets['affiliations']?.filter(
        affiliation =>
            affiliation.name === 'hospital.affiliation' &&
            affiliation.recordCount !== 0
    );

    const availabilities = resultFacets['availability']?.filter(
        avail =>
            avail.value !== "has:accepting_new_patients" &&
            avail.value !== "has:mock_scheduling"
    );

    const newPatients = resultFacets['availability']?.filter(
        avail =>
            avail.value !== "has:virtual_visits" &&
            avail.value !== "has:native_scheduling" &&
            avail.value !== "has:mock_scheduling"
    );

    const age = resultFacets['ages-accepted'];

    const gender = resultFacets.gender;

    const language = resultFacets.language;

    return (
        <ThemeProvider theme={theme}>
            <div className={`${blockName}`}>
                {availabilities && Availability('Availability', onChange, availabilities, blockName)}
                {newPatients && NewPatients(onChange, newPatients, blockName)}
                {age && Age('Age', onChange, age, blockName)}
                {gender && Gender('Gender', onChange, gender, blockName)}
                {language && Language('Language', onChange, language, blockName)}
                {affiliations && Affiliations(affiliations, onChange, blockName)}
            </div>
        </ThemeProvider>
    )
}

Facets.propTypes = {
    resultFacets: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    theme: PropTypes.any,
    blockName: PropTypes.string.isRequired,
}

Facets.defaultProps = {
    resultFacets: {},
    onChange: () => null,
    theme: {},
    blockName: '',
}

export default Facets;