import * as constants from "../../../../text/constants/transaction-no-initial";
import * as noFormatter from "../../../../helper/transaction-no-formatter";

export default {
  async beforeCreate(event) {
    const { data, where, select, populate } = event.params;

    if (!data.SaleNo) {
      const now = new Date();
      const year = `${now.getFullYear()}`;
      const MM = `00${now.getMonth() + 1}`.slice(-2);
      const thisMonth = `${year}-${MM}-01`;

      const [entries, count] = await strapi.db
        .query("api::sales-transaction-sale.sales-transaction-sale")
        .findWithCount({
          select: ["SaleNo", "createdAt"],
          where: { createdAt: { $gte: thisMonth } },
        });

      const uniqueNo = noFormatter.default.StandardFormat(
        constants.TransactionNoInitialEnum.Sales,
        count
      );

      /**
       * Here, we cannot get the thrown error of Duplicate Entries
       * Therefore, try to query again if the record is exist,
       * Before trying assign new value
       */
      const [duplicateEntries, duplicateCount] = await strapi.db
        .query("api::sales-transaction-sale.sales-transaction-sale")
        .findWithCount({
          select: ["SaleNo", "createdAt"],
          where: { SaleNo: { $contains: uniqueNo } },
        });

      if (duplicateCount === 0) {
        data.SaleNo = uniqueNo;
      } else {
        data.SaleNo = `${uniqueNo}/${duplicateCount + 1}`;
      }
    }
  },
};
