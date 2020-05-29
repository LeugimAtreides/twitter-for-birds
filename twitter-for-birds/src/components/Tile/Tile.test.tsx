import React from 'react';
import { screen } from '@testing-library/dom'
import { render, getByAltText } from '@testing-library/react';
import Tile from './Tile';

const TileProps = {
  hasAccess: "True",
  hasAccessContent: "",
  title: "eCare",
  description: "Video Visit with Doctor",
  icon: "/static/media/e-care.910419d8.svg",
  url: "/ecare",
  launchModal: "false"
}

test('renders a Tile with proper title and description', () => {
  const { getByText, debug } = render(<Tile {...TileProps} />); // getting a query method from render method

  const title = getByText(/eCare/i); // regex ignore case
  expect(title).toHaveTextContent(TileProps.title); // title is displaying

  const description = getByText(/doctor/i); // regex ignore case
  expect(description).toHaveTextContent(TileProps.description); // description is displaying

  const image = screen.getByAltText('icon'); // regex ignore case

  expect(image).toHaveAttribute('src'); // title is displaying
  expect(image).toHaveAttribute('src', TileProps.icon); // title is displaying
});
