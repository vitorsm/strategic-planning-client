/**
 * Minimal Jest globals so TypeScript can typecheck `*.test.ts(x)` in this repo
 * even before installing `@types/jest`.
 *
 * For best typings, install `@types/jest` (already added to devDependencies).
 */
declare const describe: (...args: any[]) => any;
declare const it: (...args: any[]) => any;
declare const test: (...args: any[]) => any;
declare const expect: any;
declare const jest: any;


