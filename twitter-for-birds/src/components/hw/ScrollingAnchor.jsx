import React from 'react';
import PropTypes from 'prop-types';

// Returns anchors that smooth scroll to #tags.//

const ScrollingAnchor = ({ href, children, className }) => {
  const ScrollingAnchoronClick = (e) => {
    e.preventDefault(); document.querySelector(href).scrollIntoView(
      ({ behavior: 'smooth', block: 'start', inline: 'start' }),
    );
  };

  return (
    <a
      className={`${className}`}
      href={href}
      onClick={ScrollingAnchoronClick}
    >
      {children}
    </a>
  );
};


ScrollingAnchor.propTypes = {
  href: PropTypes.string.isRequired,
  // eslint-disable-next-line react/require-default-props
  children: PropTypes.node,
  className: PropTypes.string,
};

ScrollingAnchor.defaultProps = {
  className: '',
};

export default ScrollingAnchor;
