import * as assert from "assert";
import * as ArrayUtil from "./array";


describe("array.ts", () => {
  describe("concat", () => {
    context("when the given nested array is empty", () => {
      it("should return a new empty array", () => {
        const result = ArrayUtil.concat([]);
        assert.deepStrictEqual(result, []);
      });
    });


    context("when the given nested array is not empty", () => {
      it("should return a new concatnated array", () => {
        const result = ArrayUtil.concat([["a", "b"], ["c"], ["d", "e", "f"]]);
        assert.deepStrictEqual(result, ["a", "b", "c", "d", "e", "f"]);
      });
    });
  });
});
