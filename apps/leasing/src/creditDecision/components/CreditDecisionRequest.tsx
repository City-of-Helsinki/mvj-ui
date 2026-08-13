import React, { Fragment, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Column } from "@/components/grid/Grid";
import FormText from "@/components/form/FormText";
import FormTextTitle from "@/components/form/FormTextTitle";
import { isEmpty } from "lodash-es";
import Button from "@/components/button/Button";
import ErrorIcon from "@/components/icons/ErrorIcon";
import GreenBox from "@/components/content/GreenBox";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import StatusText from "@/creditDecision/components/StatusText";
import WhiteBox from "@/components/content/WhiteBox";
import { ContactTypes } from "@/contacts/enums";
import { CreditDecisionText } from "@/creditDecision/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { hasPermissions } from "@/util/helpers";
import {
  getIsFetching as getIsFetchingUsersPermissions,
  getUsersPermissions,
} from "@/usersPermissions/selectors";
import { formatDate } from "@/util/helpers";
import { getHoursAndMinutes } from "@/util/date";
import {
  fetchCreditDecisionByBusinessId,
  fetchCreditDecisionByContactId,
  fetchCreditDecisionByNin,
} from "@/creditDecision/actions";
import {
  getCreditDecisionByBusinessId,
  getCreditDecisionByContactId,
  getCreditDecisionByNin,
  getIsFetchingCreditDecisionByBusinessId,
  getIsFetchingCreditDecisionByContactId,
  getIsFetchingCreditDecisionByNin,
} from "@/creditDecision/selectors";

type Props = {
  businessId?: string;
  contactId?: string;
  contactType: string;
  nin?: string;
};

const CreditDecisionRequest: React.FC<Props> = ({
  businessId,
  contactId,
  contactType,
  nin,
}) => {
  const dispatch = useDispatch();
  const [hasRequested, setHasRequested] = useState(false);

  const isFetchingUsersPermissions = useSelector(getIsFetchingUsersPermissions);
  const usersPermissions = useSelector(getUsersPermissions);

  const result = useSelector((state) => {
    if (contactId) {
      return getCreditDecisionByContactId(state, contactId);
    }

    if (contactType === ContactTypes.BUSINESS && businessId) {
      return getCreditDecisionByBusinessId(state, businessId);
    }

    if (contactType === ContactTypes.PERSON && nin) {
      return getCreditDecisionByNin(state, nin);
    }

    return undefined;
  });

  const isFetchingResult = useSelector((state) => {
    if (contactId) {
      return getIsFetchingCreditDecisionByContactId(state, contactId);
    }

    if (contactType === ContactTypes.BUSINESS && businessId) {
      return getIsFetchingCreditDecisionByBusinessId(state, businessId);
    }

    if (contactType === ContactTypes.PERSON && nin) {
      return getIsFetchingCreditDecisionByNin(state, nin);
    }

    return false;
  });

  const handleRequest = useCallback(() => {
    setHasRequested(true);

    if (contactId) {
      dispatch(fetchCreditDecisionByContactId(contactId));
      return;
    }

    if (contactType === ContactTypes.BUSINESS && businessId) {
      dispatch(fetchCreditDecisionByBusinessId(businessId));
      return;
    }

    if (contactType === ContactTypes.PERSON && nin) {
      dispatch(fetchCreditDecisionByNin(nin));
    }
  }, [businessId, contactId, contactType, dispatch, nin]);

  if (isFetchingUsersPermissions) return <Loader isLoading={true} />;
  if (isEmpty(usersPermissions)) return null;
  if (
    !hasPermissions(
      usersPermissions,
      UsersPermissions.SEND_CREDITDECISION_INQUIRY,
    )
  )
    return null;

  return (
    <GreenBox>
      <h3>{CreditDecisionText.REQUEST_TITLE}</h3>
      <div
        style={{
          marginTop: 15,
          marginBottom: 15,
        }}
      >
        <Button
          onClick={handleRequest}
          text="Hae luottopäätös"
          style={{
            marginLeft: 0,
            marginRight: 20,
          }}
          disabled={isFetchingResult || (hasRequested && !isEmpty(result))}
        />
        <small>
          {contactType === ContactTypes.BUSINESS &&
            CreditDecisionText.REQUEST_COST_INFO_BUSINESS}
          {contactType === ContactTypes.PERSON &&
            CreditDecisionText.REQUEST_COST_INFO_PERSON}
        </small>
      </div>

      {isFetchingResult && (
        <WhiteBox className="with-bottom-margin">
          <LoaderWrapper>
            <Loader isLoading={isFetchingResult} />
          </LoaderWrapper>
        </WhiteBox>
      )}

      {!isFetchingResult && (
        <Fragment>
          {hasRequested && result === undefined && (
            <WhiteBox className="with-bottom-margin with-bottom-padding">
              <div className="icon-and-text">
                <ErrorIcon className="icon-small" />{" "}
                {CreditDecisionText.REQUEST_FAILED}
              </div>
            </WhiteBox>
          )}
          {hasRequested && !isEmpty(result) && (
            <WhiteBox className="with-bottom-margin with-bottom-padding">
              <div className="credit-decision__result">
                {CreditDecisionText.CREDIT_DECISION}:{" "}
                <StatusText status={result.status} />
              </div>
              {result.reasons.length !== 0 && (
                <div className="credit-decision__reasons">
                  <Row>
                    <Column small={12}>
                      <FormTextTitle title={CreditDecisionText.REASONS} />
                      <FormText>
                        {result.reasons.map((reason, index) => (
                          <span key={index}>
                            {reason.reason} ({reason.reason_code}) <br />
                          </span>
                        ))}
                      </FormText>
                    </Column>
                  </Row>
                </div>
              )}
              {contactType !== ContactTypes.PERSON && (
                <div className="credit-decision__business-data">
                  <hr />
                  <Row>
                    <Column small={6} medium={3}>
                      <FormTextTitle title={CreditDecisionText.BUSINESS_ID} />
                      <FormText>{result.business_id}</FormText>
                    </Column>
                    <Column small={6} medium={3}>
                      <FormTextTitle title={CreditDecisionText.OFFICIAL_NAME} />
                      <FormText>{result.official_name}</FormText>
                    </Column>
                    <Column small={6} medium={3}>
                      <FormTextTitle title={CreditDecisionText.ADDRESS} />
                      <FormText>{result.address}</FormText>
                    </Column>
                    <Column small={6} medium={3}>
                      <FormTextTitle title={CreditDecisionText.PHONE_NUMBER} />
                      <FormText>{result.phone_number}</FormText>
                    </Column>
                  </Row>
                  <Row>
                    <Column small={6} medium={3}>
                      <FormTextTitle
                        title={CreditDecisionText.BUSINESS_ENTITY}
                      />
                      <FormText>{result.business_entity}</FormText>
                    </Column>
                    <Column small={6} medium={3}>
                      <FormTextTitle
                        title={CreditDecisionText.OPERATION_START_DATE}
                      />
                      <FormText>{result.operation_start_date}</FormText>
                    </Column>
                    <Column small={6} medium={3}>
                      <FormTextTitle title={CreditDecisionText.INDUSTRY_CODE} />
                      <FormText>{result.industry_code}</FormText>
                    </Column>
                  </Row>
                </div>
              )}
              <div className="credit-decision__meta">
                <hr />
                <Row>
                  <Column small={6} medium={3}>
                    <FormTextTitle title={CreditDecisionText.CLAIMANT} />
                    <FormText>
                      {result.claimant.first_name} {result.claimant.last_name}
                    </FormText>
                  </Column>
                  <Column small={6} medium={3}>
                    <FormTextTitle
                      title={CreditDecisionText.CREDIT_DECISION_TIMESTAMP}
                    />
                    <FormText>
                      {formatDate(result.created_at)}{" "}
                      {getHoursAndMinutes(result.created_at)}
                    </FormText>
                  </Column>
                </Row>
              </div>
            </WhiteBox>
          )}
        </Fragment>
      )}
    </GreenBox>
  );
};

export default CreditDecisionRequest;
