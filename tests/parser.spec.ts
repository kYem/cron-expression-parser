import { expect } from 'chai';
import { parse, validationMap } from '../src/parser';

describe('parser', function () {

  describe('handle invalid expressions', function () {

    [
      '',
      '* *',
      'a * * * *',
    ].forEach(expression => {
      it(`should throw error when parsing "${expression}"`, () => {
        expect(() => parse(expression)).to.throw(Error);
      });
    });
  });

  describe('minute', function () {

    const createMinute = (minute: string) => `${minute} * * * * echo Hello`;
    [
      createMinute(''),
      createMinute('a'),
      createMinute('a-a'),
      createMinute('60'),
      createMinute('000'),
      createMinute('*/60'),
      createMinute('1-60'),
    ].forEach(expression => {
      it(`should throw error when parsing "${expression}"`, () => {
        expect(() => parse(expression)).to.throw(Error);
      });
    });

    const allEntries: number[] = Array.from({ length: 60 }).map((v, i) => i);

    [
      { expression: createMinute('*'), expected: allEntries },
      { expression: createMinute('0'), expected: [0] },
      { expression: createMinute('00'), expected: [0] },
      { expression: createMinute('1'), expected: [1] },
      { expression: createMinute('55'), expected: [55] },
      { expression: createMinute('*/15'), expected: [0, 15, 30, 45] },
      { expression: createMinute('*/30'), expected: [0, 30] },
      { expression: createMinute('*/15,*/30'), expected: [0, 15, 30, 45] },
      { expression: createMinute('1-4'), expected: [1, 2, 3, 4] },
    ].forEach(({ expression, expected }) => {
      it(`should parse "${expression}" and return ${expected}`, () => {
        const parsedExpression = parse(expression);
        expect(parsedExpression.minute).be.eqls(expected);
      });
    });
  });

  describe('hour', function () {

    const createHour = (field: string) => `* ${field} * * * echo Hello`;
    describe('expected not valid', function () {
      [
        createHour(''),
        createHour('a'),
        createHour('a-a'),
        createHour('000'),
        createHour('*/24'),
        createHour('1-60'),
        createHour('*,1-60'),
      ].forEach(expression => {
        it(`should throw error when parsing "${expression}"`, () => {
          expect(() => parse(expression)).to.throw(Error);
        });
      });
    });

    const { min, max } = validationMap.hour;
    const fullEntries: number[] = Array.from({ length: max + 1 }).map((v, i) => min + i);

    [
      { expression: createHour('*'), expected: fullEntries },
      { expression: createHour('0'), expected: [0] },
      { expression: createHour('00'), expected: [0] },
      { expression: createHour('1'), expected: [1] },
      { expression: createHour('*/5'), expected: [0, 5, 10, 15, 20] },
      { expression: createHour('*/15'), expected: [0, 15] },
      { expression: createHour('*/15,*/5'), expected: [0, 5, 10, 15, 20] },
      { expression: createHour('2-5'), expected: [2, 3, 4, 5] },
    ].forEach(({ expression, expected }) => {
      it(`should parse "${expression}" and return ${expected}`, () => {
        const parsedExpression = parse(expression);
        expect(parsedExpression.hour).be.eqls(expected);
      });
    });
  });


});
