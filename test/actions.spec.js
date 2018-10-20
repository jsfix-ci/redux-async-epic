import * as actions from "../src/actions";
import * as symbols from "../src/symbols";

describe("Checkings", () => {
  const testAction = {
    type: "test",
  };

  it("Should return PendingAction", () => {
    expect(actions.getPendingAction(testAction, true)).toEqual({
      type: "test/pending",
      payload: true,
      meta: {
        [symbols.pending]: true,
      },
    });

    expect(actions.getPendingAction(testAction, false)).toEqual({
      type: "test/pending",
      payload: false,
      meta: {
        [symbols.pending]: true,
      },
    });

    expect(
      actions.getPendingAction(testAction, true, { other: "meta field" })
    ).toEqual({
      type: "test/pending",
      payload: true,
      meta: {
        [symbols.pending]: true,
        other: "meta field",
      },
    });
  });

  it("Should return SuccessAction", () => {
    expect(actions.getSuccessAction(testAction, { a: 1 })).toEqual({
      type: "test/success",
      payload: { a: 1 },
      meta: {
        [symbols.success]: true,
      },
    });

    expect(actions.getSuccessAction(testAction, { b: 1 })).toEqual({
      type: "test/success",
      payload: { b: 1 },
      meta: {
        [symbols.success]: true,
      },
    });

    expect(
      actions.getSuccessAction(testAction, true, { other: "meta field" })
    ).toEqual({
      type: "test/success",
      payload: true,
      meta: {
        [symbols.success]: true,
        other: "meta field",
      },
    });
  });

  it("Should return FailureAction", () => {
    expect(actions.getFailureAction(testAction, { a: 1 })).toEqual({
      type: "test/failure",
      payload: { a: 1 },
      error: true,
      meta: {
        [symbols.failure]: true,
      },
    });

    expect(actions.getFailureAction(testAction, { b: 1 })).toEqual({
      type: "test/failure",
      payload: { b: 1 },
      error: true,
      meta: {
        [symbols.failure]: true,
      },
    });

    expect(
      actions.getFailureAction(testAction, true, { other: "meta field" })
    ).toEqual({
      type: "test/failure",
      payload: true,
      error: true,
      meta: {
        [symbols.failure]: true,
        other: "meta field",
      },
    });
  });

  it("Should return AbortAction", () => {
    expect(actions.getAbortAction(testAction, { a: 1 })).toEqual({
      type: "test/abort",
      payload: { a: 1 },
      meta: {
        [symbols.abort]: true,
      },
    });

    expect(actions.getAbortAction(testAction, { b: 1 })).toEqual({
      type: "test/abort",
      payload: { b: 1 },
      meta: {
        [symbols.abort]: true,
      },
    });

    expect(
      actions.getAbortAction(testAction, true, { other: "meta field" })
    ).toEqual({
      type: "test/abort",
      payload: true,
      meta: {
        [symbols.abort]: true,
        other: "meta field",
      },
    });
  });
});
