export default {
  StandardFormat(initial: string, count: number) {
    const now = new Date();

    const YY = `00${now.getFullYear()}`.slice(-2);
    const MM = `00${now.getMonth() + 1}`.slice(-2);
    const XXXXXX = `000000${count + 1}`.slice(-6);
    const result = `${initial}/${YY}${MM}/${XXXXXX}`;

    return result;
  },
};
