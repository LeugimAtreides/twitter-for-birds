import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from '../../utils/react-redux-hooks';
import { findDocument } from '../../actions';
import { Providers } from '../../utils/constants';
import Scheduling from '../../services/scheduling';

const useResults = ({ searchParams, hasDisneyPersona, disneyPersonaId }) => {
  const [refetch, setRefetch] = useState(false);
  const [id, setId] = useState(null);
  const dispatch = useDispatch();
  function refetchResults() {
    setRefetch(true);
  }

  useEffect(() => {
    const id = dispatch(
      findDocument({
        id: Providers(searchParams.toString()),
        callApi: Scheduling.providers,
        payload: {
          params: `${searchParams.toString()}${hasDisneyPersona ? `&persona=${disneyPersonaId}` : ''}`,
        },
        force: refetch,
      }),
    );
    setId(id);
    return () => setRefetch(false);
  }, [refetch, dispatch, searchParams, hasDisneyPersona, disneyPersonaId]);

  const results = useSelector(state => state.documents[id]);
  const resultsLoading = results?.meta?.loading ?? true;
  const resultsProviders = results?.data?.providers ?? [];
  const resultsPagination = results?.data?.pagination ?? {};

  return {
    results,
    resultsLoading,
    resultsProviders,
    resultsPagination,
    refetchResults,
  };
};

export default useResults;
