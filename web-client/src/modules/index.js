import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import sessionStorage from 'redux-persist/lib/storage/session';
import auth from './auth';
import github from './github';

const persistConfig = {
  key: 'root',
  storage: sessionStorage,
  whitelist: ['auth'],
};

const rootReducer = combineReducers({
  auth: auth,
  github: github,
});

export default persistReducer(persistConfig, rootReducer);
