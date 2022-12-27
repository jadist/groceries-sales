import * as constants from "../../../../text/constants/transaction-no-initial";

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

      const YY = `00${now.getFullYear()}`.slice(-2);
      const XXXXXXXX = `000000${count}`.slice(-6);
      const quotationNo = `${constants.TransactionNoInitialEnum.Quotation}/${YY}${MM}/${XXXXXXXX}`;

      data.QuotationNo = quotationNo;

      console.log("entries", entries);
      console.log("count", count);
    }
  },
};
