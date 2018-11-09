import * as symbols from "./symbols";

export const isAsyncAction = action =>
  action.meta && !!action.meta[symbols.async];

export const isPendingAction = action =>
  action.meta && !!action.meta[symbols.pending];

export const isErrorAction = action =>
  action.meta && !!action.meta[symbols.error];

export const isSuccessAction = action =>
  action.meta && !!action.meta[symbols.success];
