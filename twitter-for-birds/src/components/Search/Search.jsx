/* eslint-disable */
import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'ramda';
import Cookies from 'js-cookie';
import { debounce } from 'lodash';
import { findCollection } from '../../actions';
import { ThemeProvider } from 'styled-components';
import { useHistory } from 'react-router-dom';
import {
  InputModifiers,
  Input,
  Select,
  Form,
  Button,
} from 'hw-react-components';
import { TypeAheadParams } from '../../utils/constants';

// Connector-hooks
import usePersonas from '../../connector-hooks/usePersonas/usePersonas.jsx';
import useUserProfile from '../../connector-hooks/useUserProfile/useUserProfile.jsx';
import useReasons from '../../connector-hooks/useReasons/useReasons';

import Loader from '../Loader/Loader';
import { useDispatch, useSelector } from '../../utils/react-redux-hooks';
import api from '../../services/api';
import ProviderModel from '../../utils/providerModel';


const ValidatingTypeAheadInput = compose(
  InputModifiers.validates,
  InputModifiers.Typeahead,
)(Input);
const GeoValidatingInput = compose(InputModifiers.GeoLocation, InputModifiers.validates)(Input);
const ValidatingSelect = compose(InputModifiers.validates)(Select);

const Search = ({
  t,
  notify,
  theme,
  insuranceFilterFlag,
  insuranceAccepted,
  onInsuranceChange,
  showDistanceFlag,
  onDistance,
  distances,
  distance,
  showSortByFlag,
  onSort,
  sortFields,
  visitReason,
  onVisitReasonChange,
  showResetButtonFlag,
  onClear,
  blockName,
}) => {
  let phr_id = Cookies.get('phr_id');
  const dispatch = useDispatch();
  const [searchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [reasonForVisit] = useState('');
  const [insurance] = useState('');
  const history = useHistory();

  const [typeAheadQuery, setTypeAheadQuery] = useState('');
  const [searchType, setSearchType] = useState('');

  // Custom Hooks
  const { hasDisneyPersona, disneyPersonaId } = usePersonas(phr_id);
  const { userProfile, userLoading } = useUserProfile(phr_id);
  const reasons = useReasons();


  // Set zipcode to user's preferred zip code on mount
  useEffect(() => {
    if (!userLoading) {
      const zipcode = userProfile?.data?.user_preferred_location?.zipcode ?? '';
      if (formSchema.location.value.length === 0) {
        setLocation(zipcode);
      }
    }
  }, [userLoading]);


  const providers = () => {
    const id = dispatch(
      findCollection({
        id: TypeAheadParams,
        callApi: api.Scheduling.providers,
        payload: {
          params: `${TypeAheadParams}${hasDisneyPersona ? `&persona=${disneyPersonaId}` : ''}`
        }
      })
    );
    const providers = useSelector(state => state.collections[id]);
    return providers;
  }

  const autoComplete = debounce((value) => {
    if (value) {
      const id = dispatch(
        findCollection({
          id: value,
          callApi: api.Scheduling.typeAhead,
          payload: `${value}${hasDisneyPersona ? `&persona=${disneyPersonaId}` : ''}`,
        })
      );
      setTypeAheadQuery(id);
    }
  }, 100);

  useEffect(() => () => {
    autoComplete.cancel();
  });

  const typeAheadResults = useSelector(state => state.collections[typeAheadQuery]);

  const LoadingSpinner = () => <Loader fixed={true} />

  const geoCode = async zipcode => {
    const location = await api.GMaps.newGeocode(zipcode);
    const geocode = { lat: location.lat, lng: location.lng };
    return geocode;
  };

  const geoLocate = async position => {
    const location = await api.GMaps.newReverseGeocode(position);
    return location.formatted_address;
  };

  const onViewMore = async (inputValue) => {
    const schema = viewMoreRef.current.state.schema;
    const coordinates = await api.GMaps.newGeocode(schema.get('location').value);
    const searchParams = new URLSearchParams('');
    const keywordFilter = /[\^*)(_[\]{}:?]+/g;
    try {
      searchParams.append('address', schema.get('location').value);
      searchParams.append('location', [coordinates.lat, coordinates.lng].join());
      if (insuranceFilterFlag) {
        schema.get('insuranceAccepted').value !== '' && searchParams.append('insuranceAccepted', schema.get('insuranceAccepted').value);
      } else {
        schema.get('insurance').value !== '' && searchParams.append('insuranceAccepted', schema.get('insurance').value);
      };
      searchParams.append('gender', '*');
      searchParams.append('distance', 20);
      searchParams.append('sort', true);
      searchParams.append('sortFields', 'distance');
      searchParams.append('sortOrder', 'ASC');
      searchParams.append('keyword', inputValue.replace(keywordFilter, ' '));
      history.push(
        `/scheduling/results?${searchParams.toString()}`
      );
    } catch (e) {
      notify({
        message: t('location-error'),
        status: 'warning'
      });
    }
  };

  const onSelectValue = async (value) => {
    const zipcode = userProfile?.data?.user_preferred_location?.zipcode ?? ''
    const location = await geoCode(zipcode);
    if (value.data && value.data.npi) {
      history.push(`/scheduling/appointments/location/${value.data.officeAddress[0].id}/physician/${value.data.id}?location=${[location.lat, location.lng].join()}&reasonForVisit=2`)
    } else if (value.data === 'View More') {
      onViewMore(value.value);
    } else if (value.data) {
      setSearchType(value.data.name);
    }
  };

  const formatProvider = provider => {
    const providerModel = new ProviderModel(provider);
    const { sslImageUrl, displayName, hl, specialty, photoURL } = providerModel;
    const image = photoURL ? `<div class=${blockName}__photo><img src=${sslImageUrl} alt=${displayName} /></div>`
      : `<div class=${blockName}__initials><i><span>MD</span></i></div>`

    return `<div class=${blockName}__provider>${image}<div class=${blockName}__provider--info> <p>${hl[0]}</p> <p class=${blockName}__specialty>${specialty && specialty.join(', ')}</p></div></div>`
  }

  const typeAheadContent = () => {
    let content = [];
    const form = formRef.current;
    const limit = 5;
    const loading = typeAheadResults?.meta?.loading ?? true;
    const error = typeAheadResults?.meta?.error ?? false;
    if (!loading && !error) {
      content = [
        {
          category: 'Specialties',
          content: typeAheadResults.data.SPECIALTY.length ? typeAheadResults.data.SPECIALTY.map(specialty => ({
            value: { value: specialty.value, data: specialty },
            display: specialty.hl[0]
          })).slice(0, limit) : []
        },
        {
          category: 'Provider Names',
          content: typeAheadResults.data.PROVIDERS.length ? typeAheadResults.data.PROVIDERS.map(provider => ({
            value: { value: provider.displayName, data: provider },
            display: formatProvider(provider)
          })).slice(0, limit) : []
        },
        {
          category: 'Keywords',
          content: typeAheadResults.data.KEYWORDS.length ? typeAheadResults.data.KEYWORDS.map(keyword => ({
            value: { value: keyword.value, data: keyword },
            display: keyword.hl[0]
          })).slice(0, limit) : []
        }
      ];
      if (typeAheadResults.data.PROVIDERS.length > limit) {
        content[1].content.push({ value: { value: form.props.value, data: 'View More' }, display: 'View More' });
      }
    }
    return content;
  }

  let providerResults = providers();

  const insurancesForVisit = providerResults?.meta.loading || providerResults?.meta.error ? [] : providerResults.data.facet.insuranceAccepted;

  const search = async (e, schema) => {
    e.preventDefault();
    try {
      const coordinates = await api.GMaps.newGeocode(schema.get('location').value);
      const searchParams = new URLSearchParams('');
      const keywordFilter = /[\^*)(_[\]{}:?]+/g;
      const searchTerm = schema.get('searchTerm').value;
      searchParams.append('address', schema.get('location').value);
      searchParams.append('reasonForVisit', schema.get('reasonForVisit').value);
      searchParams.append('location', [coordinates.lat, coordinates.lng].join());
      if (insuranceFilterFlag) {
        schema.get('insuranceAccepted').value !== '' && searchParams.append('insuranceAccepted', schema.get('insuranceAccepted').value);
      } else {
        schema.get('insurance').value !== '' && searchParams.append('insuranceAccepted', schema.get('insurance').value);
      };
      searchParams.append('gender', '*');
      searchParams.append('distance', 20);
      searchParams.append('sort', true);
      searchParams.append('sortFields', 'distance');
      searchParams.append('sortOrder', 'ASC');
      if (searchType && searchTerm) {
        searchParams.append(`${searchType}`, searchTerm.replace(keywordFilter, ' '));
      } else if (searchTerm) {
        searchParams.append('keyword', searchTerm.replace(keywordFilter, ' '));
      }
      if (schema.get('reasonForVisit').value == 1) {
        searchParams.append('availability', 'has:accepting_new_patients');
      }
      history.push(
        `/scheduling/results?${searchParams.toString()}`
      );
    } catch (e) {
      notify({
        message: t('location-error'),
        status: 'warning'
      });
    }
  };

  const reasonsForVisit = () => {
    if (!reasons?.meta?.loading) {
      return reasons.data?.data?.map(reason =>
        <option value={reason.reason_id} key={reason.reason_desc}>
          {reason.reason_desc}
        </option>
      )
    }
  };

  const formSchema = {
    searchTerm: {
      value: searchTerm,
      validation: {
        required: true
      }
    },
    location: {
      value: location,
      validation: {
        required: true
      }
    },
    sortFields: {
      value: sortFields || '',
      validation: {
        required: false
      }
    },
    distance: {
      value: distance || '',
      validation: {
        required: false
      }
    },
    reasonForVisit: {
      value: visitReason || reasonForVisit,
      validation: {
        required: true
      }
    },
    insurance: {
      value: insurance,
      validation: {
        required: false
      }
    },
    insuranceAccepted: {
      value: insuranceAccepted || '',
      validation: {
        required: false
      }
    }
  };

  const isLoading = providerResults?.meta?.loading && reasons?.meta?.loading;

  const formRef = useRef();

  const viewMoreRef = useRef(null);

  return (
    <ThemeProvider theme={theme}>
      <div className={blockName}>
        {isLoading && LoadingSpinner()}
        <Form {...{
          schema: formSchema,
          onSubmit: search,
          showRequired: false,
          ref: viewMoreRef
        }}>
          <div className={`${blockName}__Input`}>
            <ValidatingTypeAheadInput
              {...{
                placeholder: t('search-typeahead-placeholder'),
                type: 'text',
                name: 'searchTerm',
                'aria-label': t('search-typeahead-placeholder'),
                id: 'id_searchTerm',
                webWorkerPath: 'js/TypeAheadWebWorker.js',
                limit: 5,
                onSelectValue: (value) => onSelectValue(value),
                onChange: (e) => autoComplete(e.target.value),
                typeahead: typeAheadContent(),
                filter: false,
                categorize: true,
                ref: formRef,
                icon: "fal fa-search",
                iconPlacement: "beginning"
              }}
            />
            <GeoValidatingInput
              {...{
                type: 'text',
                name: 'location',
                id: 'id_location',
                'aria-label': 'Location',
                placeholder: t('search-location-placeholder'),
                geoLocate: geoLocate,
                icon: "fal fa-map-marker-alt",
                iconPlacement: "beginning"
              }}
            />
            {showDistanceFlag &&
              <div className={`${blockName}__Distance`}>
                <span>Within</span>
                <Select {...{
                  name: 'distance',
                  id: 'id_distance',
                  type: 'select',
                  'aria-label': 'Distance',
                  value: distance,
                  onChange: (e) => {
                    e.preventDefault();
                    onDistance(e);
                  }
                }}>
                  <option disabled>Distance</option>
                  <option value="10000">Any miles</option>
                  {distances.map(distance =>
                    <option key={distance.value} {...{
                      value: distance.value
                    }}>
                      {distance.label}
                    </option>)}
                </Select>
              </div>
            }
          </div>
          <div className={`${blockName}__Input`}>
            {insuranceFilterFlag ? [
              <Select {...{
                name: 'insuranceAccepted',
                key: 1,
                id: 'id_insurance',
                'aria-label': 'Insurance',
                type: 'select',
                value: insuranceAccepted,
                onChange: (e) => {
                  e.persist();
                  onInsuranceChange(e);
                }
              }}>
                <option value="" disabled >{t('search-insurance-placeholder')}</option>
                <option value="all">{t('search-insurance-later')}</option>
                <option value="*">{t('search-insurance-selfpay')}</option>
                {insurancesForVisit.map(insurance =>
                  <option key={insurance.value} {...{
                    value: insurance.value
                  }}>
                    {insurance.label}
                  </option>)
                }
              </Select>
            ] : [
                <Select {...{
                  name: 'insurance',
                  key: 2,
                  id: 'id_insurance',
                  'aria-label': 'Insurance',
                  type: 'select',
                }}>
                  <option value="" disabled >{t('search-insurance-placeholder')}</option>
                  <option value="all">{t('search-insurance-later')}</option>
                  <option value="*">{t('search-insurance-selfpay')}</option>
                  {insurancesForVisit.map(insurance =>
                    <option key={insurance.value} {...{
                      value: insurance.value
                    }}>
                      {insurance.label}
                    </option>)
                  }
                </Select>
              ]}

            {showSortByFlag &&
              <div className={`${blockName}__Sort`}>
                <span>Sort by</span>
                <Select {...{
                  id: 'id_sort',
                  name: 'sortFields',
                  'aria-label': 'Sort',
                  onChange: onSort,
                  type: 'select',
                  value: sortFields
                }}>
                  <option value="distance">Distance</option>
                  <option value="nameAsc">Last Name [A-Z]</option>
                  <option value="nameDesc">Last Name [Z-A]</option>
                </Select>
              </div>
            }
            <ValidatingSelect {...{
              name: 'reasonForVisit',
              type: 'select',
              id: 'id_reasonForVisit',
              value: visitReason,
              'aria-label': 'Select Visit Reason',
              onChange: (e) => {
                e.preventDefault();
                onVisitReasonChange(e);
              }
            }}>
              <option value="*" >{t('search-reason-placeholder')}</option>
              {reasonsForVisit()}
            </ValidatingSelect>
            <Button type="submit" modifier="info" size="sm">
              Search
            </Button>
            {showResetButtonFlag &&
              <Button type="button" size="md" className={`${blockName}__Reset`} onClick={onClear} tabIndex={0}>Reset</Button>
            }
          </div>
        </Form>
      </div>
    </ThemeProvider>
  )
};

Search.propTypes = {
  t: PropTypes.func,
  notify: PropTypes.func,
  theme: PropTypes.any,
  showDistanceFlag: PropTypes.bool,
  onDistance: PropTypes.func,
  distances: PropTypes.array,
  distance: PropTypes.string,
  showSortByFlag: PropTypes.bool,
  onSort: PropTypes.func,
  sortFields: PropTypes.string,
  showResetButtonFlag: PropTypes.bool,
  visitReason: PropTypes.string,
  onClear: PropTypes.func,
  blockName: PropTypes.string.isRequired,
};

Search.defaultProps = {
  showSortByFlag: false,
  showDistanceFlag: false,
  showResetButtonFlag: false,
  insuranceFilterFlag: false,
  visitReason: '',
  onVisitReasonChange: () => null,
  onInsuranceChange: () => null,
};

export default Search;
