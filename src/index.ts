import {concat, cons, uncons} from "./array";


export interface Parser<A> {
  (input: string): [A, string][];
}


export function result<A>(v: A): Parser<A> {
  return (input) => <[A, string][]> [[v, input]];
}


export function zero<A>(input: string): [A, string][] {
  return <[A, string][]> [];
}


export function item(input: string): [string, string][] {
  return input.length === 0
    ? <[string, string][]> []
    : <[string, string][]> [uncons(input)];
}


export function seq2<A, B>(parserP: Parser<A>, parserQ: Parser<B>): Parser<[A, B]> {
  return bind2(parserP, (x) => {
    return bind2(parserQ, (y) => {
      return result(<[A, B]> [x, y]);
    });
  });
}


// We should avoid using curried function, because TypeScript cannot infer it.
// Type system of TypeScript cannot handle well returned function invokes.
export function bind2<A, B>(parserP: Parser<A>, fn: (a: A) => Parser<B>): Parser<B> {
  return (input) => {
    return concat(parserP(input).map((tupleP) => {
      const [v, inputV] = tupleP;
      return fn(v)(inputV);
    }));
  };
}


export function sat(p: (c: string) => boolean): Parser<string> {
  return bind2(item, (x: string) => {
    return p(x) ? result(x) : <Parser<string>> zero;
  });
}


export function char(x: string): Parser<string> {
  return sat((y) => x === y);
}


export const digit: Parser<string> = sat(isDigit);
export const lower: Parser<string> = sat(isLowerAlpha);
export const upper: Parser<string> = sat(isUpperAlpha);


export function plus2<A>(parserP: Parser<A>, parserQ: Parser<A>): Parser<A> {
  return (input) => concat([parserP(input), parserQ(input)]);
}


export const letter: Parser<string> = plus2(lower, upper);
export const alphanum: Parser<string> = plus2(letter, digit);


export const word: Parser<string> = plus2(
  bind2(letter, (x) => {
    return bind2(word, (xs) => {
      return result(cons(x, xs));
    });
  }),
  result("")
);


export function string(str: string): Parser<string> {
  if (str === "") {
    return result("");
  }

  const [x, xs] = uncons(str);

  return bind2(char(x), () => {
    return bind2(string(xs), () => {
      return result(cons(x, xs));
    });
  });
}


export function many<A>(parserP: Parser<A>): Parser<A[]> {
  return plus2(
    bind2(parserP, (x) => {
      return bind2(many(parserP), (xs) => {
        return result(cons(x, xs));
      });
    }),
    result(<A[]> [])
  );
}


export function many1<A>(parserP: Parser<A>): Parser<A[]> {
  return bind2(parserP, (x) => {
    return bind2(many(parserP), (xs) => {
      return result(cons(x, xs));
    });
  });
}


function isDigit(x: string): boolean {
  return "0" <= <any> x && <any> x <= "9";
}


function isLowerAlpha(x: string): boolean {
  return "a" <= <any> x && <any> x <= "z";
}


function isUpperAlpha(x: string): boolean {
  return "A" <= <any> x && <any> x <= "Z";
}
