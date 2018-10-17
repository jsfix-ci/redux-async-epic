import { ensureArray } from "../src/lib";

describe("Lib", () => {
  it("Should always return an Array", () => {
    expect(ensureArray(null)).toEqual([null]);
    expect(ensureArray(false)).toEqual([false]);
    expect(ensureArray(true)).toEqual([true]);

    expect(ensureArray(1)).toEqual([1]);
    expect(ensureArray([1])).toEqual([1]);
    expect(ensureArray([[1]])).toEqual([[1]]);
  });
});
