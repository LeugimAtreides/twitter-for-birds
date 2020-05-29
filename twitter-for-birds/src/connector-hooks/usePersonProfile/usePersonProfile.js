import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from '../../utils/react-redux-hooks';
import { findDocument } from '../../actions';
import { UserProfile, BuildDocument } from '../../utils/constants';
import Identity from '../../services/identity';

const usePersonProfile = (pid) => {
  const [phrId, setProfileId] = useState(pid);
  const [refetch, setRefetch] = useState(false);
  const [id, setId] = useState(null);
  const dispatch = useDispatch();

  function refetchProfile() {
    setRefetch(true);
  }

  useEffect(() => {
    const id = dispatch(
      findDocument({
        id: UserProfile(phrId),
        callApi: Identity.profile,
        payload: { phrId },
      }),
    );
    setId(id);
    return () => setRefetch(false);
  }, [phrId, refetch, dispatch]);

  const personProfile = useSelector(state => state.documents[id]);

  return personProfile && {
    ...BuildDocument(personProfile),
    refetchProfile,
    setProfileId,
    phrId,
  };
};

export default usePersonProfile;
