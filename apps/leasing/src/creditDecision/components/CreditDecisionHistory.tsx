import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "lodash-es";
import InfoIcon from "@/components/icons/InfoIcon";
import GreenBox from "@/components/content/GreenBox";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import StatusText from "@/creditDecision/components/StatusText";
import WhiteBox from "@/components/content/WhiteBox";
import { CreditDecisionText } from "@/creditDecision/enums";
import { formatDate } from "@/util/helpers";
import { getHoursAndMinutes } from "@/util/date";
import {
  fetchHistoryByBusinessId,
  fetchHistoryByContactId,
} from "@/creditDecision/actions";
import {
  getHistoryByBusinessId,
  getIsFetchingHistoryByBusinessId,
  getHistoryByContactId,
  getIsFetchingHistoryByContactId,
} from "@/creditDecision/selectors";

type Props = {
  businessId?: string;
  contactId?: string;
};

const CreditDecisionHistory: React.FC<Props> = ({ businessId, contactId }) => {
  const dispatch = useDispatch();

  const history = useSelector((state) => {
    if (contactId) {
      return getHistoryByContactId(state, contactId);
    }

    if (businessId) {
      return getHistoryByBusinessId(state, businessId);
    }

    return undefined;
  });

  const isFetchingHistory = useSelector((state) => {
    if (contactId) {
      return getIsFetchingHistoryByContactId(state, contactId);
    }

    if (businessId) {
      return getIsFetchingHistoryByBusinessId(state, businessId);
    }

    return false;
  });

  useEffect(() => {
    if (!contactId && !businessId) return;

    if (history === undefined) {
      if (contactId) {
        dispatch(fetchHistoryByContactId(contactId));
      } else if (businessId) {
        dispatch(fetchHistoryByBusinessId(businessId));
      }
    }
  }, [businessId, contactId, dispatch, history]);

  if (history === undefined && !isFetchingHistory) return null;

  return (
    <GreenBox className="with-top-margin">
      <h3>{CreditDecisionText.REQUEST_HISTORY_TITLE}</h3>
      {isFetchingHistory && (
        <WhiteBox>
          <LoaderWrapper>
            <Loader isLoading={isFetchingHistory} />
          </LoaderWrapper>
        </WhiteBox>
      )}
      {!isFetchingHistory && (
        <Fragment>
          {history.length === 0 && (
            <WhiteBox className="with-bottom-padding">
              <div className="icon-and-text">
                <InfoIcon className="icon-small icons__success" />{" "}
                {CreditDecisionText.NO_REQUEST_HISTORY}
              </div>
            </WhiteBox>
          )}
          {!isEmpty(history) && (
            <WhiteBox className="with-bottom-padding">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>{CreditDecisionText.CREDIT_DECISION}</th>
                    <th>{CreditDecisionText.REASONS}</th>
                    <th>{CreditDecisionText.CREDIT_DECISION_TIMESTAMP}</th>
                    <th className="text-right">
                      {CreditDecisionText.CLAIMANT}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <StatusText status={row.status} />
                      </td>
                      <td>
                        {row.reasons.length !== 0
                          ? row.reasons.map((reason, index) => (
                              <div key={index}>
                                {reason.reason} ({reason.reason_code})
                              </div>
                            ))
                          : "-"}
                      </td>
                      <td>
                        {formatDate(row.created_at)}{" "}
                        {getHoursAndMinutes(row.created_at)}
                      </td>
                      <td className="text-right">
                        {row.claimant.first_name} {row.claimant.last_name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </WhiteBox>
          )}
        </Fragment>
      )}
    </GreenBox>
  );
};

export default CreditDecisionHistory;
