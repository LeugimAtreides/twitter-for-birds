import useProvider from '../../connector-hooks/useProvider/useProvider';
import useRatings from '../../connector-hooks/useRatings/useRatings';
import useReasons from '../../connector-hooks/useReasons/useReasons';
import useGoogleMapImage from '../../connector-hooks/useGoogleMapImage/useGoogleMapImage';

function useSchedulingData({
  physicianId, lat, lon, ratingsPage, location,
}) {
  const provider = useProvider({ physicianId });
  const ratings = useRatings({ providerId: physicianId, ratingsPage });
  const reasons = useReasons();
  const googleMapImage = useGoogleMapImage({ lat, lon, location });

  return ratings && reasons && provider && googleMapImage && {
    ratings,
    reasons,
    provider,
    googleMapImage,
    doneLoading: !ratings?.meta?.loading && !reasons?.meta?.loading
      && !provider?.meta?.loading && !googleMapImage?.meta?.loading,
  };
}

export default useSchedulingData;
