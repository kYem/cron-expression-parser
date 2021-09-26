import { ParsedExpression } from './ParsedExpression';

interface Options {
  fieldPrefix: 14,
  minute?: string,
  hour?: string,
  dayOfMonth?: string,
  month?: string,
  dayOfWeek?: string,
  command?: string,
}

const getDefaultOptions = () => {
  return {
    fieldPrefix: 14,
    minute: 'minute',
    hour: 'hour',
    dayOfMonth: 'day of month',
    month: 'month',
    dayOfWeek: 'day of week',
    command: 'command',
  };
};

/*
minute        0 15 30 45
hour          0
day of month  1 15
month         1 2 3 4 5 6 7 8 9 10 11 12
day of week   1 2 3 4 5
command       /usr/bin/find
*/
export const toStringArray = (
  parsedExpression: ParsedExpression,
  options?: Options,
): string[] => {

  const mergedOptions = { ...getDefaultOptions(), options };

  const order: (keyof ParsedExpression)[] = [
    'minute',
    'hour',
    'dayOfMonth',
    'month',
    'dayOfWeek',
    'command'
  ];


  return order.map(key => {
    const label = key in mergedOptions ? mergedOptions[key] : key;

    const value = parsedExpression[key];
    const fieldValueToString = Array.isArray(value) ? value.join(' '): value;
    return `${label.padEnd(mergedOptions.fieldPrefix)}${fieldValueToString}`;
  })
}
