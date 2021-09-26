import { expect } from 'chai';
import { parse } from '../src/parser';

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

    const createMinute = (minute: string) => `${minute} * * * * echo Hello`;

    [
      createMinute(''),
      createMinute('a'),
      createMinute('a-a'),
      createMinute('60'),
      createMinute('000'),
    ].forEach(expression => {
      it(`should throw error when parsing "${expression}"`, () => {
        expect(() => parse(expression)).to.throw(Error);
      });
    });

    const fullMinuteEntries: number[] = Array.from({ length: 60 }).map((v, i) => i);

    [
      { expression: createMinute('*'), expected: fullMinuteEntries },
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
});
