import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { InternalRootState, InternalDispatch } from "./factory";

export const useYusrDispatch = () => useDispatch<InternalDispatch>();
export const useYusrSelector: TypedUseSelectorHook<InternalRootState> = useSelector;