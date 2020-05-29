import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from '../../utils/react-redux-hooks';
import { findDocument } from '../../actions';
import { UserProfile } from '../../utils/constants';
import Identity from '../../services/identity';

const useUserProfile = (pid) => {
  const [phrId, setProfileId] = useState(pid);
  const [refetch, setRefetch] = useState(false);
  const [id, setId] = useState(null);
  const dispatch = useDispatch();

  function refetchUserProfile() {
    setRefetch(true);
  }

  useEffect(() => {
    const id = dispatch(
      findDocument({
        id: UserProfile(phrId),
        callApi: Identity.userProfile,
        payload: { phrId },
      }),
    );
    setId(id);
    return () => setRefetch(false);
  }, [phrId, refetch, dispatch]);

  const userProfile = useSelector(state => state.documents[id]);
  const userLoading = userProfile?.meta?.loading ?? true;

  const connected = userProfile?.data?.identity_verifed?.isConnected ?? true;
  const isConnected = !userLoading ? connected : false;

  const access = userProfile?.data?.has_health_records_access ?? true;
  const hasHealthRecordsAccess = !userLoading ? access : false;

  const beta = userProfile?.data?.beta_information ?? false;
  const hasBeta = !userLoading ? beta : false;

  const betaEnabled = userProfile?.data?.beta_information?.enabled ?? false;
  const inBeta = hasBeta ? betaEnabled : false;

  return {
    userProfile,
    userLoading,
    isConnected,
    hasHealthRecordsAccess,
    hasBeta,
    inBeta,
    setProfileId,
    refetchUserProfile,
  };
};

export default useUserProfile;
