import React, { PureComponent } from "react";
import { connect } from "react-redux";
import flowRight from "lodash/flowRight";
import { fetchAttributes as fetchInvoiceNoteAttributes } from "invoiceNote/actions";
import { getAttributes as getInvoiceNoteAttributes, getIsFetchingAttributes as getIsFetchingInvoiceNoteAttributes, getMethods as getInvoiceNoteMethods } from "invoiceNote/selectors";
import type { Attributes, Methods } from "types";

function InvoiceNoteAttributes(WrappedComponent: any) {
  type Props = {
    fetchInvoiceNoteAttributes: (...args: Array<any>) => any;
    invoiceNoteAttributes: Attributes;
    invoiceNoteMethods: Methods;
    isFetchingInvoiceNoteAttributes: boolean;
  };
  return class InvoiceNoteAttributes extends PureComponent<Props> {
    componentDidMount() {
      const {
        fetchInvoiceNoteAttributes,
        invoiceNoteAttributes,
        invoiceNoteMethods,
        isFetchingInvoiceNoteAttributes
      } = this.props;

      if (!isFetchingInvoiceNoteAttributes && !invoiceNoteMethods && !invoiceNoteAttributes) {
        fetchInvoiceNoteAttributes();
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }

  };
}

const withInvoiceNoteAttributes = flowRight(connect(state => {
  return {
    invoiceNoteAttributes: getInvoiceNoteAttributes(state),
    invoiceNoteMethods: getInvoiceNoteMethods(state),
    isFetchingInvoiceNoteAttributes: getIsFetchingInvoiceNoteAttributes(state)
  };
}, {
  fetchInvoiceNoteAttributes
}), InvoiceNoteAttributes);
export { withInvoiceNoteAttributes };