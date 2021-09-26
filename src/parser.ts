

class ParsedExpression {

  minute: number[] = [];
  hour: number[] = [];
  dayOfMonth: number[] = [];
  month: number[] = [];
  dayOfWeek: number[] = [];
  command = '';
}


const validationMap = {
  minute: { min: 0, max: 59, }
}



// 0–59	* , -
const parseMinute = (minute: string): number[] => {

  const { min, max } = validationMap.minute;
  if (minute === '*') {
    return Array.from({ length: max + 1 }).map((v, i) => i);
  }

  const minuteParts = minute.split(',');

  const timeSet = new Set<number>();
  // 0, | 2, | *, | */5, | 1,2
  // 1-4,22-50,*/5
  minuteParts.forEach(expression => {

    if (expression.startsWith('*/')) {
      const stepValue = parseInt(expression.replace('*/', ''))
      if (min <= stepValue && stepValue <= max) {
        let currentStep = 0;
        while (currentStep <= max) {
          timeSet.add(currentStep);
          currentStep += stepValue;
        }
      }
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
