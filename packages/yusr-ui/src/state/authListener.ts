import { AuthConstants } from "@yusr_systems/core/src/auth/authConstants";
import type { InternalDispatch } from "./factory";

interface AuthActions 
{
  logout: () => any;
  syncFromStorage: () => any;
}

export const setupAuthListeners = (dispatch: InternalDispatch, actions: AuthActions) =>
{
  window.addEventListener("storage", (e) =>
  {
    if (e.key === AuthConstants.AuthCheckStorageItemName)
    {
      dispatch(actions.syncFromStorage());
    }
  });

  window.addEventListener(AuthConstants.UnauthorizedEventName, () =>
  {
    dispatch(actions.logout());
  });
};
