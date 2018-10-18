import * as symbols from "./symbols";
import * as types from "./types";

const makeAction = (typeTransformFn, symbol) => {
  return ({ type }, payload, meta) => {
    const action = {
      type: typeTransformFn(type),
      meta: {
        [symbol]: true,
        ...meta,
      },
    };

    action[symbol === symbols.failure ? "error" : "payload"] = payload;

    return action;
  };
};

export const getSuccessAction = makeAction(
  types.getSuccessType,
  symbols.success
);

export const getPendingAction = makeAction(
  types.getPendingType,
  symbols.pending
);

export const getAbortAction = makeAction(types.getAbortType, symbols.abort);

export const getFailureAction = makeAction(
  types.getFailureType,
  symbols.failure
);
