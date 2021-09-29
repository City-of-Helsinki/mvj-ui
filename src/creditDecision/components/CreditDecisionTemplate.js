// @flow
import React, {Fragment} from 'react';

import CreditDecisionRequest from '$src/creditDecision/components/CreditDecisionRequest';
import CreditDecisionHistory from '$src/creditDecision/components/CreditDecisionHistory';
import {ContactTypes} from '$src/contacts/enums';

type Props = {
  businessId?: String,
  contactId?: String,
  contactType: String,
  nin?: String,
}

const CreditDecisionTemplate = ({ businessId, contactId, contactType, nin }: Props) => (
  <Fragment>
    <CreditDecisionRequest contactType={contactType} contactId={contactId} businessId={businessId} nin={nin} />

    {contactType !== ContactTypes.PERSON && (
      <CreditDecisionHistory contactId={contactId} businessId={businessId} />
    )}
  </Fragment>
);

export default CreditDecisionTemplate;
