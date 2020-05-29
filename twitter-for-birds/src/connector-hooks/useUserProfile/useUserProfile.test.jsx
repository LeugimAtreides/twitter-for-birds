/*eslint-disable*/
import { renderHook } from '@testing-library/react-hooks';
import useUserProfile from './useUserProfile';
import Identity from '../../services/identity';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import apiMiddleware from '../../utils/apiMiddleware';
import * as ReactReduxHooks from '../../utils/react-redux-hooks';
import userProfileProps from '../../../test-support/utils/userProfileProps';

const middlewares = [thunk, apiMiddleware];
const mockStore = configureMockStore(middlewares);
const store = mockStore({
  documents: {
    UserProfile: userProfileProps({})
  },
  collections: {},
  routing: {}
})

describe('The useUserProfile Hook', () => {
  beforeAll(() => {
    jest
      .spyOn(ReactReduxHooks, 'useSelector')
      .mockImplementation(state => store.getState(state).documents.UserProfile)
    jest.spyOn(Identity, 'userProfile').mockImplementation(() => Promise.resolve(userProfileProps));
    jest
      .spyOn(ReactReduxHooks, 'useDispatch')
      .mockImplementation(() => store.dispatch(() => Identity.userProfile));

  });

  afterEach(() => {
    Identity.userProfile.mockClear();
  });

  afterAll(() => {
    Identity.userProfile.mockRestore();
  });

  it('Should make the call to the Personas service and set state for Personas', () => {
    const { result, waitForNextUpdate } = renderHook(() => useUserProfile());
    waitForNextUpdate();
    expect(Identity.userProfile).toHaveBeenCalled();
    expect(result.current.userLoading).toEqual(true);
    expect(result.current.isConnected).toEqual(false);
    expect(result.current.hasBeta).toEqual(false);
    expect(result.current.inBeta).toEqual(false);

  });
});
