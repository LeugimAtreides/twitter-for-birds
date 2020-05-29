import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from '../../utils/react-redux-hooks';
import { findCollection } from '../../actions';
import { SchedulingFeatures } from '../../utils/constants';
import Features from '../../services/features';

const useFeatures = (pid) => {
  const [phrId, setProfileId] = useState(pid);
  const [refetch, setRefetch] = useState(false);
  const [id, setId] = useState(null);
  const dispatch = useDispatch();

  function refetchFeatures() {
    setRefetch(true);
  }

  useEffect(() => {
    const id = dispatch(
      findCollection({
        id: SchedulingFeatures(phrId),
        callApi: Features.getFeatures,
        payload: {
          phrId,
          featureGroup: 'find-care',
        },
      }),
    );
    setId(id);
    return () => setRefetch(false);
  }, [phrId, refetch, dispatch]);

  const features = useSelector(state => state.collections[id]);

  return {
    features,
    setProfileId,
    refetchFeatures,
  };
};

export default useFeatures;
