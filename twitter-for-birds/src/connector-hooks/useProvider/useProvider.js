
import moment from 'moment';
import { useSelector, useDispatch } from '../../utils/react-redux-hooks';
import { findDocument } from '../../actions';
import Scheduling from '../../services/scheduling';

function useProvider({ physicianId, isDisney = false, disneyPersonaId = '' }) {
  const dispatch = useDispatch();
  const date = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss').valueOf();
  const currentTimestamp = moment(date).startOf('month').format('YYYY-MM-DD');
  const phId = `${physicianId}, ${currentTimestamp}`;

  const id = dispatch(
    findDocument({
      id: phId,
      callApi: Scheduling.provider,
      payload: {
        params: `${physicianId}${isDisney ? `&persona=${disneyPersonaId}` : ''}`,
        // difference ??? `ID=${physicianId}${isDisney ? `&persona=${disneyPersonaId}` : ''}`
      },
    }),
  );

  const { data, meta } = useSelector(state => state.documents[id]);

  return {
    data,
    meta,
    // setProfileId,
    // refetchFeatures,
  };
}

export default useProvider;
