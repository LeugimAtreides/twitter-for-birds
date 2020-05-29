import useUserProfile from '../../connector-hooks/useUserProfile/useUserProfile';
import usePersonas from '../../connector-hooks/usePersonas/usePersonas';
import useOwners from '../../connector-hooks/useOwners/useOwners';
import useProvider from '../../connector-hooks/useProvider/useProvider';

function useRequestData({ phr_id = '', physicianId = '' }){
    const userProfile = useUserProfile(phr_id);
    const owners = useOwners();
    const { disneyPersonaId, hasDisneyPersona, personasLoading } = usePersonas(phr_id);
    const provider = useProvider({ physicianId, disneyPersonaId, isDisney: hasDisneyPersona });

    return userProfile && owners && provider && {
        userProfile: ({ ...userProfile.userProfile }),
        owners,
        provider,
        isDisney: hasDisneyPersona,
        doneLoading: !userProfile?.meta?.loading
         && !personasLoading
         && !owners?.meta?.loading 
         && !provider?.meta?.loading
    }
}

export default useRequestData;