/*eslint-disable*/
import { renderHook } from '@testing-library/react-hooks';
import useReasons from './useReasons';
import Scheduling from '../../services/scheduling';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import apiMiddleware from '../../utils/apiMiddleware';
import * as ReactReduxHooks from '../../utils/react-redux-hooks';
import reasonsTestProps from '../../../test-support/utils/reasonsTestProps';

const middlewares = [thunk, apiMiddleware];
const mockStore = configureMockStore(middlewares);
const store = mockStore({
  documents: {},
  collections: {
    Reasons: reasonsTestProps
  },
  routing: {}
})

describe('The useReasons Hook', () => {
  beforeAll(() => {
    jest
      .spyOn(ReactReduxHooks, 'useSelector')
      .mockImplementation(state => store.getState(state).collections.Reasons)
    jest.spyOn(Scheduling, 'reasons').mockImplementation(() => Promise.resolve(reasonsTestProps));
    jest
      .spyOn(ReactReduxHooks, 'useDispatch')
      .mockImplementation(() => store.dispatch(() => Scheduling.reasons));

  });

  afterEach(() => {
    Scheduling.reasons.mockClear();
  });

  afterAll(() => {
    Scheduling.reasons.mockRestore();
  });

  it('Should make the call to the Scheduling service and set state for reasons', () => {
    const { result, waitForNextUpdate } = renderHook(() => useReasons());
    waitForNextUpdate();
    expect(Scheduling.reasons).toHaveBeenCalled();
    expect(result.current.meta.loading).toEqual(false);
    expect(Array.isArray(result.current.data)).toEqual(true);
    expect(result.current.data[0].reason_desc).toBe('New Patient');
  });
});
