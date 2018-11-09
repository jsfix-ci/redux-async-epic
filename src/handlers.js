import { of } from "rxjs";
import { filter } from "rxjs/operators";
import { getAbortType } from "./types";
import { ensureArray } from "./lib";
import * as actions from "./actions";

export const handleAbort = (action$, action) => {
  return action$.pipe(
    filter(({ type }) => {
      return type === getAbortType(action.type);
    })
  );
};

export const handleError = (action, restMeta, onError) => {
  return error => {
    restMeta.originalPayload = action.payload;
    const errorAction = actions.getErrorAction(action, error, restMeta);

    if (onError) {
      return of(errorAction, ...ensureArray(onError(error, restMeta, action)));
    }
    return of(errorAction);
  };
};

export const handleSuccess = (action, restMeta, onSuccess) => {
  return result => {
    const successAction = actions.getSuccessAction(action, result, restMeta);

    if (onSuccess) {
      return of(
        successAction,
        ...ensureArray(onSuccess(result, restMeta, action))
      );
    }
    return of(successAction);
  };
};
