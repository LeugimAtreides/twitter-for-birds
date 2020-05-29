/* eslint-disable */
import React from 'react';
import styled from 'styled-components';

export default function ProviderWrapper({ children, styles }) {
  const ProviderWrapper = styled.div`width: 100%; ${styles}`;
  return (
    <ProviderWrapper>
      {children}
    </ProviderWrapper>
  );
}
