import React, { PureComponent } from "react";
import { connect } from "react-redux";
import flowRight from "lodash/flowRight";
import { fetchAttributes as fetchInvoiceAttributes } from "src/invoices/actions";
import { getAttributes as getInvoiceAttributes, getIsFetchingAttributes as getIsFetchingInvoiceAttributes, getMethods as getInvoiceMethods } from "src/invoices/selectors";
import type { Attributes, Methods } from "src/types";

function SapInvoicesAttributes(WrappedComponent: any) {
  type Props = {
    fetchInvoiceAttributes: (...args: Array<any>) => any;
    invoiceAttributes: Attributes;
    invoiceMethods: Methods;
    isFetchingInvoiceAttributes: boolean;
  };
  return class SapInvoicesAttributes extends PureComponent<Props> {
    componentDidMount() {
      const {
        fetchInvoiceAttributes,
        invoiceAttributes,
        invoiceMethods,
        isFetchingInvoiceAttributes
      } = this.props;

      if (!isFetchingInvoiceAttributes && !invoiceMethods && !invoiceAttributes) {
        fetchInvoiceAttributes();
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }

  };
}

// @ts-expect-error
const withSapInvoicesAttributes = flowRight(connect(state => {
  return {
    invoiceAttributes: getInvoiceAttributes(state),
    invoiceMethods: getInvoiceMethods(state),
    isFetchingInvoiceAttributes: getIsFetchingInvoiceAttributes(state)
  };
}, {
  fetchInvoiceAttributes
}), SapInvoicesAttributes);
export { withSapInvoicesAttributes };