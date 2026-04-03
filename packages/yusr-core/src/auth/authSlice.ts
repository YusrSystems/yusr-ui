import { createSlice, type PayloadAction, type Slice } from "@reduxjs/toolkit";
import { AuthConstants } from "./authConstants";

export interface AuthState<TUser, TSetting> {
  isAuthenticated: boolean;
  loggedInUser: Partial<TUser> | undefined;
  setting: Partial<TSetting> | undefined;
}

const safeStorage = {
  getItem: (key: string) => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(key);
  },
  setItem: (key: string, value: string) => {
    if (typeof window !== "undefined") localStorage.setItem(key, value);
  },
  removeItem: (key: string) => {
    if (typeof window !== "undefined") localStorage.removeItem(key);
  }
};

const getInitialState = <TUser extends object, TSetting extends object>(): AuthState<TUser, TSetting> => {

  const authStatus = safeStorage.getItem(AuthConstants.AuthCheckStorageItemName) === "true";
  const savedUser = safeStorage.getItem(AuthConstants.LoggedInUserStorageItemName);
  const savedSetting = safeStorage.getItem(AuthConstants.SettingStorageItemName);

  try {
    return {
      isAuthenticated: authStatus,
      loggedInUser: savedUser ? JSON.parse(savedUser) : undefined,
      setting: savedSetting ? JSON.parse(savedSetting) : undefined,
    };
  } 
  catch (e) {
    return { isAuthenticated: false, loggedInUser: undefined, setting: undefined };
  }
};

export type AuthReducers<TUser extends object, TSetting extends object> = {
  login: (
    state: any,
    action: PayloadAction<{ user: TUser; setting: TSetting } | undefined>,
  ) => void;
  logout: (state: any) => void;
  updateLoggedInUser: (
    state: any,
    action: PayloadAction<Partial<TUser>>,
  ) => void;
  updateSetting: (state: any, action: PayloadAction<Partial<TSetting>>) => void;
  syncFromStorage: (state: any) => void;
};

export const createAuthSlice = <
  TUser extends object,
  TSetting extends object,
>(): Slice<
  AuthState<TUser, TSetting>,
  AuthReducers<TUser, TSetting>,
  "auth"
> => {
  return createSlice({
    name: "auth",
    initialState: getInitialState<TUser, TSetting>(),
    reducers: {
      login: (
        state,
        action: PayloadAction<{ user: TUser; setting: TSetting } | undefined>,
      ) => {
        state.isAuthenticated = true;
        safeStorage.setItem(AuthConstants.AuthCheckStorageItemName, "true");
        
        if (action.payload) {
          state.loggedInUser = action.payload.user as any;
          safeStorage.setItem(AuthConstants.LoggedInUserStorageItemName, JSON.stringify(action.payload.user));

          state.setting = action.payload.setting as any;
          safeStorage.setItem(AuthConstants.SettingStorageItemName, JSON.stringify(action.payload.setting));
        }
      },
      logout: (state) => {
        state.isAuthenticated = false;
        state.loggedInUser = undefined as any;
        state.setting = undefined as any;

        safeStorage.removeItem(AuthConstants.AuthCheckStorageItemName);
        safeStorage.removeItem(AuthConstants.LoggedInUserStorageItemName);
        safeStorage.removeItem(AuthConstants.SettingStorageItemName);
      },
      updateLoggedInUser: (state, action: PayloadAction<Partial<TUser>>) => {
        state.loggedInUser = { ...(state.loggedInUser as any), ...action.payload } as any;
        safeStorage.setItem(AuthConstants.LoggedInUserStorageItemName, JSON.stringify(state.loggedInUser));
      },
      updateSetting: (state, action: PayloadAction<Partial<TSetting>>) => {
        state.setting = { ...(state.setting as any), ...action.payload } as any;
        safeStorage.setItem(AuthConstants.SettingStorageItemName, JSON.stringify(state.setting));
      },
      syncFromStorage: (state) => {
        state.isAuthenticated = safeStorage.getItem(AuthConstants.AuthCheckStorageItemName) === "true";

        const savedUser = safeStorage.getItem(AuthConstants.LoggedInUserStorageItemName);
        state.loggedInUser = savedUser ? JSON.parse(savedUser) : (undefined as any);

        const savedSetting = safeStorage.getItem(AuthConstants.SettingStorageItemName);
        state.setting = savedSetting ? JSON.parse(savedSetting) : (undefined as any);
      }
    }
  }) as any;
};
