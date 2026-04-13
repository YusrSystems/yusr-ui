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
        state.data = action.payload as any;
        state.errors = {};
      },
      updateFormData(state, action: PayloadAction<Partial<T>>) {
        state.data = { ...state.data  as any, ...action.payload };
        Object.keys(action.payload).forEach((key) => {
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
        state.data = defaultData  as any;
        state.errors = {};
      },
    },
  });
}