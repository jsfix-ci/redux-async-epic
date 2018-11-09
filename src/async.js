import { Observable, of, concat, throwError } from "rxjs";
import {
  filter,
  mergeMap,
  takeUntil,
  catchError,
  withLatestFrom
} from "rxjs/operators";

import * as actions from "./actions";
import * as handlers from "./handlers";
import { isAsyncAction } from "./checkings";

export const asyncEpic = (action$, state$) =>
  action$.pipe(
    filter(isAsyncAction),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      const { method, onSuccess, onError, ...restMeta } = action.meta;

      if (!method || typeof method !== "function") {
        return throwError(
          "[async] meta.method should be a function returns an observable"
        );
      }

      const result$ = method(action, state);

      if (!(result$ instanceof Observable)) {
        return throwError(
          "[async] meta.method should return an Observable instance"
        );
      }

      const asyncCall$ = result$.pipe(
        mergeMap(handlers.handleSuccess(action, restMeta, onSuccess)),
        takeUntil(handlers.handleAbort(action$, action)),
        catchError(handlers.handleFailure(action, restMeta, onError))
      );

      const startPending$ = of(
        actions.getPendingAction(action, true, restMeta)
      );
      const stopPending$ = of(
        actions.getPendingAction(action, false, restMeta)
      );

      return concat(startPending$, asyncCall$, stopPending$);
    })
  );
