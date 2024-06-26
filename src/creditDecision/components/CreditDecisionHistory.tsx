import React, { Fragment, PureComponent } from "react";
import { connect } from "react-redux";
import flowRight from "lodash/flowRight";
import isEmpty from "lodash/isEmpty";
import InfoIcon from "/src/components/icons/InfoIcon";
import GreenBox from "/src/components/content/GreenBox";
import Loader from "/src/components/loader/Loader";
import LoaderWrapper from "/src/components/loader/LoaderWrapper";
import StatusText from "creditDecision/components/StatusText";
import WhiteBox from "/src/components/content/WhiteBox";
import { CreditDecisionText } from "creditDecision/enums";
import { formatDate } from "util/helpers";
import { getHoursAndMinutes } from "util/date";
import { fetchHistoryByBusinessId, fetchHistoryByContactId } from "creditDecision/actions";
import { getHistoryByBusinessId, getIsFetchingHistoryByBusinessId, getHistoryByContactId, getIsFetchingHistoryByContactId } from "creditDecision/selectors";
type Props = {
  businessId?: string;
  contactId?: string;
  history: Record<string, any> | null | undefined;
  isFetchingHistory: boolean;
  fetchHistoryByBusinessId: (...args: Array<any>) => any;
  fetchHistoryByContactId: (...args: Array<any>) => any;
};

class CreditDecisionHistory extends PureComponent<Props> {
  componentDidMount() {
    this.fetchHistoryDataIfNeeded();
  }

  componentDidUpdate(prevProps: Props) {
    const {
      businessId,
      contactId
    } = this.props;

    if (contactId && contactId !== prevProps.contactId) {
      this.fetchHistoryDataIfNeeded();
    }

    if (businessId && businessId !== prevProps.businessId) {
      this.fetchHistoryDataIfNeeded();
    }
  }

  fetchHistoryDataIfNeeded = () => {
    const {
      businessId,
      contactId,
      history,
      fetchHistoryByContactId,
      fetchHistoryByBusinessId
    } = this.props;
    if (!contactId && !businessId) return;

    if (history === undefined) {
      if (contactId) {
        fetchHistoryByContactId(contactId);
      } else {
        fetchHistoryByBusinessId(businessId);
      }
    }
  };

  render() {
    const {
      history,
      isFetchingHistory
    } = this.props;
    if (history === undefined && !isFetchingHistory) return null;
    return <GreenBox className="with-top-margin">
        <h3>{CreditDecisionText.REQUEST_HISTORY_TITLE}</h3>
        {isFetchingHistory && <WhiteBox>
            <LoaderWrapper>
              <Loader isLoading={isFetchingHistory} />
            </LoaderWrapper>
          </WhiteBox>}
        {!isFetchingHistory && <Fragment>
            {history.length === 0 && <WhiteBox className="with-bottom-padding">
                <div className="icon-and-text">
                  <InfoIcon className="icon-small icons__success" /> {CreditDecisionText.NO_REQUEST_HISTORY}
                </div>
              </WhiteBox>}
            {!isEmpty(history) && <WhiteBox className="with-bottom-padding">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>{CreditDecisionText.CREDIT_DECISION}</th>
                      <th>{CreditDecisionText.REASONS}</th>
                      <th>{CreditDecisionText.CREDIT_DECISION_TIMESTAMP}</th>
                      <th className="text-right">{CreditDecisionText.CLAIMANT}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map(row => <tr key={row.id}>
                        <td><StatusText status={row.status} /></td>
                        <td>
                          {row.reasons.length !== 0 ? row.reasons.map((reason, index) => <div key={index}>
                              {reason.reason} ({reason.reason_code})
                            </div>) : '-'}
                        </td>
                        <td>{formatDate(row.created_at)} {getHoursAndMinutes(row.created_at)}</td>
                        <td className="text-right">{row.claimant.first_name} {row.claimant.last_name}</td>
                      </tr>)}
                  </tbody>
                </table>
              </WhiteBox>}
          </Fragment>}
      </GreenBox>;
  }

}

;
export default flowRight(connect((state, props: Props) => {
  return {
    history: props.contactId ? getHistoryByContactId(state, props.contactId) : getHistoryByBusinessId(state, props.businessId),
    isFetchingHistory: props.contactId ? getIsFetchingHistoryByContactId(state, props.contactId) : getIsFetchingHistoryByBusinessId(state, props.businessId)
  };
}, {
  fetchHistoryByContactId,
  fetchHistoryByBusinessId
}))(CreditDecisionHistory);