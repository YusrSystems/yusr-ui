import type { ActionCreatorWithoutPayload, ActionCreatorWithPayload } from "@reduxjs/toolkit";
import type { ValidationRule } from "@yusr_systems/core";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export interface FormSliceActions<T> {
  setInitialData: ActionCreatorWithPayload<Partial<T>>;
  updateFormData: ActionCreatorWithPayload<Partial<T>>;
  setErrors: ActionCreatorWithPayload<Record<string, string>>;
  clearError: ActionCreatorWithPayload<string>;
  resetForm: ActionCreatorWithoutPayload;
}

export function useReduxEntityForm<T>(
  actions: FormSliceActions<T>,
  selectFormState: (state: any) => { data: Partial<T>; errors: Record<string, string> },
  validationRules: ValidationRule<Partial<T>>[],
  initialValues?: Partial<T>
) {
  const dispatch = useDispatch();
  const formState = useSelector(selectFormState);
  
  const formData = formState?.data || {};
  const errors = formState?.errors || {};

  useEffect(() => {
    if (initialValues) {
      dispatch(actions.setInitialData(initialValues));
    }
  }, [dispatch, actions, initialValues]);

  const getError = (field: keyof T | string) => errors[field as string];
  const isInvalid = (field: keyof T | string) => !!errors[field as string];

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    validationRules.forEach((rule) => {
      const value = rule.selector(formData);

      for (const validator of rule.validators) {
        const error = validator(value, formData);
        if (error) {
          newErrors[rule.field as string] = error;
          isValid = false;
          break;
        }
      }
    });

    dispatch(actions.setErrors(newErrors));
    return isValid;
  }, [formData, validationRules, dispatch, actions]);

  const handleChange = useCallback(
    (update: Partial<T> | ((prev: Partial<T>) => Partial<T>)) => {
      const updates = typeof update === "function" ? update(formData) : update;
      dispatch(actions.updateFormData(updates));
    },
    [dispatch, actions, formData]
  );

  const clearError = (field: keyof T | string) => {
    dispatch(actions.clearError(field as string));
  };

  const errorInputClass = (field: string) =>
    isInvalid(field)
      ? "border-red-600 dark:border-red-600 ring-red-600 text-red-600 placeholder:text-red-600"
      : "";

  return {
    formData,
    errors,
    getError,
    isInvalid,
    validate,
    clearError,
    errorInputClass,
    handleChange,
    resetForm: () => dispatch(actions.resetForm())
  };
}