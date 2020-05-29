import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { screen } from '@testing-library/dom'
import { render, getByAltText } from '@testing-library/react';
import Provider from './Provider';

const ProviderProps = {
  provider: {
    photoURL: 'https://bios.floridahospital.org/sites/default/files/styles/bio-hs/public/physician_images/1942259908.jpg',
    sslImageUrl: 'https://bios.floridahospital.org/sites/default/files/styles/bio-hs/public/physician_images/1942259908.jpg',
    firstName: 'Vipul',
    initials: 'VP',
    displayName: 'Vipul Patel, MD',
    specialties: ["Urology"],
    phoneNumber: "407-303-4673",
  },
  showAvailability: true,
  showVideoVisitFlag: true,
  showNewPatientFlag: true,
  showRating: true,
  showButton: false,
  showEmployedFlag: false,
  showNetworkFlag: false,
  showInsuranceFlag: true,
  buttonOnClick: () => null,
  office: {
    types: ["child", "OfficeAddressDoc"],
    id: "5e6a4de1-57aa-4a82-b3ba-b20ba80bea90",
    address1: "",
    state: ["NULL", "NULL", "NULL"],
    name: " ",
    phoneNumber: "407-303-4673",
    parentId: "F2C52E78-2FAE-3E6F-67D3-89260556AF26",
    facilityName: "",
    previousFacilityName: "",
    fax: "407-303-4758",
    alsoKnownAsFacilityName: "",
    type: "OfficeAddressDoc",
    in_network: "0",
  },
  showRequest: false,
  ratingOnClick: () => false,
  blockName: "hwui-ProviderProfile"
}

test('renders Provider component image, doctorName and specialty', () => {
  // creates own instance of history for testing purposes - root route is Home
  const history = createMemoryHistory({ initialEntries: ['/'] });
  const { getByText, getByTestId, getByLabelText, debug } = render(
    // Router is needed to wrap the component when routing links
    <Router history={history}>
      <Provider {...ProviderProps} />
    </Router>
  )

  const image = screen.getByAltText(ProviderProps.provider.firstName); // regex ignore case
  expect(image).toHaveAttribute('src'); // title is displaying
  expect(image).toHaveAttribute('src', ProviderProps.provider.sslImageUrl); // title is displaying

  const doctorName = getByText(ProviderProps.provider.displayName); // regex ignore case
  expect(doctorName).toHaveTextContent(ProviderProps.provider.displayName); // description is displaying

  const specialty = getByText(ProviderProps.provider.specialties[0]); // regex ignore case
  expect(specialty).toHaveTextContent(ProviderProps.provider.specialties[0]); // description is displaying
});
