// @flow
import React from 'react';
import {connect} from 'react-redux';

import ShowMore from '$components/showMore/ShowMore';
import {getAuditLogContentLabel} from '$src/auditLog/helpers';
import {getAttributes as getCommentAttributes} from '$src/comments/selectors';
import {getAttributes as getContactAttributes} from '$src/contacts/selectors';
import {getAttributes as getInfillDevelopmentCompensationAttributes} from '$src/infillDevelopment/selectors';
import {getAttributes as getInvoiceAttributes} from '$src/invoices/selectors';
import {getAttributes as getLeaseAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/types';

type Props = {
  change: {
    key: string,
    newValue: ?string,
    oldValue: ?string,
  },
  commentAttributes: Attributes,
  contactAttributes: Attributes,
  contentType: string,
  infillDevelopmentCompensationAttributes: Attributes,
  invoiceAttributes: Attributes,
  leaseAttributes: Attributes,
}

const AuditLogTableItemChange = ({
  change,
  commentAttributes,
  contactAttributes,
  contentType,
  infillDevelopmentCompensationAttributes,
  invoiceAttributes,
  leaseAttributes,
}: Props) => {
  return(
    <tr>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td>{getAuditLogContentLabel(
        leaseAttributes,
        commentAttributes,
        contactAttributes,
        invoiceAttributes,
        infillDevelopmentCompensationAttributes,
        contentType,
        change.key) || '-'}</td>
      <td><ShowMore className='no-margin inside-table' text={change.oldValue || '-'} /></td>
      <td><ShowMore className='no-margin inside-table' text={change.newValue || '-'} /></td>
    </tr>
  );
};

export default connect(
  (state) => {
    return {
      contactAttributes: getContactAttributes(state),
      commentAttributes: getCommentAttributes(state),
      infillDevelopmentCompensationAttributes: getInfillDevelopmentCompensationAttributes(state),
      invoiceAttributes: getInvoiceAttributes(state),
      leaseAttributes: getLeaseAttributes(state),
    };
  }
)(AuditLogTableItemChange);
