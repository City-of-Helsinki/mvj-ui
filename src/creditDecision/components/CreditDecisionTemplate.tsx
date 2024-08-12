import React, { Fragment } from "react";
import CreditDecisionRequest from "@/creditDecision/components/CreditDecisionRequest";
import CreditDecisionHistory from "@/creditDecision/components/CreditDecisionHistory";
import { ContactTypes } from "@/contacts/enums";
type Props = {
  businessId?: string;
  contactId?: string;
  contactType: string;
  nin?: string;
};

const CreditDecisionTemplate = ({
  businessId,
  contactId,
  contactType,
  nin
}: Props): React.ReactNode => <Fragment>
    <CreditDecisionRequest contactType={contactType} contactId={contactId} businessId={businessId} nin={nin} />

    {contactType !== ContactTypes.PERSON && <CreditDecisionHistory contactId={contactId} businessId={businessId} />}
  </Fragment>;

export default CreditDecisionTemplate;