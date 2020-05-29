import React from 'react';
import PropTypes from 'prop-types';
import { Anchor } from 'hw-react-components';
import { ThemeProvider } from 'styled-components';
import Empty from '../Empty/Empty.jsx';
import NumberedPager from '../NumberedPager/NumberedPager.jsx'

const PaginatedResults = ({
    results,
    perPage,
    page,
    recordCount,
    onPage,
    item,
    ctaAction,
    cta,
    error,
    blockName,
    theme,
}) => {
    const empty = <Empty {...{
        title: 'No Results',
        sub: 'We were unable to find any physicians/offices based on your search criteria. Try removing filters or search terms to see results',
    }} />

    const errorPage = <Empty {...{
        title: 'Error Loading Page',
        sub: 'Oops! There seems to be a problem on our end. Please refresh the page and try again.'
    }} />

    const resultsOrError = () => {
        if (error) {
            return errorPage
        } else return results.length ? (results.map((result, i) => item(result, i % perPage, `${blockName}__Provider`))) : empty;
    }


    const resultsCTA = () => {
        const officesWithOnlineScheduling = results.filter(result =>
            result.milesAway < 50 &&
            result.officeAddress.athenaInformation !== null &&
            result.officeAddress.onlineScheduling
        );

        if (officesWithOnlineScheduling.length === 0) {
            return null;
        };

        return (
            <div className={`${blockName}__cta`}>
                <h3>There are <span className={`${blockName}__cta--cta`}>{officesWithOnlineScheduling.length}</span> providers near you who offer online scheduling.</h3>
                <Anchor role="button" onClick={ctaAction}>View All</Anchor>
            </div>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <div className={blockName}>
                {cta && resultsCTA()}
                {resultsOrError()}
                <NumberedPager {...{
                    numItems: recordCount,
                    perPage: perPage,
                    page: page,
                    displayNum: 3,
                    selectPage: onPage
                }} />
            </div>
        </ThemeProvider>
    )

};

PaginatedResults.defaultProps = {
    results: [],
    perPage: 10,
    page: 1,
    recordCount: null,
    onPage: () => false,
    item: () => null,
    ctaAction: () => false,
    cta: false,
    error: false
};

PaginatedResults.propTypes = {
    results: PropTypes.arrayOf(PropTypes.object),
    perPage: PropTypes.number,
    page: PropTypes.number,
    recordCount: PropTypes.number,
    onPage: PropTypes.func,
    item: PropTypes.func,
    ctaAction: PropTypes.func,
    cta: PropTypes.bool,
    error: PropTypes.bool,
    blockName: PropTypes.string.isRequired,
};

export default PaginatedResults;