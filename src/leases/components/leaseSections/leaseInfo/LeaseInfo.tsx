import React from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import Authorization from "@/components/authorization/Authorization";
import FormTextTitle from "@/components/form/FormTextTitle";
import { LeaseFieldPaths, LeaseFieldTitles } from "@/leases/enums";
import { getContentLeaseInfo } from "@/leases/helpers";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import {
  formatDate,
  getFieldOptions,
  getLabelOfOption,
  isFieldAllowedToRead,
} from "@/util/helpers";
import { getAttributes, getCurrentLease } from "@/leases/selectors";
import type { Attributes } from "types";
import type { Lease } from "@/leases/types";
type Props = {
  attributes: Attributes;
  currentLease: Lease;
};

const LeaseInfo = ({ attributes, currentLease }: Props) => {
  const leaseInfo = getContentLeaseInfo(currentLease);
  const stateOptions = getFieldOptions(attributes, LeaseFieldPaths.STATE);
  if (!LeaseInfo) return null;
  return (
    <div className="lease-info">
      <Row>
        <Column large={2}>
          <Authorization
            allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.IDENTIFIER)}
          >
            <>
              <FormTextTitle>{LeaseFieldTitles.IDENTIFIER}</FormTextTitle>
              <h1 className="lease-info__identifier">
                {leaseInfo.identifier || "-"}
              </h1>
            </>
          </Authorization>
        </Column>
        <Column>
          <Authorization
            allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.STATE)}
          >
            <>
              <FormTextTitle
                uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.STATE)}
              >
                {LeaseFieldTitles.STATE}
              </FormTextTitle>
              <p className="lease-info__text">
                {getLabelOfOption(stateOptions, leaseInfo.state) || "-"}
              </p>
            </>
          </Authorization>
        </Column>
        <Column>
          <Authorization
            allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.START_DATE)}
          >
            <>
              <FormTextTitle
                uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.START_DATE)}
              >
                {LeaseFieldTitles.START_DATE}
              </FormTextTitle>
              <p className="lease-info__text">
                {formatDate(leaseInfo.start_date) || "-"}
              </p>
            </>
          </Authorization>
        </Column>
        <Column>
          <Authorization
            allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.END_DATE)}
          >
            <>
              <FormTextTitle
                uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.END_DATE)}
              >
                {LeaseFieldTitles.END_DATE}
              </FormTextTitle>
              <p className="lease-info__text">
                {formatDate(leaseInfo.end_date) || "-"}
              </p>
            </>
          </Authorization>
        </Column>
        <Column>
          <Authorization
            allow={
              isFieldAllowedToRead(attributes, LeaseFieldPaths.START_DATE) &&
              isFieldAllowedToRead(attributes, LeaseFieldPaths.END_DATE)
            }
          >
            <>
              <FormTextTitle>{LeaseFieldTitles.STATUS}</FormTextTitle>
              <p className="lease-info__text">{leaseInfo.status || "-"}</p>
            </>
          </Authorization>
        </Column>
        <Column large={2} className="hide_narrow">
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseFieldPaths.AREA_IDENTIFIER,
            )}
          >
            <>
              <FormTextTitle>{LeaseFieldTitles.AREA_IDENTIFIER}</FormTextTitle>
              <p className="lease-info__text">
                {leaseInfo.area_identifier || "-"}
              </p>
            </>
          </Authorization>
        </Column>
        <Column large={3} className="hide_narrow">
          <Authorization
            allow={isFieldAllowedToRead(attributes, LeaseFieldPaths.ADDRESS)}
          >
            <>
              <FormTextTitle>{LeaseFieldTitles.ADDRESS}</FormTextTitle>
              <p className="lease-info__text">{leaseInfo.address || "-"}</p>
            </>
          </Authorization>
        </Column>
      </Row>
    </div>
  );
};

export default connect((state) => {
  return {
    attributes: getAttributes(state),
    currentLease: getCurrentLease(state),
  };
})(LeaseInfo);
