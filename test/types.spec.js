import * as types from "../src/types";

describe("Types", () => {
  it("Should return error type", () => {
    expect(types.getErrorType("test")).toEqual("test/error");
  });

  it("Should return success type", () => {
    expect(types.getSuccessType("test")).toEqual("test/success");
  });

  it("Should return pending type", () => {
    expect(types.getPendingType("test")).toEqual("test/pending");
  });

  it("Should return abort type", () => {
    expect(types.getAbortType("test")).toEqual("test/abort");
  });
});
