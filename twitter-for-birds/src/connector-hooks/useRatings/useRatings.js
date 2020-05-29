import { useSelector, useDispatch } from '../../utils/react-redux-hooks';
import { findDocument } from '../../actions';
import Scheduling from '../../services/scheduling';

// { uuid, page }
function useRatings({ providerId, ratingsPage }) {
  const dispatch = useDispatch();
  const page = ratingsPage;
  const provIdKey = `Ratings${providerId}&page=${page}`;

  const id = dispatch(
    findDocument({
      id: provIdKey,
      callApi: Scheduling.providerRatings,
      payload: {
        uuid: providerId,
        page,
        size: 5,
      },
    }),
  );

  const { data, meta } = useSelector(state => state.documents[id]);

  return {
    data,
    meta,
    // setProfileId,
    // refetchFeatures,
  };
}

export default useRatings;
