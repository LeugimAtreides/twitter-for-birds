/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';
import '../Provider/provider-profile.sass';

export default class StickyScroll extends Component {
  static blockName = 'hwui-StickyScroll';

  // eslint-disable-next-line react/static-property-placement
  static propTypes = {
    // eslint-disable-next-line react/require-default-props
    children: PropTypes.node,
    // eslint-disable-next-line react/no-unused-prop-types
    elementClassName: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    window.addEventListener('scroll', this.handleScroll);
    this.ref = React.createRef();
    this.state = {
      isSticky: false,
    };
  }

  componentDidMount() {
    this.stickyElement = this.ref.current;
    this.setState({ initialPosition: this.stickyElement.offsetTop });
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    if (window.pageYOffset <= this.state.initialPosition) {
      this.setState({ isSticky: false });
    } else if (window.pageYOffset >= this.stickyElement.offsetTop) {
      this.setState({ isSticky: true });
    }
  }

  render() {
    const classes = ClassNames({
      [`${StickyScroll.blockName}`]: true,
      [`${StickyScroll.blockName}--sticky`]: this.state.isSticky,
    });
    return (
      <div ref={this.ref} className={classes}>
        {this.props.children}
      </div>
    );
  }
}
