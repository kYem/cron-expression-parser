#!/usr/bin/env node


import { parse } from './parser';
import { toStringArray } from './renderer';


const [,, args] = process.argv;

function run() {
  if (!args) {
    console.error(`You must provide require expression argument`)
    process.exit(1);
  }

  try {
    const parsedExpression = parse(args);
    toStringArray(parsedExpression).forEach((part) => {
      console.log(part)
    });
  } catch (e) {
    console.error(e instanceof Error ? e.message : e)
  }
}

run();

