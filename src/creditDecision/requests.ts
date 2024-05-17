import callApi from "src/api/callApi";
import createUrl from "../api/createUrl";
export const fetchHistoryBusinessId = (id: string): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`get_credit_decisions?business_id=${id}`)));
};
export const fetchHistoryContactId = (id: string): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`get_credit_decisions?customer_id=${id}`)));
};
export const fetchCreditDecisionBusinessId = (id: string): Generator<any, any, any> => {
  const body = JSON.stringify({
    "business_id": id
  });
  return callApi(new Request(createUrl(`send_credit_decision_inquiry/`), {
    method: 'POST',
    body
  }));
};
export const fetchCreditDecisionContactId = (id: string): Generator<any, any, any> => {
  const body = JSON.stringify({
    "customer_id": id
  });
  return callApi(new Request(createUrl(`send_credit_decision_inquiry/`), {
    method: 'POST',
    body
  }));
};
export const fetchCreditDecisionNin = (id: string): Generator<any, any, any> => {
  const body = JSON.stringify({
    "identity_number": id
  });
  return callApi(new Request(createUrl(`send_credit_decision_inquiry/`), {
    method: 'POST',
    body
  }));
};