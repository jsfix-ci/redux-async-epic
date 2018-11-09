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

export const handleFailure = (action, restMeta, onError) => {
  return error => {
    restMeta.originalPayload = action.payload;
    const failureAction = actions.getFailureAction(action, error, restMeta);

    if (onError) {
      return of(
        failureAction,
        ...ensureArray(onError(error, restMeta, action))
      );
    }
    return of(failureAction);
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
