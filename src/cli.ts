#!/usr/bin/env node


import { parse } from './parser';
import { toStringArray } from './renderer';


const [,, args] = process.argv;

function run() {
  if (!args) {
    console.error(`You must provide require expression argument`)
    process.exit(1);
  }

  const parsedExpression = parse(args);
  toStringArray(parsedExpression).forEach((part) => {
    console.log(part)
  });
}

run();

