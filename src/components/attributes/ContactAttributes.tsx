import React, { PureComponent } from "react";
import { connect } from "react-redux";
import flowRight from "lodash/flowRight";
import { fetchAttributes as fetchContactAttributes } from "src/contacts/actions";
import { getAttributes as getContactAttributes, getIsFetchingAttributes as getIsFetchingContactAttributes, getMethods as getContactMethods } from "src/contacts/selectors";
import type { Attributes, Methods } from "src/types";

function ContactAttributes(WrappedComponent: any) {
  type Props = {
    contactAttributes: Attributes;
    contactMethods: Methods;
    fetchContactAttributes: (...args: Array<any>) => any;
    isFetchingContactAttributes: boolean;
  };
  return class ContactAttributes extends PureComponent<Props> {
    componentDidMount() {
      const {
        contactAttributes,
        contactMethods,
        fetchContactAttributes,
        isFetchingContactAttributes
      } = this.props;

      if (!isFetchingContactAttributes && !contactMethods && !contactAttributes) {
        fetchContactAttributes();
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }

  };
}

// @ts-expect-error
const withContactAttributes = flowRight(connect(state => {
  return {
    contactAttributes: getContactAttributes(state),
    contactMethods: getContactMethods(state),
    isFetchingContactAttributes: getIsFetchingContactAttributes(state)
  };
}, {
  fetchContactAttributes
}), ContactAttributes);
export { withContactAttributes };