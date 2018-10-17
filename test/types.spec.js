import * as types from "../src/types";

describe("Types", () => {
  it("Should return failure type", () => {
    expect(types.getFailureType("test")).toEqual("test/failure");
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
