import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'hw-react-components';
import styles from './numberedPager.module.sass';

const NumberedPager = ({
    numItems,
    perPage,
    page,
    displayNum,
    selectPage,
}) => {
    const previousPage = (e) => {
        e.preventDefault();
        (actualPage > 1) && selectPage(actualPage - 2);
    };

    const nextPage = (e) => {
        e.preventDefault();
        (actualPage < numPages) && selectPage(actualPage);
    };

    const onSelectPage = (page) => {
        selectPage(page - 1);
    };

    const actualPage = page + 1;

    const numPages = (numItems && perPage) ? Math.ceil(numItems / perPage) : 0;

    const actualDisplayNum = displayNum > numItems ? numItems : displayNum;

    const limitPages = numPages > actualDisplayNum;

    const padding = Math.floor(displayNum / 2);

    const previous = <Button {...{
        size: 'sm',
        onClick: previousPage,
        disabled: !(actualPage > 1),
        ariaLabel: 'previous page'
    }}>
        <i className="fa fa-angle-left " />
    </Button>;

    const next = <Button {...{
        size: 'sm',
        onClick: nextPage,
        disabled: !(actualPage < numPages),
        ariaLabel: 'next page'
    }}>
        <i className="fa fa-angle-right" />
    </Button>;

    const last = (limitPages && actualPage + padding < numPages) ? (
        <span>
            <span>&#8230;</span>
            <Button {...{
                modifier: 'default',
                size: 'sm',
                onClick: (e) => {
                    e.preventDefault();
                    onSelectPage(numPages);
                }
            }}>
                {numPages}
            </Button>
        </span>
    ) : null;

    const first = (limitPages && actualPage - padding > 1) ? (
        <span>
            <Button {...{
                modifier: 'default',
                size: 'sm',
                onClick: (e) => {
                    e.preventDefault();
                    onSelectPage(1);
                }
            }}>
                1
          </Button>
            <span>&#8230;</span>
        </span>
    ) : null;

    const pageNumKeys = Array.from(Array(numPages).keys());

    const pageNum = (i) => {
        return (
            <Button key={i} {...{
                modifier: (actualPage === i) ? 'active' : 'default',
                size: 'sm',
                onClick: (e) => {
                    e.preventDefault();
                    onSelectPage(i);
                }
            }}>
                {i}
            </Button>
        );
    };

    const limitedPages = () => {
        const iPadding = padding + 1;
        const endOffset = numPages - padding;

        let pager = pageNumKeys.slice(0, actualDisplayNum).map(i => pageNum(i + 1));

        if (actualPage > padding && actualPage < endOffset) {
            pager = pageNumKeys.slice(actualPage - iPadding, actualPage + padding).map(i => pageNum(i + 1));
        } else if (actualPage >= endOffset) {
            pager = pageNumKeys.slice(actualPage - (iPadding + (actualPage - endOffset)), numPages).map(i => pageNum(i + 1));
        }

        return pager;
    };

    const pageNums = limitPages ? limitedPages() : pageNumKeys.map(i => pageNum(i + 1));


    const pager = numPages < 2 ? null : <div>
        {previous}
        {first}
        {pageNums}
        {last}
        {next}
    </div>;

    return (
        <div className={styles[`${NumberedPager.blockName}`]}>
            {pager}
        </div>
    )
};

NumberedPager.blockName = 'deaui-NumberedPager';

NumberedPager.propTypes = {
    numItems: PropTypes.number,
    perPage: PropTypes.number,
    page: PropTypes.number,
    displayNum: PropTypes.number,
    selectPage: PropTypes.func
};

NumberedPager.defaultProps = {
    // total # of items
    numItems: null,
    // # of items to display per page
    perPage: 10,
    // the initial page to display
    page: 1,
    // # of pages to display
    displayNum: 3,
    // callback function for moving to the selected page
    selectPage: () => undefined
};

export default NumberedPager;