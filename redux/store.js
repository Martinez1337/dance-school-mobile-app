import {configureStore} from '@reduxjs/toolkit';
import {persistLevelMiddleware, persistSessionMiddleware, persistUserMiddleware} from "./middleware";
import {levelReducer, sessionReducer, userReducer} from "./slices";

const store = configureStore({
  reducer: {
    session: sessionReducer,
    user: userReducer,
    level: levelReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      persistSessionMiddleware,
      persistUserMiddleware,
      persistLevelMiddleware
    ])
});

export default store;
