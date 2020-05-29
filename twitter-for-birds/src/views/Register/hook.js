import { useAppointments } from '../../connector-hooks/useAppointments/useAppointments';
import useReasons from '../../connector-hooks/useReasons/useReasons';
import useProvider from '../../connector-hooks/useProvider/useProvider';
import useUserProfile from '../../connector-hooks/useUserProfile/useUserProfile';
import useOwners from '../../connector-hooks/useOwners/useOwners';
import useGoogleMapImage from '../../connector-hooks/useGoogleMapImage/useGoogleMapImage';

function useRegisterData({
  physicianId, phr_id, appointmentReason, date, location, lat, lon,
}) {
  const appointments = useAppointments({ physicianId, appointmentReason, date });
  const reasons = useReasons();
  const provider = useProvider({ physicianId });
  const userProfile = useUserProfile(phr_id);
  const owners = useOwners();
  const googleMapImage = useGoogleMapImage({ lat, lon, location });

  return appointments && reasons && provider && userProfile && owners && googleMapImage && {
    appointments,
    reasons,
    provider,
    userProfile: ({ ...userProfile.userProfile }),
    owners,
    googleMapImage,
    doneLoading: !appointments?.meta?.loading
      && !reasons?.meta?.loading && !provider?.meta?.loading
      && !userProfile.userProfile?.meta?.loading && !owners?.meta?.loading
      && !googleMapImage?.meta?.loading,
  };
}

export default useRegisterData;
