/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import short from 'short-uuid';
import Rating from '../Provider/Rating.tsx';
import NumberedPager from './NumberedPager';
import LoaderAnimation from '../Loader/Loader';

const RatingSection = ({
  ratings, totalRating, ratingCount, page, onPage,
}) => {
  const { loading } = ratings.meta;
  const reviews = loading ? [] : ratings.data.providerReview.filter(rating => rating.comment);
  // eslint-disable-next-line radix
  const reviewCount = loading ? [] : parseInt(ratings.data.pagination.recordCount);
  const perPage = 5;
  const reviewList = reviews.map((review) => (
    <div key={short.generate()} className={`${RatingSection.blockName}--review`}>
      <div className="rating">
        <div className="stars">
          <Rating providerRating={review.rating} />
          <p className={`${RatingSection.blockName}--number`}>{review.rating}</p>
        </div>
        <div className="date">
          {moment(review.date, 'M/D/YYYY HH:mm:ss').format('M/D/YYYY')}
        </div>
        <p>{review.comment}</p>
        <p className={`${RatingSection.blockName}--name`} rel="author"> - Verified AdventHealth Patient</p>
      </div>
    </div>
  ));

  return (
    loading ? <LoaderAnimation />
      : (
        <div className={`${RatingSection.blockName}--reviews`}>
          <div className={`${RatingSection.blockName}--heading`}>
            <p className={`${RatingSection.blockName}--number`}>{Number(totalRating.toFixed(1))}</p>
            <Rating providerRating={totalRating} />
            <p className={`${RatingSection.blockName}--responses`}>{`${ratingCount} Reviews, ${reviewCount} Comments`}</p>
          </div>
          <div className={`${RatingSection.blockName}--review-container`}>
            {reviewList}
          </div>
          <NumberedPager {...{
            perPage,
            numItems: reviewCount,
            page,
            selectPage: onPage,
            displayNum: 3,
          }}
          />
        </div>
      )
  );
};

RatingSection.blockName = 'hwui-ProviderProfile__Rating';
RatingSection.propTypes = {
  ratings: PropTypes.object,
  totalRating: PropTypes.number.isRequired,
  ratingCount: PropTypes.number.isRequired,
  page: PropTypes.number,
  onPage: PropTypes.func,
};


export default RatingSection;
