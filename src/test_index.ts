/// <reference path="../typings/main.d.ts" />

import * as assert from "assert";
import * as Parsec from "./index";


describe("index.ts", () => {
  describe("result", () => {
    it("should always return the given value and the input text is not consumed", () => {
      const value = "VALUE";
      const parse = Parsec.result(value);

      const result = parse("THIS INPUT SHOULD NOT BE CONSUMED");

      assert.deepStrictEqual(result, [
        [value, "THIS INPUT SHOULD NOT BE CONSUMED"],
      ]);
    });
  });



  describe("zero", () => {
    it("should always return empty result", () => {
      const parse = Parsec.zero;

      const result = parse("ANYTHING");

      assert.deepStrictEqual(result, []);
    });
  });



  describe("item", () => {
    context("when the input text is empty", () => {
      it("should not comsume anything", () => {
        const parse = Parsec.item;

        const result = parse("");

        assert.deepStrictEqual(result, []);
      });
    });


    context("when the input text is not empty", () => {
      it("should consume a char", () => {
        const parse = Parsec.item;

        const result = parse("THE FIRST CHAR SHOULD BE CONSUMED");

        assert.deepStrictEqual(result, [
          ["T", "HE FIRST CHAR SHOULD BE CONSUMED"],
        ]);
      });
    });
  });



  describe("seq", () => {
    it("should consume which given 2 parsers can consume", () => {
      const parseA = Parsec.item;
      const parseB = Parsec.item;
      const parse = Parsec.seq2(parseA, parseB);

      const result = parse("THE FIRST 2 CHARS SHOULD BE CONSUMED");

      assert.deepStrictEqual(result, [
        [["T", "H"], "E FIRST 2 CHARS SHOULD BE CONSUMED"],
      ]);
    });
  });



  describe("bind2", () => {
    it("should generate new parser by concatnating the given parser and the parser generator", () => {
      const parseA = Parsec.item;
      const parseB = Parsec.item;
      const parse = Parsec.bind2(parseA, () => parseB);

      const result = parse("ABCD");

      assert.deepStrictEqual(result, [
        ["B", "CD"],
      ]);
    });
  });



  describe("sat", () => {
    context("when the predicate returns a true by the char", () => {
      it("should consume a char", () => {
        const parse = Parsec.sat((x) => <any> x === "0");

        const result = parse("0XXX");

        assert.deepStrictEqual(result, [
          ["0", "XXX"],
        ]);
      });
    });


    context("when the predicate returns a false by the char", () => {
      it("should not comsume anything", () => {
        const parse = Parsec.sat((x) => <any> x === "0");

        const result = parse("1XXX");

        assert.deepStrictEqual(result, []);
      });
    });
  });



  describe("char", () => {
    context("when the char is equivalent to the given one", () => {
      it("should consume the char", () => {
        const parse = Parsec.char(<any> "A");

        const result = parse("ABCD");

        assert.deepStrictEqual(result, [
          ["A", "BCD"],
        ]);
      });
    });


    context("when the char is not equivalent to the given one", () => {
      it("should not comsume anything", () => {
        const parse = Parsec.char(<any> "a");

        const result = parse("ABCD");

        assert.deepStrictEqual(result, []);
      });
    });
  });



  describe("digit", () => {
    context("when the input starts with a digit", () => {
      it("should consume the digit", () => {
        const parse = Parsec.digit;

        forEachChar("0123456789", (digit) => {
          const result = parse(digit + "XXXX");

          assert.deepStrictEqual(result, [
            [digit, "XXXX"],
          ]);
        });
      });
    });


    context("when the input does not start with a digit", () => {
      it("should not comsume anything", () => {
        const parse = Parsec.digit;

        forEachChar("abcABC-+*/", (notDigit) => {
          const result = parse(notDigit + "XXXX");

          assert.deepStrictEqual(result, []);
        });
      });
    });
  });



  describe("lower", () => {
    context("when the input starts with a lower letter", () => {
      it("should consume the lower letter", () => {
        const parse = Parsec.lower;

        forEachChar("abcdefghijklmnopqrstuvwxyz", (lowerLetter) => {
          const result = parse(lowerLetter + "XXXX");

          assert.deepStrictEqual(result, [
            [lowerLetter, "XXXX"],
          ]);
        });
      });
    });


    context("when the input does not start with a lower letter", () => {
      it("should not comsume anything", () => {
        const parse = Parsec.lower;

        forEachChar("012ABC-+*/", (notLowerLetter) => {
          const result = parse(notLowerLetter + "XXXX");

          assert.deepStrictEqual(result, []);
        });
      });
    });
  });



  describe("upper", () => {
    context("when the input starts with a upper letter", () => {
      it("should consume the upper letter", () => {
        const parse = Parsec.upper;

        forEachChar("ABCDEFGHIJKLMNOPQRSTUVWXYZ", (upperLetter) => {
          const result = parse(upperLetter + "XXXX");

          assert.deepStrictEqual(result, [
            [upperLetter, "XXXX"],
          ]);
        });
      });
    });


    context("when the input does not start with a upper letter", () => {
      it("should not comsume anything", () => {
        const parse = Parsec.upper;

        forEachChar("012abc-+*/", (notUpperLetter) => {
          const result = parse(notUpperLetter + "XXXX");

          assert.deepStrictEqual(result, []);
        });
      });
    });
  });



  describe("letter", () => {
    context("when the input starts with a letter", () => {
      it("should consume the letter", () => {
        const parse = Parsec.letter;

        forEachChar("ABCDefgh", (upperLetter) => {
          const result = parse(upperLetter + "XXXX");

          assert.deepStrictEqual(result, [
            [upperLetter, "XXXX"],
          ]);
        });
      });
    });


    context("when the input does not start with a letter", () => {
      it("should not comsume anything", () => {
        const parse = Parsec.letter;

        forEachChar("012-+*/", (notLetter) => {
          const result = parse(notLetter + "XXXX");

          assert.deepStrictEqual(result, []);
        });
      });
    });
  });



  describe("alphanum", () => {
    context("when the input starts with an alpha-numeric char", () => {
      it("should consume the letter", () => {
        const parse = Parsec.alphanum;

        forEachChar("ABCDefgh0123", (alphanum) => {
          const result = parse(alphanum + "XXXX");

          assert.deepStrictEqual(result, [
            [alphanum, "XXXX"],
          ]);
        });
      });
    });


    context("when the input does not start with an alpha-numeric char", () => {
      it("should not comsume anything", () => {
        const parse = Parsec.alphanum;

        forEachChar("-+*/", (notAlphanum) => {
          const result = parse(notAlphanum + "XXXX");

          assert.deepStrictEqual(result, []);
        });
      });
    });
  });



  describe("word", () => {
    context("when the input starts with a word", () => {
      it("should consume the word", () => {
        const parse = Parsec.word;

        const result = parse("foo");

        assert.deepStrictEqual(result, [
          ["foo", ""],
          ["fo", "o"],
          ["f", "oo"],
          ["", "foo"],
        ]);
      });
    });


    context("when the input starts with 2 words", () => {
      it("should consume the word", () => {
        const parse = Parsec.word;

        const result = parse("foo bar");

        assert.deepStrictEqual(result, [
          ["foo", " bar"],
          ["fo", "o bar"],
          ["f", "oo bar"],
          ["", "foo bar"],
        ]);
      });
    });


    context("when the input does not start with any words", () => {
      it("should not consume anything", () => {
        const parse = Parsec.word;

        const result = parse("!notword");

        assert.deepStrictEqual(result, [
          ["", "!notword"],
        ]);
      });
    });


    context("when the input is empty", () => {
      it("should not consume anything", () => {
        const parse = Parsec.word;

        const result = parse("");

        assert.deepStrictEqual(result, [
          ["", ""],
        ]);
      });
    });
  });



  describe("string", () => {
    context("when the input starts with the given string", () => {
      it("should consume the string", () => {
        const keyword = "hello";
        const parse = Parsec.string(keyword);

        const result = parse("hello world");

        assert.deepStrictEqual(result, [
          [keyword, " world"],
        ]);
      });
    });


    context("when the input starts with the given string", () => {
      it("should consume the string", () => {
        const keyword = "hello";
        const parse = Parsec.string(keyword);

        const result = parse("helicopter");

        assert.deepStrictEqual(result, []);
      });
    });
  });



  describe("many", () => {
    context("when the input starts with a keyword which the given parser can parse", () => {
      it("should not consume anything", () => {
        const parseA = Parsec.string("foo");
        const parse = Parsec.many(parseA);

        const result = parse("foo bar");

        assert.deepStrictEqual(result, [
          [["foo"], " bar"],
          [[], "foo bar"],
        ]);
      });
    });



    context("when the input starts with a keyword which the given parser can parse", () => {
      it("should not consume anything", () => {
        const parseA = Parsec.string("foo");
        const parse = Parsec.many(parseA);

        const result = parse("foofoo bar");

        assert.deepStrictEqual(result, [
          [["foo", "foo"], " bar"],
          [["foo"], "foo bar"],
          [[], "foofoo bar"],
        ]);
      });
    });



    context("when the input starts with keywords which the given parser cannot parse", () => {
      it("should not consume anything", () => {
        const parseA = Parsec.string("foo");
        const parse = Parsec.many(parseA);

        const result = parse("bar");

        assert.deepStrictEqual(result, [
          [[], "bar"],
        ]);
      });
    });
  });
});


// This function provide a combinient parameterized test.
// Failure message of it is good enough to debug,
// So we do not have to be worry about Assertion Roulette.
function forEachChar(chars: string, fn: (char: string) => void): void {
  chars.split("").forEach(fn);
}
