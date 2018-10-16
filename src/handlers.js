import { ofType } from "redux-observable";
import { of } from "rxjs/observable/of";
import { getAbortType } from "./types";
import { enshureArray } from "./lib";
import * as actions from "./actions";

export const handleAbort = (action$, action) => {
  return action$.pipe(ofType(getAbortType(action)));
};

export const handleError = (action, restMeta, onError) => {
  return error => {
    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }

    restMeta.originalPayload = action.payload;
    const failureAction = actions.getFailureAction(action, error, restMeta);

    if (onError) {
      return of(
        failureAction,
        ...enshureArray(onError(error, restMeta, action))
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
        ...enshureArray(onSuccess(result, restMeta, action))
      );
    }
    return of(successAction);
  };
};
