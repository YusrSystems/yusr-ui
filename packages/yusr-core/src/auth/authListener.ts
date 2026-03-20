import type { InternalDispatch } from "../../../yusr-ui/src/state/factory";
import { AuthConstants } from "./authConstants";

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
