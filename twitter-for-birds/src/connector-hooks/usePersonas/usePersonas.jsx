import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from '../../utils/react-redux-hooks';
import { findCollection } from '../../actions';
import { UserPersonas } from '../../utils/constants';
import Personas from '../../services/personas';

const usePersonas = (pid) => {
  const [phrId, setPersonaId] = useState(pid);
  const [refetch, setRefetch] = useState(false);
  const [id, setId] = useState(null);
  const dispatch = useDispatch();

  function refetchPersona() {
    setRefetch(true);
  }

  useEffect(() => {
    const id = dispatch(
      findCollection({
        id: UserPersonas(phrId),
        callApi: Personas.getPersonasByPHRID,
        payload: { phrId },
        force: refetch,
      }),
    );
    setId(id);
    return () => setRefetch(false);
  }, [phrId, refetch, dispatch]);

  const personas = useSelector(state => state.collections[id]);
  const personasLoading = personas?.meta?.loading ?? true;
  const hasBetaPersona = !personasLoading ? personas?.data?.some((persona) => persona.external_id === 'beta') : false;
  const hasDisneyPersona = !personasLoading ? personas?.data?.some((persona) => persona.external_id === 'disney') : false;
  const betaPersonaId = hasBetaPersona ? personas?.data?.find((persona) => persona.external_id === 'beta') : null;
  const disneyPersonaId = hasDisneyPersona ? personas?.data?.find((persona) => persona.external_id === 'disney') : null;

  return {
    personas,
    personasLoading,
    hasBetaPersona,
    hasDisneyPersona,
    disneyPersonaId,
    betaPersonaId,
    setPersonaId,
    refetchPersona,
  };
};


export default usePersonas;
