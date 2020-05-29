import React from 'react';
import PropTypes from 'prop-types';

const DetailsPage = ({ children }) => (
  <div>
    {children}
  </div>
);

DetailsPage.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DetailsPage;
