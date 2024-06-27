import React, { PureComponent } from "react";
import { connect } from "react-redux";
import flowRight from "lodash/flowRight";
import { fetchAttributes as fetchLandUseContractAttributes } from "/src/landUseContract/actions";
import { getAttributes as getLandUseContractAttributes, getIsFetchingAttributes as getIsFetchingLandUseContractAttributes, getMethods as getLandUseContractMethods } from "/src/landUseContract/selectors";
import type { Attributes, Methods } from "types";
import { fetchAttributes as fetchLandUseAgreementAttachmentAttributes } from "/src/landUseAgreementAttachment/actions";
import { getAttributes as getLandUseAgreementAttachmentAttributes, getIsFetchingAttributes as getIsFetchingLandUseAgreementAttachmentAttributes, getMethods as getLandUseAgreementAttachmentMethods } from "/src/landUseAgreementAttachment/selectors";

function LandUseContractAttributes(WrappedComponent: any) {
  type Props = {
    fetchLandUseContractAttributes: (...args: Array<any>) => any;
    isFetchingLandUseContractAttributes: boolean;
    landUseContractAttributes: Attributes;
    fetchLandUseAgreementAttachmentAttributes: (...args: Array<any>) => any;
    landUseAgreementAttachmentAttributes: Attributes;
    landUseAgreementAttachmentMethods: Methods;
    isFetchingLandUseAgreementAttachmentAttributes: boolean;
  };
  return class LandUseContractAttributes extends PureComponent<Props> {
    componentDidMount() {
      const {
        fetchLandUseContractAttributes,
        isFetchingLandUseContractAttributes,
        landUseContractAttributes,
        landUseAgreementAttachmentAttributes,
        landUseAgreementAttachmentMethods,
        isFetchingLandUseAgreementAttachmentAttributes,
        fetchLandUseAgreementAttachmentAttributes
      } = this.props;

      if (!isFetchingLandUseContractAttributes && !landUseContractAttributes) {
        fetchLandUseContractAttributes();
      }

      if (!isFetchingLandUseAgreementAttachmentAttributes && !landUseAgreementAttachmentAttributes && !landUseAgreementAttachmentMethods) {
        fetchLandUseAgreementAttachmentAttributes();
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }

  };
}

const withLandUseContractAttributes = flowRight(connect(state => {
  return {
    landUseContractAttributes: getLandUseContractAttributes(state),
    isFetchingLandUseContractAttributes: getIsFetchingLandUseContractAttributes(state),
    landUseContractMethods: getLandUseContractMethods(state),
    isFetchingLandUseAgreementAttachmentAttributes: getIsFetchingLandUseAgreementAttachmentAttributes(state),
    landUseAgreementAttachmentAttributes: getLandUseAgreementAttachmentAttributes(state),
    landUseAgreementAttachmentMethods: getLandUseAgreementAttachmentMethods(state)
  };
}, {
  fetchLandUseContractAttributes,
  fetchLandUseAgreementAttachmentAttributes
}), LandUseContractAttributes);
export { withLandUseContractAttributes };