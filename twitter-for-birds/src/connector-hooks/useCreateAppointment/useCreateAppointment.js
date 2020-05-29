import { useSelector, useDispatch } from '../../utils/react-redux-hooks';
import { findDocument } from '../../actions';
import Scheduling from '../../services/scheduling';

const useCreateAppointment = ({ ownerPhrId, body }) => {
  const dispatch = useDispatch();

  dispatch(findDocument({
    id: ownerPhrId,
    callApi: Scheduling.createAppointmentAtlas,
    payload: {
      ownerPhrId,
      body,
    },
  }));

  const { data, meta } = useSelector(state => state.documents[ownerPhrId]);
  return { data, meta };
};

export default useCreateAppointment;
