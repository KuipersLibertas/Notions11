import { persistReducer } from 'redux-persist';
import metaReducer, { persistMetaConfig } from './metaSlice';
export default {
  meta: persistReducer(persistMetaConfig, metaReducer)
};