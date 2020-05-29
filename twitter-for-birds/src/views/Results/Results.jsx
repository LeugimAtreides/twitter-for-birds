import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { withTranslation } from 'react-i18next';
import classNames from 'classnames';

// Hooks
import { useHistory, useLocation } from 'react-router-dom';
import { Toaster, Anchor } from 'hw-react-components';
import usePersonas from '../../connector-hooks/usePersonas/usePersonas';
import useResults from '../../connector-hooks/useResults/useResults';
import useReasons from '../../connector-hooks/useReasons/useReasons';

// Components
import ProviderResults from '../../components/ProviderResults/ProviderResults.jsx';
import PaginatedResults from '../../components/PaginatedResults/PaginatedResults.jsx';
import Facets from '../../components/Facets/Facets';
import Search from '../../components/Search/Search';
import Sidebar from '../../components/Sidebar/Sidebar';
import Loader from '../../components/Loader/Loader';

// Themes
import ProviderResultsTheme from './themes/providerResults.scss';
import PaginatedResultsTheme from './themes/paginatedResults.scss';
import FacetsTheme from './themes/facets.scss';
import SearchTheme from './themes/search.scss';
import SidebarTheme from './themes/sidebar.scss';
import './themes/results.scss';


const Results = ({ t }) => {
  const location = useLocation();
  const phr_id = Cookies.get('phr_id');

  const history = useHistory();
  const [showFilters] = useState(false);
  const { hasDisneyPersona, disneyPersonaId } = usePersonas(phr_id);
  const [queries, setQueries] = useState({});
  const searchParams = new URLSearchParams(location.search);

  const {
    results,
    resultsLoading,
    resultsProviders,
    resultsPagination,
  } = useResults({ searchParams, hasDisneyPersona, disneyPersonaId });

  const reasons = useReasons();

  const isLoading = resultsLoading || reasons.meta.loading;

  const facets = results?.data?.facet;

  const callBackRefresh = (state, futureParams) => {
    setQueries(state);
    history.push(`/scheduling/results/?${futureParams.toString()}`);
  }

  useEffect(() => {
    const initialState = {};
    for (const [key, value] of searchParams.entries()) {
      if (key === 'keyword' || key === 'conditionsTreated' || key === 'treatmentOffered' || key === 'specialties') {
        initialState.queryType = key;
        initialState.typeaheadQuery = value;
      } else if (value.includes(',')) {
        initialState[key] = new Set(value.split(','));
      } else if (value.includes(':')) { // for availability=has:native_scheduling
        initialState[key] = new Set().add(value);
      } else if (key.includes('.')) { // for Hospital.Affiliations
        initialState[key] = new Set().add(value);
      } else if (key === 'insurance') {
        initialState.insuranceAccepted = value;
      } else initialState[key] = value;
    }
    setQueries(initialState);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFacetChange = e => {
    const { value, type, name } = e.target;
    const futureParams = new URLSearchParams(location.search);
    const futureState = { ...queries };
    switch (type) {
      case 'checkbox':
        if (futureState[name] === undefined || futureState[name].size === 0) {
          futureState[name] = new Set().add(value);
        } else if (futureState[name].has(value)) {
          futureState[name].delete(value);
          futureParams.delete(name);
          if (futureParams.get('reasonForVisit') === '1') {
            if (!futureState.availability.has('has:accepting_new_patients')) { futureParams.append('availability', 'has:accepting_new_patients'); }
          }
        } else if (!futureState[name].has(value)) {
          futureState[name].add(value);
          futureParams.delete(name);
        }
        if (futureState[name].size !== 0) {
          futureState[name].forEach(item => futureParams.append(name, item));
        }
        break;
      default:
        switch (name) {
          case 'insurance':
            futureParams.set(name, value);
            futureParams.set('insuranceAccepted', value);
            futureState[name] = value;
            futureState.insuranceAccepted = value;
            break;
          case 'age-accepted':
            if (value === '*') {
              futureParams.delete('age-accepted');
              futureState['age-accepted'].delete(value);
            } else {
              futureParams.set('age-accepted', value);
              futureState['age-accepted'] = new Set().add(value);
            }
            break;
          default:
            value !== '' && futureParams.set(name, value);
            futureState[name] = value;
        }
    }

    callBackRefresh(futureState, futureParams);
  };

  const onSortBy = e => {
    const { value, name } = e.target;
    const futureParams = new URLSearchParams(location.search);
    const futureState = { ...queries };
    switch (name) {
      case 'sortFields':
        if (value === 'nameAsc') {
          futureParams.set('sortFields', 'lastName');
          futureParams.set('sortOrder', 'ASC');
          futureState.sortFields = 'nameAsc';
          futureState.sortOrder = 'ASC';
        } else if (value === 'nameDesc') {
          futureParams.set('sortFields', 'lastName');
          futureParams.set('sortOrder', 'DESC');
          futureState.sortFields = 'nameDesc';
          futureState.sortOrder = 'DESC';
        } else if (value === 'distance') {
          futureParams.set('sortFields', 'distance');
          futureParams.set('sortOrder', 'ASC');
          futureState.sortFields = 'distance';
          futureState.sortOrder = 'ASC';
        }
        break;
      default:
    }

    callBackRefresh(futureState, futureParams);
  };


  const onClearSearch = () => {
    const futureParams = new URLSearchParams(location.search);

    const futureState = {
      specialties: new Set(),
      availability: new Set(),
      affiliations: new Set(),
      reasonForVisit: '1',
      address: queries.address,
      gender: '*',
      sort: true,
      sortOrder: 'ASC',
      sortFields: 'distance',
      page: 0,
      distance: '10000',
      limitSpecialties: 10,
      insuranceAccepted: '*',
      insurance: '*',
      typeaheadQuery: '',
      queryType: 'keyword',
    };
    futureParams.delete('keyword');
    futureParams.delete('specialties');
    futureParams.set('address', queries.address);
    futureParams.set('gender', '*');
    futureParams.set('sort', true);
    futureParams.set('sortOrder', 'ASC');
    futureParams.set('sortFields', 'distance');
    futureParams.set('page', 0);
    futureParams.set('limitSpecialties', 10);
    futureParams.set('distance', '10000');
    futureParams.set('insuranceAccepted', '*');
    futureParams.set('reasonForVisit', '*');

    callBackRefresh(futureState, futureParams);
  };


  const params = () => {
    const { reasonForVisit } = queries;
    const futureParams = new URLSearchParams(location.search);
    futureParams.delete('search');
    futureParams.delete('sort');
    futureParams.delete('gender');
    futureParams.delete('specialties');
    futureParams.delete('scheduleOnline');
    if (reasonForVisit) {
      futureParams.set('appointmentReason', reasonForVisit);
    }

    return futureParams.toString();
  };

  const onRequestAppointment = ({ office, provider }) => {
    history.push(`/scheduling/request/location/${office.id}/physician/${provider.id}?${params()}`);
  };

  // const onToggleFilters = () => {
  //   setShowFilters(prevState => !prevState);
  // };

  const onOnlineAppointment = ({ office, provider }) => {
    history.push(
      `/scheduling/appointments/location/${office.id}/physician/${
      provider.id
      }?${params()}`,
    );
    window.scrollTo(0, 0);
  };

  const bookAppointment = (office, appointment, provider) => {
    const futureParams = new URLSearchParams(location.search);
    futureParams.delete('search');
    futureParams.delete('sort');
    futureParams.delete('gender');
    futureParams.delete('specialties');
    futureParams.delete('scheduleOnline');
    futureParams.append('appointmentDate', appointment.date);
    history.push(
      `/scheduling/appointments/${
      appointment.appointmentid
      }/location/${office.id}/physician/${provider.id}?${futureParams.toString()}`,
    );
  };

  const onViewProfile = (locationId, providerId) => {
    history.push(`/scheduling/appointments/location/${locationId}/physician/${providerId}?${searchParams.toString()}`);
    window.scrollTo(0, 0);
  };

  const offices = () => {
    const officesArr = [];
    for (const provider of resultsProviders) {
      const officesForCurrentProvider = provider.officeAddress.map(
        officeAddress => {
          const office = {
            ...officeAddress,
            ...provider,
          };
          return office;
        },
      );
      officesArr.push.apply(officesArr, officesForCurrentProvider);
    }
    return officesArr;
  };

  const resultsCount = () => {
    const resultsCount = resultsPagination?.recordCount || 0;
    const params = new URLSearchParams(location.search);
    let category;
    let searchTerm;
    switch (true) {
      case params.has('specialties'):
        category = 'who specialize in';
        searchTerm = params.get('specialties');
        break;
      case params.has('conditionsTreated'):
        category = 'who treat';
        searchTerm = params.get('conditionsTreated');
        break;
      case params.has('treatmentOffered'):
        category = 'who offer';
        searchTerm = params.get('treatmentOffered');
        break;
      case !params.has('keyword'):
        category = '';
        searchTerm = '';
        break;
      default:
        category = 'for keyword';
        searchTerm = params.get('keyword');
    }

    return (
      <p className={`${Results.blockName}__results--resultcount`}>
        <span>{resultsCount}</span> providers found <strong>{category} {searchTerm}</strong>
      </p>
    );
  };


  const ratingOnClick = (providerId, locationId) => {
    history.push(`/scheduling/appointments/location/${locationId}/physician/${providerId}?${searchParams.toString()}#Ratings`);
  };

  const onPage = page => {
    const futureParams = new URLSearchParams(location.search);
    futureParams.set('page', page);
    history.push(
      `/scheduling/results?${futureParams.toString()}`,
    );
    window.scrollTo(0, 0);
  };



  const provider = (provider, styleName) => (
    provider.officeAddress.find(office => office.name === 'NO_ADDRESS') ? null
      : (
        <div className={styleName} key={`${provider.providerId}`}>
          <ProviderResults
            key={provider.providerId}
            office={() => offices}
            provider={provider}
            reasonForVisit={queries.reasonForVisit}
            requestAppointment={onRequestAppointment}
            showEmployedFlag
            showNetworkFlag
            moreAppointments={onOnlineAppointment}
            bookAppointment={bookAppointment}
            viewProvider={onViewProfile}
            ratingOnClick={(providerId, locationId) => ratingOnClick(providerId, locationId)}
            theme={ProviderResultsTheme}
          />
        </div>
      )
  );

  const distances = [
    { value: 10, label: '10 miles' },
    { value: 20, label: '20 miles' },
    { value: 50, label: '50 miles' },
    { value: 100, label: '100 miles' },
  ];

  const resultClasses = classNames({
    [`${Results.blockName}__results`]: true,
    [`${Results.blockName}__results--fixed`]: showFilters,
  });

  return (
    <div className={Results.blockName}>
      <Search {...{
        t,
        notify: Toaster.show,
        theme: SearchTheme,
        queries,
        insuranceAccepted: queries.insuranceAccepted,
        onInsuranceChange: onFacetChange,
        insuranceFilterFlag: true,
        showDistanceFlag: true,
        onDistance: onFacetChange,
        onVisitReasonChange: onFacetChange,
        distance: queries.distance,
        distances,
        showSortByFlag: true,
        onSort: onSortBy,
        sortFields: queries.sortFields,
        showResetButtonFlag: true,
        visitReason: queries.reasonForVisit,
        onClear: onClearSearch,
        blockName: 'results-Search',
      }}
      />
      {isLoading && <Loader fixed />}
      <div className={resultClasses}>
        <Sidebar {...{
          isOpen: showFilters,
          theme: SidebarTheme,
          blockName: 'results-Sidebar',
        }}
        >
          {/* <div className={`${Results.blockName}__filters--title`}>
            <span>filter results</span>
            <a
              role="button"
              tabIndex="-1"
              onClick={() => onToggleFilters()}
              className={`${Results.blockName}__filters--close`}
            >
              &times;
            </a>
          </div> */}
          {facets && (
            <Facets {...{
              resultFacets: facets,
              onChange: onFacetChange,
              visitReason: queries.reasonForVisit,
              theme: FacetsTheme,
              blockName: 'resultFacets',
            }}
            />
          )}
          <div className={`${Results.blockName}__filters--collapse`}>
            <div className={`${Results.blockName}__collapse--title`}>
              <span>
                <Anchor rel="button" href={null} onClick={() => onClearSearch()}>
                  Clear All
                </Anchor>
              </span>
            </div>
          </div>
        </Sidebar>
        <div className={`${Results.blockName}__results--page`}>
          <div className={`${Results.blockName}__results--filters`}>
            {resultsCount()}
          </div>
          {!isLoading && (
            <PaginatedResults
              {...{
                results: resultsProviders,
                item: provider,
                perPage: 10,
                recordCount: resultsPagination.recordCount,
                page: resultsPagination.currentPage,
                onPage,
                error: results.meta.error,
                blockName: 'results-PaginatedResults',
                theme: PaginatedResultsTheme,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

Results.blockName = 'deaui-Results';

export default withTranslation(['glossary', 'common'])(Results);
