import { Prisma } from '@prisma/client';

export const yellow = (str: string | number) => `\x1b[33m${str}\x1b[0m`;
export const purple = (str: string | number) => `\x1b[35m${str}\x1b[0m`;
export const skyblue = (str: string | number) => `\x1b[36m${str}\x1b[0m`;
export const blue = (str: string | number) => `\x1b[34m${str}\x1b[0m`;
export const red = (str: string | number) => `\x1b[31m${str}\x1b[0m`;
export const green = (str: string | number) => `\x1b[32m${str}\x1b[0m`;

export const setQueryLog = (e: Prisma.QueryEvent) => {
  const params = e.params.replaceAll('[', '').replaceAll(']', '').split(',');
  let query = e.query
    .toString()
    .replace(
      /(SELECT|UPDATE|DELETE|FROM|JOIN ON|WHERE|GROUP BY|HAVING|ORDER BY|LIMIT|OFFSET)\b/g,
      `\n${purple('$1')}`,
    )
    .replace(/(DESC|ASC)\b/g, '\x1b[35m$1\x1b[0m')
    .replace(/,/g, '\n')
    .replaceAll('`', '')
    .replaceAll(`${process.env.DATABASE_NAME}.`, ''); // 데이터베이스 정보 생략
  params.forEach((param) => (query = query.replace('?', skyblue(param))));

  console.log(skyblue(' ➤ SYSTEM CALL '));
  console.log(`${yellow('Query')}: ${query}`);
  console.log(`${yellow('Params')}: ${e.params}`);
  console.log(`${yellow('Duration')}: ${e.duration}ms`);
  console.log(skyblue(' ➤ DONE! '));
};
