import { Subject, of, throwError } from "rxjs";
import * as symbols from "../src/symbols";
import { asyncEpic } from "../src/async";

describe("Async", () => {
  let stateStream$ = of({ state: 1 });
  let actionStream$ = new Subject();
  let res = [];
  let isError = false;
  let subscription = null;

  beforeEach(() => {
    res = [];
    isError = false;

    if (subscription) {
      subscription.unsubscribe();
    }

    subscription = asyncEpic(actionStream$, stateStream$).subscribe(
      r => res.push(r),
      err => (isError = true)
    );
  });

  it("Should do nothing if no async actions", () => {
    actionStream$.next({ type: "test" });
    expect(res).toEqual([]);
    expect(isError).toBeFalsy();

    actionStream$.next({ type: "another test" });
    expect(res).toEqual([]);
    expect(isError).toBeFalsy();
  });

  it("Should throw an error with no `meta.method` field", () => {
    actionStream$.next({ type: "test", meta: { [symbols.async]: true } });
    expect(isError).toBeTruthy();
  });

  it("Should throw an error if `meta.method` does not return an Observable", () => {
    actionStream$.next({
      type: "test",
      meta: { [symbols.async]: true, method: f => f },
    });
    expect(isError).toBeTruthy();
  });

  it("Should return an Observable of 3 actions [pending, success, pending]", () => {
    actionStream$.next({
      type: "test",
      meta: { [symbols.async]: true, method: () => of({ a: 123 }) },
    });
    expect(res).toEqual([
      {
        type: "test/pending",
        payload: true,
        meta: {
          [symbols.pending]: true,
        },
      },
      {
        type: "test/success",
        payload: { a: 123 },
        meta: {
          [symbols.success]: true,
        },
      },
      {
        type: "test/pending",
        payload: false,
        meta: {
          [symbols.pending]: true,
        },
      },
    ]);
  });

  it("Should return an Observable of 3 actions [pending, failure, pending]", () => {
    actionStream$.next({
      type: "test",
      payload: { a: 123 },
      meta: {
        [symbols.async]: true,
        method: () => throwError({ someError: 123 }),
      },
    });

    expect(res).toEqual([
      {
        type: "test/pending",
        payload: true,
        meta: {
          [symbols.pending]: true,
        },
      },
      {
        type: "test/failure",
        error: { someError: 123 },
        meta: {
          [symbols.failure]: true,
          originalPayload: {
            a: 123,
          },
        },
      },
      {
        type: "test/pending",
        payload: false,
        meta: {
          [symbols.pending]: true,
        },
      },
    ]);
  });
});
