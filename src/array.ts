export function concat<A>(xs: A[][]): A[] {
  return Array.prototype.concat.apply([], xs);
}


export function car(xs: string): string;
export function car<A>(xs: A[]): A;
export function car(xs: any): any {
  return xs[0];
}


export function cdr(xs: string): string;
export function cdr<A>(xs: A[]): A[];
export function cdr(xs: any): any {
  return xs.slice(1);
}


export function cons(x: string, xs: string): string;
export function cons<A>(x: A, xs: A[]): A[];
export function cons(x: any, xs: any): any {
  if (typeof xs === "string") {
    return x + xs;
  }

  return [x].concat(xs);
}


export function uncons(xs: string): [string, string];
export function uncons<A>(xs: A[]): [A, A[]];
export function uncons(xs: any): any {
  if (typeof xs === "string") {
    return <[string, string]> [car(xs), cdr(xs)];
  }

  return <any> [car(xs), cdr(xs)];
}
