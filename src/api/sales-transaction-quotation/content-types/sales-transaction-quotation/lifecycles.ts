import * as constants from "../../../../text/constants/transaction-no-initial";
import * as noFormatter from "../../../../helper/transaction-no-formatter";

export default {
  async beforeCreate(event) {
    const { data, where, select, populate } = event.params;

    if (data.QuotationNo.length === 0) {
      const now = new Date();
      const year = `${now.getFullYear()}`;
      const MM = `00${now.getMonth() + 1}`.slice(-2);
      const thisMonth = `${year}-${MM}-01`;

      const [entries, count] = await strapi.db
        .query("api::sales-transaction-quotation.sales-transaction-quotation")
        .findWithCount({
          select: ["QuotationNo", "createdAt"],
          where: { createdAt: { $gte: thisMonth } },
        });

      const uniqueNo = noFormatter.default.StandardFormat(
        constants.TransactionNoInitialEnum.Quotation,
        now.getFullYear(),
        now.getMonth() + 1,
        count
      );

          select: ["QuotationNo", "createdAt"],

        data.QuotationNo = `${uniqueNo}/${duplicateCount + 1}`;
    }
  },
};
