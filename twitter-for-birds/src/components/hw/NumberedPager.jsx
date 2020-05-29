/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'hw-react-components';
// import './styles/numbered-pager.sass';

export default class NumberedPager extends Component {
  static blockName = 'hwui-NumberedPager';

  static propTypes = {
    numItems: PropTypes.number,
    perPage: PropTypes.number,
    page: PropTypes.number,
    displayNum: PropTypes.number,
    selectPage: PropTypes.func,
  };

  static defaultProps = {
    // total # of items
    numItems: null,
    // # of items to display per page
    perPage: 10,
    // the initial page to display
    page: 1,
    // # of pages to display
    displayNum: 3,
    // callback function for moving to the selected page
    selectPage: () => undefined,
  };

  constructor(props) {
    super(props);

    this.state = {
      page: this.page,
    };
  }

  get page() {
    const { page } = this.props;
    // first page is 0th page in results
    return page + 1;
  }

  get numItems() {
    const { numItems } = this.props;
    return numItems;
  }

  get perPage() {
    const { perPage } = this.props;
    return perPage > this.numItems ? this.numItems : perPage;
  }

  get numPages() {
    const { numItems, perPage } = this.props;
    return (numItems && perPage) ? Math.ceil(numItems / perPage) : 0;
  }

  get displayNum() {
    const { displayNum } = this.props;
    return displayNum > this.numItems ? this.numItems : displayNum;
  }

  get limitPages() {
    return this.numPages > this.displayNum;
  }

  get padding() {
    const { displayNum } = this.props;
    return Math.floor(displayNum / 2);
  }

  get previous() {
    return (
      <Button {...{
        size: 'sm',
        onClick: this.previousPage,
        disabled: !(this.page > 1),
        ariaLabel: 'previous page',
      }}
      >
        <i className="fa fa-angle-left " />
      </Button>
    );
  }

  get next() {
    return (
      <Button {...{
        size: 'sm',
        onClick: this.nextPage,
        disabled: !(this.page < this.numPages),
        ariaLabel: 'next page',
      }}
      >
        <i className="fa fa-angle-right" />
      </Button>
    );
  }

  get last() {
    return (this.limitPages && this.page + this.padding < this.numPages) ? (
      <span>
        <span>&#8230;</span>
        <Button {...{
          modifier: 'default',
          size: 'sm',
          onClick: (e) => {
            e.preventDefault();
            this.onSelectPage(this.numPages);
          },
        }}
        >
          {this.numPages}
        </Button>
      </span>
    ) : null;
  }

  get first() {
    return (this.limitPages && this.page - this.padding > 1) ? (
      <span>
        <Button {...{
          modifier: 'default',
          size: 'sm',
          onClick: (e) => {
            e.preventDefault();
            this.onSelectPage(1);
          },
        }}
        >
          1
        </Button>
        <span>&#8230;</span>
      </span>
    ) : null;
  }

  get pageNums() {
    const { numPages } = this;
    const pageNums = Array.from(Array(numPages).keys());

    return this.limitPages ? this.limitedPages : pageNums.map(i => this.pageNum(i + 1));
  }

  get limitedPages() {
    const { page, numPages, displayNum } = this;
    const pageNums = Array.from(Array(numPages).keys());
    const { padding } = this;
    const iPadding = padding + 1;
    const endOffset = numPages - padding;

    let pager = pageNums.slice(0, displayNum).map(i => this.pageNum(i + 1));

    if (page > padding && page < endOffset) {
      pager = pageNums.slice(page - iPadding, page + padding).map(i => this.pageNum(i + 1));
    } else if (page >= endOffset) {
      pager = pageNums.slice(page - (iPadding + (page - endOffset)), numPages).map(i => this.pageNum(i + 1));
    }

    return pager;
  }

  pageNum = (i) => (
    <Button
      key={i}
      {...{
        modifier: (this.page == i) ? 'active' : 'default',
        size: 'sm',
        onClick: (e) => {
          e.preventDefault();
          this.onSelectPage(i);
        },
      }}
    >
      {i}
    </Button>
  )

  previousPage = (e) => {
    e.preventDefault();
    const { selectPage } = this.props;
    (this.page > 1) && selectPage(this.page - 2);
  }

  nextPage = (e) => {
    e.preventDefault();
    const { selectPage } = this.props;
    (this.page < this.numPages) && selectPage(this.page);
  }

  onSelectPage = (page) => {
    const { selectPage } = this.props;
    selectPage(page - 1);
  }

  get pager() {
    if (this.numPages < 2) {
      return null;
    }
    return (
      <div>
        {this.previous}
        {this.first}
        {this.pageNums}
        {this.last}
        {this.next}
      </div>
    );
  }

  render() {
    return (
      <div className={`${NumberedPager.blockName}`}>
        {this.pager}
      </div>
    );
  }
}
