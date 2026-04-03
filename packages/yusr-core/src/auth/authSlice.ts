import { createSlice, type PayloadAction, type Slice } from "@reduxjs/toolkit";
import { AuthConstants } from "./authConstants";
import { localStorageService } from "../services/local_storage_service";

export interface AuthState<TUser, TSetting> {
  isAuthenticated: boolean;
  loggedInUser: Partial<TUser> | undefined;
  setting: Partial<TSetting> | undefined;
}

const getInitialState = <
  TUser extends object,
  TSetting extends object,
>(): AuthState<TUser, TSetting> => {
  const authStatus =
    localStorageService.getItem<string>(
      AuthConstants.AuthCheckStorageItemName,
    ) === "true";
  const savedUser = localStorageService.getItem<string>(
    AuthConstants.LoggedInUserStorageItemName,
  );
  const savedSetting = localStorageService.getItem<string>(
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
        localStorageService.setItem(
          AuthConstants.AuthCheckStorageItemName,
          "true",
        );

        if (action.payload) {
          state.loggedInUser = action.payload.user as any;
          localStorageService.setItem(
            AuthConstants.LoggedInUserStorageItemName,
            JSON.stringify(action.payload.user),
          );

          state.setting = action.payload.setting as any;
          localStorageService.setItem(
            AuthConstants.SettingStorageItemName,
            JSON.stringify(action.payload.setting),
          );
        }
      },
      logout: (state) => {
        state.isAuthenticated = false;
        state.loggedInUser = undefined as any;
        state.setting = undefined as any;

        localStorageService.removeItem(AuthConstants.AuthCheckStorageItemName);
        localStorageService.removeItem(
          AuthConstants.LoggedInUserStorageItemName,
        );
        localStorageService.removeItem(AuthConstants.SettingStorageItemName);
      },
      updateLoggedInUser: (state, action: PayloadAction<Partial<TUser>>) => {
        state.loggedInUser = {
          ...(state.loggedInUser as any),
          ...action.payload,
        } as any;
        localStorageService.setItem(
          AuthConstants.LoggedInUserStorageItemName,
          JSON.stringify(state.loggedInUser),
        );
      },
      updateSetting: (state, action: PayloadAction<Partial<TSetting>>) => {
        state.setting = { ...(state.setting as any), ...action.payload } as any;
        localStorageService.setItem(
          AuthConstants.SettingStorageItemName,
          JSON.stringify(state.setting),
        );
      },
      syncFromStorage: (state) => {
        state.isAuthenticated =
          localStorageService.getItem(
            AuthConstants.AuthCheckStorageItemName,
          ) === "true";

        const savedUser = localStorageService.getItem<string>(
          AuthConstants.LoggedInUserStorageItemName,
        );
        state.loggedInUser = savedUser
          ? JSON.parse(savedUser)
          : (undefined as any);

        const savedSetting = localStorageService.getItem<string>(
          AuthConstants.SettingStorageItemName,
        );
        state.setting = savedSetting
          ? JSON.parse(savedSetting)
          : (undefined as any);
      },
    },
  }) as any;
};
