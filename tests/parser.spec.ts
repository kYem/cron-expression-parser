import { expect } from 'chai';
import { generateFullEntries, parse, validationMap } from '../src/parser';

describe('parser', function () {

  describe('handle invalid expressions', function () {

    [
      '',
      '* *',
      'a * * * *',
      'a-a * * * *',
      '*/0 * * * *',
      '000 * * * *', // Not valid atm
      '1-0 * * * *',
      '*,1-0 * * * *',
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

  describe('dayOfMonth', function () {

    const createDayOfMonth = (field: string) => `* * ${field} * * echo Hello`;
    describe('expected not valid', function () {
      [
        createDayOfMonth(''),
        createDayOfMonth('a'),
        createDayOfMonth('a-a'),
        createDayOfMonth('0'),
        createDayOfMonth('000'),
        createDayOfMonth('*/32'),
        createDayOfMonth('1-0'),
        createDayOfMonth('1-32'),
        createDayOfMonth('*,1-0'),
      ].forEach(expression => {
        it(`should throw error when parsing "${expression}"`, () => {
          expect(() => parse(expression)).to.throw(Error);
        });
      });
    });

    const expectedOf5 = [0, 5, 10, 15, 20, 25, 30];
    [
      { expression: createDayOfMonth('*'), expected: generateFullEntries(validationMap.dayOfMonth) },
      { expression: createDayOfMonth('1'), expected: [1] },
      { expression: createDayOfMonth('*/15'), expected: [0, 15, 30] },
      { expression: createDayOfMonth('*/5'), expected: expectedOf5 },
      { expression: createDayOfMonth('*/15,*/5'), expected: expectedOf5 },
      { expression: createDayOfMonth('2-5'), expected: [2, 3, 4, 5] },
    ].forEach(({ expression, expected }) => {
      it(`should parse "${expression}" and return ${expected}`, () => {
        const parsedExpression = parse(expression);
        expect(parsedExpression.dayOfMonth).be.eqls(expected);
      });
    });
  });

  describe('month', function () {

    const createMonth = (field: string) => `* * * ${field} * echo Hello`;
    describe('expected not valid', function () {
      [
        createMonth('0'),
        createMonth('13'),
        createMonth('*/13'),
        createMonth('*/0'),
        createMonth('1-99'),
      ].forEach(expression => {
        it(`should throw error when parsing "${expression}"`, () => {
          expect(() => parse(expression)).to.throw(Error);
        });
      });
    });

    const expectedOf5 = [0, 5, 10];
    [
      { expression: createMonth('*'), expected: generateFullEntries(validationMap.month) },
      { expression: createMonth('1'), expected: [1] },
      { expression: createMonth('*/10'), expected: [0, 10] },
      { expression: createMonth('*/5'), expected: expectedOf5 },
      { expression: createMonth('*/6'), expected: [0, 6, 12] },
      { expression: createMonth('*/10,*/5'), expected: expectedOf5 },
      { expression: createMonth('4-5'), expected: [4, 5] },
      { expression: createMonth('5-5'), expected: [5] },
    ].forEach(({ expression, expected }) => {
      it(`should parse "${expression}" and return ${expected}`, () => {
        const parsedExpression = parse(expression);
        expect(parsedExpression.month).be.eqls(expected);
      });
    });
  });



});
