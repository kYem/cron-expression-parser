class ParsedExpression {

  minute: number[] = [];
  hour: number[] = [];
  dayOfMonth: number[] = [];
  month: number[] = [];
  dayOfWeek: number[] = [];
  command = '';
}


type Validation = { min: number, max: number };
const validationMap = {
  minute: { min: 0, max: 59 },
}


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
// 0–59	* , -
const parseMinute = (minute: string): number[] => {

  const validation = validationMap.minute;
  if (minute === '*') {
    return Array.from({ length: validation.max + 1 }).map((v, i) => i);
  }

  const minuteParts = minute.split(',');
  const timeSet = new Set<number>();

  minuteParts.forEach(expression => {

    if (expression.startsWith('*/')) {
      const stepValue = isValidNumericValue(expression.replace('*/', ''), validation);
      if (validation.min <= stepValue && stepValue <= validation.max) {
        let currentStep = 0;
        while (currentStep <= validation.max) {
          timeSet.add(currentStep);
          currentStep += stepValue;
        }
      }
      return;
    }

    if (expression.includes('-')) {
      const rangeParts = expression.split('-');
      if (rangeParts.length !== 2) {
        throw new Error(`Range is not valid, received expression ${expression}`)
      }

      const validStart = isValidNumericValue(rangeParts[0], validation);
      const validEnd = isValidNumericValue(rangeParts[1], validation);
      for (let i = validStart; i <= validEnd; i++) {
        timeSet.add(i);
      }
      return;
    }

    // Is parseInt is enough to validate?
    if (expression.length === 1 || expression.length === 2) {
      const value = isValidNumericValue(expression, validation);
      timeSet.add(value);
      return;
    }

    throw new Error(`"${expression}" expression is not supported`);
  });

  return Array.from(timeSet);
}


// "*/15 0 1,15 * 1-5 /usr/bin/find"
export const parse = (expression: string): ParsedExpression => {

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
  parsedExpression.minute = parseMinute(minute);


  return parsedExpression;
}
