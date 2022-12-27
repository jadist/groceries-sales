export default {
  StandardFormat(initial: string, year: number, month: number, count: number) {
    const YY = `00${year}`.slice(-2);
    const MM = `00${month}`.slice(-2);
    const XXXXXX = `000000${count + 1}`.slice(-6);
    const result = `${initial}/${YY}${MM}/${XXXXXX}`;

    return result;
  },
};
