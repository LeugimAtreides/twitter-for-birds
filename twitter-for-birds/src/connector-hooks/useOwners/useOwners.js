import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from '../../utils/react-redux-hooks';
import { DelegationOwners } from '../../utils/constants';
import { findCollection } from '../../actions';
import Delegation from '../../services/delegation';

const useOwners = () => {
  const [refetch, setRefetch] = useState(false);
  const [id, setId] = useState(null);
  const dispatch = useDispatch();

  function refetchOwners() {
    setRefetch(true);
  }

  useEffect(() => {
    const id = dispatch(
      findCollection({
        id: DelegationOwners,
        callApi: Delegation.GetOwners,
        payload: {},
      }),
    );
    setId(id);
    return () => setRefetch(false);
  }, [refetch, dispatch]);

  const owners = useSelector(state => state.collections[id]);

  return {
    ...owners,
    setRefetch,
    refetchOwners,
  };
};


export default useOwners;
