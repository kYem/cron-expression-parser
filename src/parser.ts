class ParsedExpression {

  minute: number[] = [];
  hour: number[] = [];
  dayOfMonth: number[] = [];
  month: number[] = [];
  dayOfWeek: number[] = [];
  command = '';
}


type Validation = { min: number, max: number };
export const validationMap = {
  minute: { min: 0, max: 59 },
  hour: { min: 0, max: 23 },
  dayOfMonth: { min: 1, max: 31 },
  month: { min: 1, max: 12 }, //  JAN–DEC support
  dayOfWeek: { min: 0, max: 6 }, // SUN–SAT
} as const;


const isValidNumericValue = function (expression: string, { min, max }: Validation) {
  const value = parseInt(expression)
  if (isNaN(value)) {
    throw new Error(`Expected value ${expression} to be numeric value`)
  }

  if (value < min) {
    throw new Error(`Value must be higher than ${min}, received ${value}`)
  }

  if (value > max) {
    throw new Error(`Value must be lower than ${max}, received ${value}`)
  }

  return value;
};

export const generateFullEntries = (validation: Validation): number[] => {
  const fullEntries: number[] = [];
  for (let value = validation.min; value <= validation.max; value++) {
    fullEntries.push(value);
  }
  return fullEntries;
};

/**
 * parseField of specific cron expression field with validation
 * @param field
 * @param validation
 */
const parseField = (field: string, validation: Validation): number[] => {

  if (field === '*') {
    return generateFullEntries(validation);
  }

  // No spaces in between ranges are support
  const listParts = field.split(',');
  const timeSet = new Set<number>();

  listParts.forEach(listExpression => {

    if (listExpression.startsWith('*/')) {
      const stepValue = isValidNumericValue(listExpression.replace('*/', ''), validation);
      if (validation.min <= stepValue && stepValue <= validation.max) {
        let currentStep = 0;
        while (currentStep <= validation.max) {
          timeSet.add(currentStep);
          currentStep += stepValue;
        }
      }
      return;
    }

    if (listExpression.includes('-')) {
      const rangeParts = listExpression.split('-');
      if (rangeParts.length !== 2) {
        throw new Error(`Range is not valid, received expression ${listExpression}`)
      }

      const validStart = isValidNumericValue(rangeParts[0], validation);
      const validEnd = isValidNumericValue(rangeParts[1], validation);
      for (let i = validStart; i <= validEnd; i++) {
        timeSet.add(i);
      }
      return;
    }

    // Is parseInt is enough to validate?
    if (listExpression.length === 1 || listExpression.length === 2) {
      const value = isValidNumericValue(listExpression, validation);
      timeSet.add(value);
      return;
    }

    throw new Error(`"${listExpression}" expression is not supported`);
  });

  return Array.from(timeSet).sort((a, b) => a - b);
}


// "*/15 0 1,15 * 1-5 /usr/bin/find"
export const parse = (expression: string): ParsedExpression => {

  // @TODO How to deal with empty multiple empty spaces within the expression
  // .filter(Boolean) ?
  const parts = expression.split(' ');
  if (parts.length < 5) {
    throw new Error(`Expression not valid`);
  }

  if (parts.length == 5) {
    throw new Error(`Missing command argument, that cron should run`);
  }

  const parsedExpression = new ParsedExpression();

  const [minute, hour, dayOfMonth, month, dayOfWeek, ...command] = parts;


  // Validate that the input for expression part is valid
  // Convert expression into array representation
  // return the data and update ParsedExpression
  parsedExpression.minute = parseField(minute, validationMap.minute);
  parsedExpression.hour = parseField(hour, validationMap.hour);
  parsedExpression.dayOfMonth = parseField(dayOfMonth, validationMap.dayOfMonth);
  parsedExpression.month = parseField(month, validationMap.month);
  parsedExpression.dayOfWeek = parseField(dayOfWeek, validationMap.dayOfWeek);

  parsedExpression.command = command.join(' ');

  return parsedExpression;
}
