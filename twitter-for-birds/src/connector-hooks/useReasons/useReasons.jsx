import { useSelector, useDispatch } from '../../utils/react-redux-hooks';
import { findCollection } from '../../actions';
import { Reasons } from '../../utils/constants';
import Scheduling from '../../services/scheduling';

const useReasons = () => {
  const dispatch = useDispatch();

  const id = dispatch(
    findCollection({
      id: Reasons,
      callApi: Scheduling.reasons,
      payload: {},
    }),
  );

  const reasons = useSelector(state => state.collections[id]);
  return reasons;
};

export default useReasons;
