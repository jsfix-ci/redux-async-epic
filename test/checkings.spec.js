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

  it("Should return `false` for the not error action", () => {
    expect(checkings.isErrorAction({})).toBeFalsy();
    expect(checkings.isErrorAction({ meta: {} })).toBeFalsy();
    expect(checkings.isErrorAction({ meta: { error: true } })).toBeFalsy();
  });

  it("Should return `true` for the error action", () => {
    expect(
      checkings.isErrorAction({ meta: { [symbols.error]: true } })
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
