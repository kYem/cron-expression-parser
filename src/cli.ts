#!/usr/bin/env node


import { parse } from './parser';


const [,, args] = process.argv;

function run() {
  if (!args) {
    console.error(`You must provide require expression argument`)
    process.exit(1);
  }

  const parsedExpression = parse(args);

  /*
minute        0 15 30 45
hour          0
day of month  1 15
month         1 2 3 4 5 6 7 8 9 10 11 12
day of week   1 2 3 4 5
command       /usr/bin/find
 */
  Object.entries(parsedExpression).forEach(([key, value]) => {
    console.log(`${key} ${value}`)
  });
}

run();

