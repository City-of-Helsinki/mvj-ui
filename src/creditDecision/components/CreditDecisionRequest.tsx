import React, { Fragment, PureComponent } from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import FormText from "/src/components/form/FormText";
import FormTextTitle from "/src/components/form/FormTextTitle";
import flowRight from "lodash/flowRight";
import isEmpty from "lodash/isEmpty";
import Button from "/src/components/button/Button";
import ErrorIcon from "/src/components/icons/ErrorIcon";
import GreenBox from "/src/components/content/GreenBox";
import Loader from "/src/components/loader/Loader";
import LoaderWrapper from "/src/components/loader/LoaderWrapper";
import StatusText from "/src/creditDecision/components/StatusText";
import WhiteBox from "/src/components/content/WhiteBox";
import { ContactTypes } from "/src/contacts/enums";
import { CreditDecisionText } from "/src/creditDecision/enums";
import { UsersPermissions } from "/src/usersPermissions/enums";
import { hasPermissions } from "util/helpers";
import { getIsFetching as getIsFetchingUsersPermissions, getUsersPermissions } from "/src/usersPermissions/selectors";
import { formatDate } from "util/helpers";
import { getHoursAndMinutes } from "util/date";
import { fetchCreditDecisionByBusinessId, fetchCreditDecisionByContactId, fetchCreditDecisionByNin } from "/src/creditDecision/actions";
import { getCreditDecisionByBusinessId, getCreditDecisionByContactId, getCreditDecisionByNin, getIsFetchingCreditDecisionByBusinessId, getIsFetchingCreditDecisionByContactId, getIsFetchingCreditDecisionByNin } from "/src/creditDecision/selectors";
type Props = {
  businessId: string;
  contactId: string;
  contactType: string;
  fetchCreditDecisionByBusinessId: (...args: Array<any>) => any;
  fetchCreditDecisionByContactId: (...args: Array<any>) => any;
  fetchCreditDecisionByNin: (...args: Array<any>) => any;
  isFetchingResult: boolean;
  isFetchingUsersPermissions: boolean;
  nin: string;
  result: Record<string, any> | null | undefined;
  usersPermissions: any;
};
type State = {
  hasRequested: boolean;
};

class CreditDecisionRequest extends PureComponent<Props, State> {
  state = {
    hasRequested: false
  };

  render() {
    const {
      businessId,
      contactId,
      contactType,
      fetchCreditDecisionByBusinessId,
      fetchCreditDecisionByContactId,
      fetchCreditDecisionByNin,
      isFetchingResult,
      isFetchingUsersPermissions,
      nin,
      result,
      usersPermissions
    } = this.props;
    const {
      hasRequested
    } = this.state;
    if (isFetchingUsersPermissions) return <Loader isLoading={true} />;
    if (isEmpty(usersPermissions)) return null;
    if (!hasPermissions(usersPermissions, UsersPermissions.SEND_CREDITDECISION_INQUIRY)) return null;

    const handleRequest = () => {
      this.setState({
        hasRequested: true
      });

      if (contactId) {
        fetchCreditDecisionByContactId(contactId);
      } else {
        if (contactType === ContactTypes.BUSINESS && businessId) {
          fetchCreditDecisionByBusinessId(businessId);
        }

        if (contactType === ContactTypes.PERSON && nin) {
          fetchCreditDecisionByNin(nin);
        }
      }
    };

    return <GreenBox>
        <h3>{CreditDecisionText.REQUEST_TITLE}</h3>
        <div style={{
        marginTop: 15,
        marginBottom: 15
      }}>
          <Button onClick={handleRequest} text="Hae luottopäätös" style={{
          marginLeft: 0,
          marginRight: 20
        }} disabled={isFetchingResult || hasRequested && !isEmpty(result)} />
          <small>
            {contactType === ContactTypes.BUSINESS && CreditDecisionText.REQUEST_COST_INFO_BUSINESS}
            {contactType === ContactTypes.PERSON && CreditDecisionText.REQUEST_COST_INFO_PERSON}
          </small>
        </div>

        {isFetchingResult && <WhiteBox className="with-bottom-margin">
            <LoaderWrapper>
              <Loader isLoading={isFetchingResult} />
            </LoaderWrapper>
          </WhiteBox>}

        {!isFetchingResult && <Fragment>
            {hasRequested && result === undefined && <WhiteBox className="with-bottom-margin with-bottom-padding">
                <div className="icon-and-text">
                  <ErrorIcon className="icon-small" /> {CreditDecisionText.REQUEST_FAILED}
                </div>
              </WhiteBox>}
            {hasRequested && !isEmpty(result) && <WhiteBox className="with-bottom-margin with-bottom-padding">
                <div className="credit-decision__result">
                  {CreditDecisionText.CREDIT_DECISION}: <StatusText status={result.status} />
                </div>
                {result.reasons.length !== 0 && <div className="credit-decision__reasons">
                    <Row>
                      <Column small={12}>
                        <FormTextTitle title={CreditDecisionText.REASONS} />
                        <FormText>
                          {result.reasons.map((reason, index) => <span key={index}>
                              {reason.reason} ({reason.reason_code}) <br />
                            </span>)}
                        </FormText>
                      </Column>
                    </Row>
                  </div>}
                {contactType !== ContactTypes.PERSON && <div className="credit-decision__business-data">
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
                        <FormTextTitle title={CreditDecisionText.BUSINESS_ENTITY} />
                        <FormText>{result.business_entity}</FormText>
                      </Column>
                      <Column small={6} medium={3}>
                        <FormTextTitle title={CreditDecisionText.OPERATION_START_DATE} />
                        <FormText>{result.operation_start_date}</FormText>
                      </Column>
                      <Column small={6} medium={3}>
                        <FormTextTitle title={CreditDecisionText.INDUSTRY_CODE} />
                        <FormText>{result.industry_code}</FormText>
                      </Column>
                    </Row>
                  </div>}
                <div className="credit-decision__meta">
                  <hr />
                  <Row>
                    <Column small={6} medium={3}>
                      <FormTextTitle title={CreditDecisionText.CLAIMANT} />
                      <FormText>{result.claimant.first_name} {result.claimant.last_name}</FormText>
                    </Column>
                    <Column small={6} medium={3}>
                      <FormTextTitle title={CreditDecisionText.CREDIT_DECISION_TIMESTAMP} />
                      <FormText>{formatDate(result.created_at)} {getHoursAndMinutes(result.created_at)}</FormText>
                    </Column>
                  </Row>
                </div>
              </WhiteBox>}
          </Fragment>}
      </GreenBox>;
  }

}

export default flowRight(connect((state, props: Props) => {
  return {
    isFetchingUsersPermissions: getIsFetchingUsersPermissions(state),
    usersPermissions: getUsersPermissions(state),
    result: props.contactId ? getCreditDecisionByContactId(state, props.contactId) : props.contactType === ContactTypes.BUSINESS && props.businessId ? getCreditDecisionByBusinessId(state, props.businessId) : props.contactType === ContactTypes.PERSON && props.nin && getCreditDecisionByNin(state, props.nin),
    isFetchingResult: props.contactId ? getIsFetchingCreditDecisionByContactId(state, props.contactId) : props.contactType === ContactTypes.BUSINESS && props.businessId ? getIsFetchingCreditDecisionByBusinessId(state, props.businessId) : props.contactType === ContactTypes.PERSON && props.nin && getIsFetchingCreditDecisionByNin(state, props.nin)
  };
}, {
  fetchCreditDecisionByContactId,
  fetchCreditDecisionByBusinessId,
  fetchCreditDecisionByNin
}))(CreditDecisionRequest);