import { createSlice, type PayloadAction, type Slice } from "@reduxjs/toolkit";
import { AuthConstants } from "./authConstants";

export interface AuthState<TUser, TSetting> {
  isAuthenticated: boolean;
  loggedInUser: Partial<TUser> | undefined;
  setting: Partial<TSetting> | undefined;
}

const getStorageItem = (key: string) => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key);
};

const getInitialState = <
  TUser extends object,
  TSetting extends object,
>(): AuthState<TUser, TSetting> => {
  // On the server, we MUST return a consistent default state to avoid hydration errors
  if (typeof window === "undefined") {
    return {
      isAuthenticated: false,
      loggedInUser: undefined,
      setting: undefined,
    };
  }

  // On the client, we can read from localStorage
  const authStatus =
    localStorage.getItem(AuthConstants.AuthCheckStorageItemName) === "true";
  const savedUser = localStorage.getItem(
    AuthConstants.LoggedInUserStorageItemName,
  );
  const savedSetting = localStorage.getItem(
    AuthConstants.SettingStorageItemName,
  );

  return {
    isAuthenticated: authStatus,
    loggedInUser: savedUser ? JSON.parse(savedUser) : undefined,
    setting: savedSetting ? JSON.parse(savedSetting) : undefined,
  };
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

        if (typeof window !== "undefined") {
          localStorage.setItem(AuthConstants.AuthCheckStorageItemName, "true");
          if (action.payload) {
            localStorage.setItem(
              AuthConstants.LoggedInUserStorageItemName,
              JSON.stringify(action.payload.user),
            );
            localStorage.setItem(
              AuthConstants.SettingStorageItemName,
              JSON.stringify(action.payload.setting),
            );
          }
        }

        if (action.payload) {
          state.loggedInUser = action.payload.user as any;
          state.setting = action.payload.setting as any;
        }
      },
      logout: (state) => {
        state.isAuthenticated = false;
        state.loggedInUser = undefined as any;
        state.setting = undefined as any;

        if (typeof window !== "undefined") {
          localStorage.removeItem(AuthConstants.AuthCheckStorageItemName);
          localStorage.removeItem(AuthConstants.LoggedInUserStorageItemName);
          localStorage.removeItem(AuthConstants.SettingStorageItemName);
        }
      },
      updateLoggedInUser: (state, action: PayloadAction<Partial<TUser>>) => {
        state.loggedInUser = {
          ...(state.loggedInUser as any),
          ...action.payload,
        } as any;
        if (typeof window !== "undefined") {
          localStorage.setItem(
            AuthConstants.LoggedInUserStorageItemName,
            JSON.stringify(state.loggedInUser),
          );
        }
      },
      updateSetting: (state, action: PayloadAction<Partial<TSetting>>) => {
        state.setting = { ...(state.setting as any), ...action.payload } as any;
        if (typeof window !== "undefined") {
          localStorage.setItem(
            AuthConstants.SettingStorageItemName,
            JSON.stringify(state.setting),
          );
        }
      },
      syncFromStorage: (state) => {
        if (typeof window === "undefined") return;

        state.isAuthenticated =
          localStorage.getItem(AuthConstants.AuthCheckStorageItemName) ===
          "true";
        const savedUser = localStorage.getItem(
          AuthConstants.LoggedInUserStorageItemName,
        );
        state.loggedInUser = savedUser
          ? JSON.parse(savedUser)
          : (undefined as any);
        const savedSetting = localStorage.getItem(
          AuthConstants.SettingStorageItemName,
        );
        state.setting = savedSetting
          ? JSON.parse(savedSetting)
          : (undefined as any);
      },
    },
  }) as any;
};
