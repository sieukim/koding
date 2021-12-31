import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import sessionStorage from 'redux-persist/lib/storage/session';
import auth from './auth';

const persistConfig = {
  key: 'root',
  storage: sessionStorage,
  whitelist: ['auth'],
};

const rootReducer = combineReducers({
  auth: auth,
});

export default persistReducer(persistConfig, rootReducer);
