import React from "react";
import CreditDecisionRequest from "@/creditDecision/components/CreditDecisionRequest";
import CreditDecisionHistory from "@/creditDecision/components/CreditDecisionHistory";
import { ContactTypes } from "@/contacts/enums";
type Props = {
  businessId?: string;
  contactId?: string;
  contactType: string;
  nin?: string;
};

const CreditDecisionTemplate: React.FC<Props> = ({
  businessId,
  contactId,
  contactType,
  nin,
}) => (
  <>
    <CreditDecisionRequest
      contactType={contactType}
      contactId={contactId}
      businessId={businessId}
      nin={nin}
    />

    {contactType !== ContactTypes.PERSON && (
      <CreditDecisionHistory contactId={contactId} businessId={businessId} />
    )}
  </>
);

export default CreditDecisionTemplate;
