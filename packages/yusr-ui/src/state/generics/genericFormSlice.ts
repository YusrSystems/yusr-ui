import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface FormState<T> {
  data: Partial<T>;
  errors: Record<string, string>;
}

export function createGenericFormSlice<T>(sliceName: string, defaultData: Partial<T> = {}) {
  const initialState: FormState<T> = {
    data: defaultData,
    errors: {},
  };

  return createSlice({
    name: sliceName,
    initialState,
    reducers: {
      setInitialData(state, action: PayloadAction<Partial<T>>) {
        Object.assign(state, { data: action.payload, errors: {} });
      },
      updateFormData(state, action: PayloadAction<Partial<T> | ((prev: Partial<T>) => Partial<T>)>) {
        const updates =
          typeof action.payload === "function"
            ? action.payload(state.data as Partial<T>)
            : action.payload;
        Object.assign(state.data as Partial<T>, updates);
        Object.keys(updates).forEach((key) => {
          delete state.errors[key];
        });
      },
      setErrors(state, action: PayloadAction<Record<string, string>>) {
        state.errors = action.payload;
      },
      clearError(state, action: PayloadAction<string>) {
        delete state.errors[action.payload];
      },
      resetForm(state) {
        Object.assign(state, { data: defaultData, errors: {} });
      },
    },
  });
}