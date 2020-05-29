/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/static-property-placement */
/* eslint-disable react/require-default-props */
import React, { PureComponent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './loader.sass';

export default class Loader extends PureComponent {
  static blockName = 'deaui-Loading';

  static propTypes = {
    fixed: PropTypes.bool,
    title: PropTypes.string,
  };

  static defaultProps = {
    fixed: true,
  };

  render() {
    const classes = classNames({
      [Loader.blockName]: true,
      [`${Loader.blockName}__fixed`]: this.props.fixed,
    });

    return (
      <div className={classes}>
        <div className={`${Loader.blockName}__container`}>
          <div className={`${Loader.blockName}__ripple`}>
            <FontAwesomeIcon icon={['fad', 'spinner-third']} className={`${Loader.blockName}__spinner`} swapOpacity spin />
          </div>
          {this.props.title && <h1>{this.props.title}</h1>}
        </div>
      </div>
    );
  }
}
