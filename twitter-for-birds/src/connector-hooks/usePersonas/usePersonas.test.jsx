/*eslint-disable*/
import { renderHook } from '@testing-library/react-hooks';
import usePersonas from './usePersonas';
import Personas from '../../services/personas';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import apiMiddleware from '../../utils/apiMiddleware';
import * as ReactReduxHooks from '../../utils/react-redux-hooks';
import personaTestProps from '../../../test-support/utils/personaTestProps';

const middlewares = [thunk, apiMiddleware];
const mockStore = configureMockStore(middlewares);
const store = mockStore({
  documents: {},
  collections: {
    Personas: personaTestProps
  },
  routing: {}
})

describe('The usePersonas Hook', () => {
  beforeAll(() => {
    jest
      .spyOn(ReactReduxHooks, 'useSelector')
      .mockImplementation(state => store.getState(state).collections.Personas)
    jest.spyOn(Personas, 'getPersonasByPHRID').mockImplementation(() => Promise.resolve(personaTestProps));
    jest
      .spyOn(ReactReduxHooks, 'useDispatch')
      .mockImplementation(() => store.dispatch(() => Personas.getPersonasByPHRID));

  });

  afterEach(() => {
    Personas.getPersonasByPHRID.mockClear();
  });

  afterAll(() => {
    Personas.getPersonasByPHRID.mockRestore();
  });

  it('Should make the call to the Personas service and set state for Personas', () => {
    const { result, waitForNextUpdate } = renderHook(() => usePersonas());
    waitForNextUpdate();
    expect(Personas.getPersonasByPHRID).toHaveBeenCalled();
    expect(result.current.personasLoading).toEqual(true);
    expect(result.current.hasBetaPersona).toEqual(false);
    expect(result.current.hasDisneyPersona).toEqual(false);
    expect(result.current.disneyPersonaId).toEqual(null);
    expect(result.current.betaPersonaId).toEqual(null);
    
  });
});
