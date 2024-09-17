import { createStore, applyMiddleware } from 'redux';
import persistConfig from './persistConfig';
import rootReducer from './reducer';
import { thunk } from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(persistedReducer, applyMiddleware(thunk));
const persistor = persistStore(store);

export { store, persistor };