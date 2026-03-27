import React from "react";
import { connect } from "react-redux";
import ShowMore from "@/components/showMore/ShowMore";
import { getAuditLogContentLabel } from "@/auditLog/helpers";
import { getAttributes as getAreaSearchAttributes } from "@/areaSearch/selectors";
import { getAttributes as getCommentAttributes } from "@/comments/selectors";
import { getAttributes as getContactAttributes } from "@/contacts/selectors";
import { getAttributes as getInfillDevelopmentCompensationAttributes } from "@/infillDevelopment/selectors";
import { getAttributes as getInvoiceAttributes } from "@/invoices/selectors";
import { getAttributes as getLeaseAttributes } from "@/leases/selectors";
import { getAttributes as getPlotSearchAttributes } from "@/plotSearch/selectors";
import type { Attributes } from "types";
type Props = {
  change: {
    key: string;
    newValue: string | null | undefined;
    oldValue: string | null | undefined;
  };
  areaSearchAttributes: Attributes;
  commentAttributes: Attributes;
  contactAttributes: Attributes;
  contentType: string;
  infillDevelopmentCompensationAttributes: Attributes;
  invoiceAttributes: Attributes;
  leaseAttributes: Attributes;
  plotSearchAttributes: Attributes;
};

const AuditLogTableItemChange = ({
  change,
  areaSearchAttributes,
  commentAttributes,
  contactAttributes,
  contentType,
  infillDevelopmentCompensationAttributes,
  invoiceAttributes,
  leaseAttributes,
  plotSearchAttributes,
}: Props) => {
  return (
    <tr>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td>
        {getAuditLogContentLabel(
          areaSearchAttributes,
          leaseAttributes,
          commentAttributes,
          contactAttributes,
          invoiceAttributes,
          infillDevelopmentCompensationAttributes,
          plotSearchAttributes,
          contentType,
          change.key,
        ) || "-"}
      </td>
      <td>
        <ShowMore
          className="no-margin inside-table"
          text={change.oldValue || "-"}
        />
      </td>
      <td>
        <ShowMore
          className="no-margin inside-table"
          text={change.newValue || "-"}
        />
      </td>
    </tr>
  );
};

export default connect((state) => {
  return {
    areaSearchAttributes: getAreaSearchAttributes(state),
    contactAttributes: getContactAttributes(state),
    commentAttributes: getCommentAttributes(state),
    infillDevelopmentCompensationAttributes:
      getInfillDevelopmentCompensationAttributes(state),
    invoiceAttributes: getInvoiceAttributes(state),
    leaseAttributes: getLeaseAttributes(state),
    plotSearchAttributes: getPlotSearchAttributes(state),
  };
})(AuditLogTableItemChange);
