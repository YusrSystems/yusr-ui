import type { ReducersMapObject } from "@reduxjs/toolkit";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupAuthListeners } from "../../../yusr-core/src/auth/authListener";
import { createAuthSlice } from "../../../yusr-core/src/auth/authSlice";

export const createInternalStore = <TUser extends object, TSetting extends object>(externalReducers: ReducersMapObject = {}) => 
{
    const authSlice = createAuthSlice<TUser, TSetting>();

    const rootReducer = combineReducers({
        auth: authSlice.reducer, // The package's slices
        ...externalReducers, // The app's slices
    });

  const store = configureStore({
    reducer: rootReducer,
  });

  setupAuthListeners(store.dispatch, {
    logout: authSlice.actions.logout,
    syncFromStorage: authSlice.actions.syncFromStorage,
  });

  return store;
};

type AppStore = ReturnType<typeof createInternalStore>;
export type InternalDispatch = AppStore['dispatch'];
export type InternalRootState = ReturnType<AppStore['getState']>;
