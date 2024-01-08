// @flow
import React, {Fragment} from 'react';
import {Column, Row} from 'react-foundation';
import FormTextTitle from '$components/form/FormTextTitle';
import FormText from '$components/form/FormText';
import {PlotSearchFieldTitles} from '$src/plotSearch/enums';

type Props = {
  reservationRecipients: Array<Object>
};

const PlotSearchReservationRecipients = ({reservationRecipients}: Props): React$Node => {
  return (
    <Row>
      <Column small={9} medium={9} large={8}>
        <FormTextTitle>
          {PlotSearchFieldTitles.RESERVATION_RECIPIENT}
        </FormTextTitle>
      </Column>
      <Column small={3} medium={3} large={4}>
        <FormTextTitle>
          {PlotSearchFieldTitles.RESERVATION_RECIPIENT_SHARE_OF_RENTAL}
        </FormTextTitle>
      </Column>
      {reservationRecipients.length === 0 && <Column small={12}>
        <FormText>
          Ei ehdotettuja varauksensaajia.
        </FormText>
      </Column>}
      {reservationRecipients.map((applicant) => <Fragment key={applicant.id}>
        <Column small={9} medium={9} large={8}>
          <FormText>
            {applicant.reservation_recipients.join(', ')}
          </FormText>
        </Column>
        <Column small={3} medium={3} large={4}>
          <FormText>
            {applicant.share_of_rental}
          </FormText>
        </Column>
      </Fragment>)}
    </Row>
  );
};

export default PlotSearchReservationRecipients;
