import { Observable, of } from "rxjs";
import * as symbols from "../src/symbols";
import * as handlers from "../src/handlers";

describe("Handlers", () => {
  const testAction = {
    type: "test",
  };

  it("Should handle success action", () => {
    const result = true;
    const handler$ = handlers.handleSuccess(testAction, { rest: "meta field" })(
      result
    );

    let output = null;
    handler$.subscribe(res => (output = res));

    expect(handler$).toBeInstanceOf(Observable);
    expect(output).toEqual({
      type: "test/success",
      payload: true,
      meta: { [symbols.success]: true, rest: "meta field" },
    });

    const onSuccess = payload => ({
      type: "on-success",
      payload,
    });

    const handlerOnSuccess$ = handlers.handleSuccess(
      testAction,
      { rest: "another field" },
      onSuccess
    )(result);

    let outputOnSuccess = [];
    handlerOnSuccess$.subscribe(res => outputOnSuccess.push(res));

    expect(handlerOnSuccess$).toBeInstanceOf(Observable);
    expect(outputOnSuccess).toEqual([
      {
        type: "test/success",
        payload: true,
        meta: { [symbols.success]: true, rest: "another field" },
      },
      {
        type: "on-success",
        payload: true,
      },
    ]);
  });

  it("Should handle error action", () => {
    const result = { error: true };
    const handler$ = handlers.handleFailure(testAction, { rest: "meta field" })(
      result
    );

    let output = null;
    handler$.subscribe(res => (output = res));

    expect(handler$).toBeInstanceOf(Observable);
    expect(output).toEqual({
      type: "test/failure",
      error: { error: true },
      meta: {
        [symbols.failure]: true,
        rest: "meta field",
        originalPayload: undefined,
      },
    });

    const onFailure = payload => ({
      type: "on-error",
      payload,
    });

    const handleronFailure$ = handlers.handleFailure(
      testAction,
      { rest: "another field" },
      onFailure
    )(result);

    let outputonFailure = [];
    handleronFailure$.subscribe(res => outputonFailure.push(res));

    expect(handleronFailure$).toBeInstanceOf(Observable);
    expect(outputonFailure).toEqual([
      {
        type: "test/failure",
        error: { error: true },
        meta: {
          [symbols.failure]: true,
          rest: "another field",
          originalPayload: undefined,
        },
      },
      {
        type: "on-error",
        payload: { error: true },
      },
    ]);
  });

  it("Should handle abort action", () => {
    const actionStream$ = of(
      { type: "first" },
      { type: "second" },
      { type: "test/abort" }
    );

    const testAction = { type: "test" };

    const output = [];
    const handler$ = handlers.handleAbort(actionStream$, testAction);

    handler$.subscribe(action => output.push(action));

    expect(output).toEqual([{ type: "test/abort" }]);
  });
});
