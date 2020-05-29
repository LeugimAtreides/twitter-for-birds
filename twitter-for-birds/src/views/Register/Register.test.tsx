import React from 'react';
import { Router, Route } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { screen } from '@testing-library/dom';
import { render, getByAltText } from '@testing-library/react';
import { EmptyDocument } from '../../utils/constants';
import Register from './Register';
import ProfilePicker from './ProfilePicker';
import OfficeDetails from './OfficeDetails';

const RegisterProps = {};

const params = {
  appointmentId: '57073023',
  locationId: '9cd5f295-dc7b-4ba0-964b-54e09262d38e',
  physicianId: 'A66DC977-5D8D-6A95-B4DF-5350D2BBB316',
};

const pageText = {
  pickerHeader: 'Who is this appointment for?'
}

const OfficeDetailsProps = {
  provider: {
    office: {
      address1: "631 Palm Springs Dr",
      address2: "Suite 101",
      alsoKnownAsFacilityName: "",
      athenaProviderId: "1103",
      city: "Altamonte Springs",
      departmentId: "650",
      facilityName: "",
      fax: "407-331-1156",
      geoLocation: { x: 28.674939, y: -81.373849 },
      id: "9cd5f295-dc7b-4ba0-964b-54e09262d38e",
      in_network: "0",
      name: "Palm Springs Family Care",
      parentId: "A66DC977-5D8D-6A95-B4DF-5350D2BBB316",
      phoneNumber: "407-331-1121",
      practiceId: "13122",
      previousFacilityName: "",
      providerGroupId: "121",
      providerGroupName: "FHMG_Florida Hospital Medical Group",
      state: ["FL", "US-FL", "Florida"],
      type: "OfficeAddressDoc",
      types: ["child", "OfficeAddressDoc"],
      zipcode: "32701",
    },
    fullAddress: '631 Palm Springs Dr, Suite 101, Altamonte Springs, FL, 32701'
  },
  mapImage: EmptyDocument,
  showMap: false,
}

test('renders Register component', () => {
  const { appointmentId, locationId, physicianId } = params;
  const history = createMemoryHistory({ initialEntries: [`/scheduling/appointments/${appointmentId}/location/${locationId}/physician/${physicianId}`] });
  const {
    getByText, getByTestId, getByLabelText, debug,
  } = render(
    <Router history={history}>
      <Route path="/scheduling/appointments/appointmentId/location/:locationId/physician/:physicianId">
        <Register {...RegisterProps} />
      </Route>
    </Router>,
  );
});

test('renders ProfilePicker component', () => {
  const history = createMemoryHistory({ initialEntries: ['/'] });
  const {
    getByText, getByTestId, getByLabelText, debug,
  } = render(
    <Router history={history}>
      <ProfilePicker />
    </Router>,
  );

  // the Profile Picker h2
  const pageHeader = getByText(pageText.pickerHeader);
  expect(pageHeader).toHaveTextContent(pageText.pickerHeader); // description is displaying
});

test('renders OfficeDetails component', () => {
  const history = createMemoryHistory({ initialEntries: ['/'] });
  const {
    getByText, getByTestId, getByLabelText, debug,
  } = render(
    <Router history={history}>
      <OfficeDetails {...OfficeDetailsProps} />
    </Router>,
  );

  // the Office Details h2
  const officeDetailsH2 = getByTestId(/officeDetailsH2/i);
  expect(officeDetailsH2).toHaveTextContent(OfficeDetailsProps.provider.office.city); // description is displaying
});