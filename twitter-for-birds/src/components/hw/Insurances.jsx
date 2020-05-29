/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Accordion } from 'hw-react-components';
import '../Provider/provider-profile.sass';

export default class Insurances extends Component {
  static blockName = 'hwui-ProviderProfile__Insurances';

  static propTypes = {
    list: PropTypes.array.isRequired,
    showCount: PropTypes.number,
  };

  static defaultProps = {
    list: [],
    showCount: 5,
  };

  constructor(props) {
    super(props);
    const more = this.more;
    const showText = this.showText;

    this.state = {
      more: more,
      showText: showText
    };
  }

  get more() {
    const { list, showCount } = this.props;
    return list.length > showCount;
  }

  get showText() {
    return this.more ? 'Show More' : 'Show Less';
  }

  get insurances() {
    const { list } = this.props;
    const { showCount } = this.props;
    if (list.length > showCount) {
      return (
        <Accordion
          fromBottom
          topContent={(
            <div className={`${Insurances.blockName}--list`}>
              <ul>
                {list.slice(0, showCount).map((insurance, i) => <li key={i}>{insurance}</li>)}
              </ul>
            </div>
          )}
        >
          <ul>
            {list.slice(showCount, list.length).map((insurance, i) => <li key={i}>{insurance}</li>)}
          </ul>
        </Accordion>
      );
    }

    return (
      <div className={`${Insurances.blockName}--list`}>
        <ul>
          {list.map((insurance, i) => <li key={i}>{insurance}</li>)}
        </ul>
      </div>
    );
  }

  onMoreInsurances = () => {
    const { more } = this.state;
    this.setState({ showText: more ? 'Show Less' : 'Show More', more: !more });
  }

  get disclaimer() {
    const { list } = this.props;

    return (list.length) === 0 ? (
      <p>
        We do not have any information regarding the insurances this provider accepts.
        Please check with your health plan to confirm that this provider is included before scheduling an appointment.

      </p>
    ) : (
        <p>
          The list below is for reference purposes only and is subject to change.
          Please check with your health plan to confirm that this provider is included before scheduling an appointment.
        </p>
      );
  }

  render() {
    return (
      <div className={`${Insurances.blockName}`}>
        <div className={`${Insurances.blockName}--disclaimer`}>
          <i className="fa fa-exclamation-circle" />
          {' '}
          <h1>Disclaimer:</h1>
          {this.disclaimer}
        </div>
        {this.insurances}
      </div>
    );
  }
}
