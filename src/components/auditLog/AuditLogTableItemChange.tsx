import React from "react";
import { connect } from "react-redux";
import ShowMore from "@/components/showMore/ShowMore";
import { getAuditLogContentLabel } from "@/auditLog/helpers";
import { getAttributes as getCommentAttributes } from "@/comments/selectors";
import { getAttributes as getContactAttributes } from "@/contacts/selectors";
import { getAttributes as getInfillDevelopmentCompensationAttributes } from "@/infillDevelopment/selectors";
import { getAttributes as getInvoiceAttributes } from "@/invoices/selectors";
import { getAttributes as getLeaseAttributes } from "@/leases/selectors";
import type { Attributes } from "types";
type Props = {
  change: {
    key: string;
    newValue: string | null | undefined;
    oldValue: string | null | undefined;
  };
  commentAttributes: Attributes;
  contactAttributes: Attributes;
  contentType: string;
  infillDevelopmentCompensationAttributes: Attributes;
  invoiceAttributes: Attributes;
  leaseAttributes: Attributes;
};

const AuditLogTableItemChange = ({
  change,
  commentAttributes,
  contactAttributes,
  contentType,
  infillDevelopmentCompensationAttributes,
  invoiceAttributes,
  leaseAttributes
}: Props) => {
  return <tr>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td>{getAuditLogContentLabel(leaseAttributes, commentAttributes, contactAttributes, invoiceAttributes, infillDevelopmentCompensationAttributes, contentType, change.key) || '-'}</td>
      <td><ShowMore className='no-margin inside-table' text={change.oldValue || '-'} /></td>
      <td><ShowMore className='no-margin inside-table' text={change.newValue || '-'} /></td>
    </tr>;
};

export default connect(state => {
  return {
    contactAttributes: getContactAttributes(state),
    commentAttributes: getCommentAttributes(state),
    infillDevelopmentCompensationAttributes: getInfillDevelopmentCompensationAttributes(state),
    invoiceAttributes: getInvoiceAttributes(state),
    leaseAttributes: getLeaseAttributes(state)
  };
})(AuditLogTableItemChange);