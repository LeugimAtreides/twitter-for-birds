/*eslint-disable*/
import { renderHook } from '@testing-library/react-hooks';
import useFeatures from './useFeatures';
import Features from '../../services/features';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import apiMiddleware from '../../utils/apiMiddleware';
import * as ReactReduxHooks from '../../utils/react-redux-hooks';

const middlewares = [thunk, apiMiddleware];
const mockStore = configureMockStore(middlewares);
const features = [
    {
        data: '123',
        meta: {
            loading: true
        }
    },
    {
        data: '456',
        meta: {
            loading: false
        }
    }
]
const store = mockStore({
  documents: {},
  collections: {
    Features: features
  },
  routing: {}
})

describe('The useFeatures Hook', () => {
  beforeAll(() => {
    jest
      .spyOn(ReactReduxHooks, 'useSelector')
      .mockImplementation(state => store.getState(state).collections.Features)
    jest.spyOn(Features, 'getFeatures').mockImplementation(() => Promise.resolve({}));
    jest
      .spyOn(ReactReduxHooks, 'useDispatch')
      .mockImplementation(() => store.dispatch(() => Features.getFeatures));

  });

  afterEach(() => {
    Features.getFeatures.mockClear();
  });

  afterAll(() => {
    Features.getFeatures.mockRestore();
  });

  it('Should make the call to the Features service and set state for getFeatures', () => {
    const { result, waitForNextUpdate } = renderHook(() => useFeatures());
    waitForNextUpdate();
    expect(Features.getFeatures).toHaveBeenCalled();
    expect(result.current.features[0].data).toEqual('123');
    expect(result.current.features[0].meta.loading).toEqual(true);
    expect(result.current.features[1].data).toEqual('456');
    expect(result.current.features[1].meta.loading).toEqual(false);
  });
});
