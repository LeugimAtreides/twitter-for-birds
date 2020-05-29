import { useSelector, useDispatch } from '../../utils/react-redux-hooks';
import { findDocument } from '../../actions';
import { getMapImage } from '../../utils/gmaps';
import { LocationMapImageID } from '../../utils/constants';

const useGoogleMapImage = ({ lat, lon, location }) => {
  const size = [330, 180];
  const dispatch = useDispatch();
  const gMapId = LocationMapImageID(location, size);

  const id = dispatch(findDocument({
    id: gMapId,
    callApi: getMapImage,
    payload: {
      center: [lat, lon],
      size,
    },
  }));

  const { data, meta } = useSelector(state => state.documents[id]);
  return { data, meta };
};

export default useGoogleMapImage;

// REFTECH VERSION
// const useGoogleMapImage = ({ lat, lon, location }) => {
//   const [coordinates, setCoordinates] = useState({ lat, lon, location });
//   const [refetch, setRefetch] = useState(false);
//   const dispatch = useDispatch();

//   function refetchFeatures() {
//     setRefetch(true);
//   }

//   const size = [330, 180];
//   const mapId = LocationMapImageID(location, size);

//   useEffect(() => {
//     const { lat, lon } = coordinates;
//     dispatch(findDocument({
//       id: mapId,
//       callApi: getMapImage,
//       payload: {
//         center: [lat, lon],
//         size,
//       },
//     }));

//     return () => setRefetch(false);
//   }, [size, mapId, coordinates, refetch, dispatch]);

//   const { data, meta } = useSelector(state => state.documents[mapId]);
//   return {
//     data, meta, setCoordinates, refetchFeatures,
//   };
// };

// export default useGoogleMapImage;
