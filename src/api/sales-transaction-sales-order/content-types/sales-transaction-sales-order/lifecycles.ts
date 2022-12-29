import * as constants from "../../../../text/constants/transaction-no-initial";
import * as noFormatter from "../../../../helper/transaction-no-formatter";

export default {
  async beforeCreate(event) {
    const { data, where, select, populate } = event.params;

    if (!data.SalesOrderNo) {
      const now = new Date();
      const year = `${now.getFullYear()}`;
      const MM = `00${now.getMonth() + 1}`.slice(-2);
      const thisMonth = `${year}-${MM}-01`;

      const [entries, count] = await strapi.db
        .query("api::sales-transaction-sales-order.sales-transaction-sales-order")
        .findWithCount({
          select: ["SalesOrderNo", "createdAt"],
          where: { createdAt: { $gte: thisMonth } },
        });

      const uniqueNo = noFormatter.default.StandardFormat(
        constants.TransactionNoInitialEnum.SalesOrder,
        count
      );

      /**
       * Here, we cannot get the thrown error of Duplicate Entries
       * Therefore, try to query again if the record is exist,
       * Before trying assign new value
       */
      const [duplicateEntries, duplicateCount] = await strapi.db
        .query("api::sales-transaction-sales-order.sales-transaction-sales-order")
        .findWithCount({
          select: ["SalesOrderNo", "createdAt"],
          where: { SalesOrderNo: { $contains: uniqueNo } },
        });

      if (duplicateCount === 0) {
        data.SalesOrderNo = uniqueNo;
      } else {
        data.SalesOrderNo = `${uniqueNo}/${duplicateCount + 1}`;
      }
    }
  },
};
