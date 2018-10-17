import * as checkings from "../src/checkings";
import * as symbols from "../src/symbols";

describe("Checkings", () => {
  it("Should return `false` for the not async action", () => {
    expect(checkings.isAsyncAction({})).toBeFalsy();
    expect(checkings.isAsyncAction({ meta: {} })).toBeFalsy();
    expect(checkings.isAsyncAction({ meta: { async: true } })).toBeFalsy();
  });

  it("Should return `true` for the async action", () => {
    expect(
      checkings.isAsyncAction({ meta: { [symbols.async]: true } })
    ).toBeTruthy();
  });

  it("Should return `false` for the not pending action", () => {
    expect(checkings.isPendingAction({})).toBeFalsy();
    expect(checkings.isPendingAction({ meta: {} })).toBeFalsy();
    expect(checkings.isPendingAction({ meta: { pending: true } })).toBeFalsy();
  });

  it("Should return `true` for the pending action", () => {
    expect(
      checkings.isPendingAction({ meta: { [symbols.pending]: true } })
    ).toBeTruthy();
  });

  it("Should return `false` for the not failure action", () => {
    expect(checkings.isFailureAction({})).toBeFalsy();
    expect(checkings.isFailureAction({ meta: {} })).toBeFalsy();
    expect(checkings.isFailureAction({ meta: { failure: true } })).toBeFalsy();
  });

  it("Should return `true` for the failure action", () => {
    expect(
      checkings.isFailureAction({ meta: { [symbols.failure]: true } })
    ).toBeTruthy();
  });

  it("Should return `false` for the not success action", () => {
    expect(checkings.isSuccessAction({})).toBeFalsy();
    expect(checkings.isSuccessAction({ meta: {} })).toBeFalsy();
    expect(checkings.isSuccessAction({ meta: { success: true } })).toBeFalsy();
  });

  it("Should return `true` for the success action", () => {
    expect(
      checkings.isSuccessAction({ meta: { [symbols.success]: true } })
    ).toBeTruthy();
  });
});
