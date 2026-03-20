import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { AuthConstants } from "./authConstants";

export interface AuthState<TUser, TSetting>
{
  isAuthenticated: boolean;
  loggedInUser: Partial<TUser> | undefined;
  setting: Partial<TSetting> | undefined;
}

const getInitialState = <TUser extends object, TSetting extends object>(): AuthState<TUser, TSetting> =>
{
  const authStatus = localStorage.getItem(AuthConstants.AuthCheckStorageItemName) === "true";
  const savedUser = localStorage.getItem(AuthConstants.LoggedInUserStorageItemName);
  const savedSetting = localStorage.getItem(AuthConstants.SettingStorageItemName);

  return {
    isAuthenticated: authStatus,
    loggedInUser: savedUser ? JSON.parse(savedUser) : undefined,
    setting: savedSetting ? JSON.parse(savedSetting) : undefined
  };
};
export const createAuthSlice = <TUser extends object, TSetting extends object>() => {
  return createSlice({
    name: "auth",
    initialState: getInitialState(),
    reducers: {
      login: (state, action: PayloadAction<{ user: TUser; setting: TSetting; } | undefined>) =>
      {
        state.isAuthenticated = true;
        localStorage.setItem(AuthConstants.AuthCheckStorageItemName, "true");

        if (action.payload)
        {
          state.loggedInUser = action.payload.user;
          localStorage.setItem(AuthConstants.LoggedInUserStorageItemName, JSON.stringify(action.payload.user));

          state.setting = action.payload.setting;
          localStorage.setItem(AuthConstants.SettingStorageItemName, JSON.stringify(action.payload.setting));
        }
      },
      logout: (state) =>
      {
        state.isAuthenticated = false;
        state.loggedInUser = undefined;
        state.setting = undefined;

        localStorage.removeItem(AuthConstants.AuthCheckStorageItemName);
        localStorage.removeItem(AuthConstants.LoggedInUserStorageItemName);
        localStorage.removeItem(AuthConstants.SettingStorageItemName);
      },
      updateLoggedInUser: (state, action: PayloadAction<TUser>) =>
      {
        state.loggedInUser = { ...state.loggedInUser, ...action.payload };
        localStorage.setItem(AuthConstants.LoggedInUserStorageItemName, JSON.stringify(action.payload));
      },
      updateSetting: (state, action: PayloadAction<TSetting>) =>
      {
        state.setting = { ...state.setting, ...action.payload };
        localStorage.setItem(AuthConstants.SettingStorageItemName, JSON.stringify(state.setting));
      },
      // This is for your storage event syncing (multi-tab support)
      syncFromStorage: (state) =>
      {
        state.isAuthenticated = localStorage.getItem(AuthConstants.AuthCheckStorageItemName) === "true";

        const savedUser = localStorage.getItem(AuthConstants.LoggedInUserStorageItemName);
        state.loggedInUser = savedUser ? JSON.parse(savedUser) : undefined;

        const savedSetting = localStorage.getItem(AuthConstants.SettingStorageItemName);
        state.setting = savedSetting ? JSON.parse(savedSetting) : undefined;
      }
    }
  });
}