import { Observable, of, concat } from "rxjs";
import {
  filter,
  mergeMap,
  takeUntil,
  catchError,
  withLatestFrom
} from "rxjs/operators";

import * as actions from "./actions";
import * as handlers from "./handlers";
import { onlyAsyncActions } from "./lib";

export const handleAsync = (action$, state$) =>
  action$.pipe(
    filter(onlyAsyncActions),
    withLatestFrom(state$),
    mergeMap(([action, state,]) => {
      const { method, onSuccess, onError, ...restMeta } = action.meta;

      if (!method || typeof method !== "function") {
        throw new Error(
          "[async] meta.method should be a function returns an observable"
        );
      }

      const result$ = method(action, state);

      if (!(result$ instanceof Observable)) {
        throw new Error(
          "[async] meta.method should return an Observable instance"
        );
      }

      const asyncCall$ = result$.pipe(
        mergeMap(handlers.handleSuccess(action, restMeta, onSuccess)),
        takeUntil(handlers.handleAbort(action$, action)),
        catchError(handlers.handleError(action, restMeta, onError))
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
