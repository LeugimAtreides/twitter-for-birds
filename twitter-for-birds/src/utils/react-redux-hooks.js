// This file exists so that useSelector and useDispatch can be mocked in tests
import {
  useSelector as originalUseSelector,
  useDispatch as originalUseDispatch,
} from 'react-redux';

export const useSelector = state => originalUseSelector(state);
export const useDispatch = () => originalUseDispatch();
