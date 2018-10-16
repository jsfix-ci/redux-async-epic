import * as symbols from "./symbols";
import * as types from "./types";

export const getSuccessAction = ({ type, }, payload, meta) => ({
  type: types.getSuccessType(type),
  payload,
  meta: {
    [symbols.success]: true,
    ...meta,
  },
});

export const getFailureAction = ({ type, }, payload, meta) => ({
  type: types.getFailureType(type),
  payload,
  meta: {
    [symbols.failure]: true,
    ...meta,
  },
});

export const getPendingAction = ({ type, }, payload, meta) => ({
  type: types.getPendingType(type),
  payload,
  meta: {
    [symbols.pending]: true,
    ...meta,
  },
});
