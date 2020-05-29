import React from 'react';
import short from 'short-uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type RatingProps = {
  providerRating: number,
  blockName?: string
}

// eslint-disable-next-line react/prop-types
const Rating: React.FC<RatingProps> = ({ providerRating, blockName = 'hwui-ProviderProfile__Rating--stars' }) => {
  const stars = [];
  // Fills stars based on rating. *A provider will only have a half star if their rating is between .5 and the next whole number.*//
  if (providerRating == null) {
    return null;
    // eslint-disable-next-line no-plusplus
  } for (let i = 0.5; i <= 5; i++) {
    //full star
    stars.push(<FontAwesomeIcon icon={['fas', 'star']} color={"#81c342"} key={short.generate()} />)
    if (i > providerRating) {
      //empty star
      stars.push(<FontAwesomeIcon icon={['fal', 'star']} color={"#81c342"} key={short.generate()} />)
    } else if ((Math.floor(providerRating)) < i && i <= (Math.ceil(providerRating) - 0.5)) {
      //half star
      stars.push(<FontAwesomeIcon icon={['fas', 'star-half']} color={"#81c342"} key={short.generate()} />)
    }
  }

  return (
    <div className={`${blockName}`}>
      {stars}
    </div>
  );
};

export default Rating;
