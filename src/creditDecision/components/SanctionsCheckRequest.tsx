import React, { useState } from "react";
import { connect } from "react-redux";
import flowRight from "lodash/flowRight";
import isEmpty from "lodash/isEmpty";
import { IconAlertCircle, LoadingSpinner, StatusLabel } from "hds-react";

import { SanctionsCheckText, SanctionsCheckType } from "@/creditDecision/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { hasPermissions } from "@/util/helpers";
import {
  getIsFetching as getIsFetchingUsersPermissions,
  getUsersPermissions,
} from "@/usersPermissions/selectors";
import createUrl from "@/api/createUrl";
import FileDownloadButtonHDS from "@/components/file/FileDownloadButtonHDS";

type Props = {
  sanctionsType: SanctionsCheckType;
  businessId: string;
  firstName: string;
  lastName: string;
  fetchSanctionsCheckByBusinessId: (...args: Array<any>) => any;
  fetchSanctionsCheckByName: (...args: Array<any>) => any;
  isFetchingUsersPermissions: boolean;
  result: Record<string, any> | null | undefined;
  usersPermissions: any;
  formErrors: Record<string, any>;
};

const SanctionsCheckRequest: React.FC<Props> = ({
  sanctionsType,
  businessId,
  firstName,
  lastName,
  isFetchingUsersPermissions,
  usersPermissions,
  formErrors,
}) => {
  if (isFetchingUsersPermissions) return <LoadingSpinner />;
  if (isEmpty(usersPermissions)) return null;
  if (
    !hasPermissions(usersPermissions, UsersPermissions.SEND_SANCTIONS_INQUIRY)
  )
    return null;

  const hasErrors = Object.keys(formErrors).length > 0;

  const isFormEmpty = () => {
    if (sanctionsType === SanctionsCheckType.COMPANY) {
      return !businessId;
    }
    if (sanctionsType === SanctionsCheckType.PERSON) {
      return !lastName;
    }
    return true;
  };

  const getWarningText = () => {
    if (sanctionsType === SanctionsCheckType.COMPANY) {
      return SanctionsCheckText.REQUEST_COST_INFO_BUSINESS;
    } else if (sanctionsType === SanctionsCheckType.PERSON) {
      return SanctionsCheckText.REQUEST_COST_INFO_PERSON;
    }
    return "";
  };

  const getWarningLabel = () => {
    return (
      <StatusLabel type="alert" iconLeft={<IconAlertCircle />}>
        {getWarningText()}
      </StatusLabel>
    );
  };

  const getFileUrl = (sanctionsType: Props["sanctionsType"]) => {
    const url = new URL(createUrl(`send_sanctions_inquiry/`));
    if (sanctionsType === SanctionsCheckType.COMPANY) {
      url.searchParams.append("business_id", businessId);
    }
    if (sanctionsType === SanctionsCheckType.PERSON) {
      firstName && url.searchParams.append("first_name", firstName);
      url.searchParams.append("last_name", lastName);
    }
    return url.toString();
  };

  return (
    <div
      style={{
        marginTop: 15,
        marginBottom: 15,
      }}
    >
      <div style={{ marginBottom: "var(--spacing-s)" }}>
        {getWarningLabel()}
      </div>
      <FileDownloadButtonHDS
        url={getFileUrl(sanctionsType)}
        label="Lataa tulos-PDF"
        loadingText="Haetaan pakotelistalta"
        disabled={hasErrors || isFormEmpty()}
      />
    </div>
  );
};

export default flowRight(
  connect((state) => {
    return {
      isFetchingUsersPermissions: getIsFetchingUsersPermissions(state),
      usersPermissions: getUsersPermissions(state),
    };
  }),
)(SanctionsCheckRequest);
