// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import Button from '$components/button/Button';
import FormFieldLabel from '$components/form/FormFieldLabel';
import {formatDateObj} from '$util/helpers';
import mockData from './mock-data.json';

type Props = {
  onSend: Function,
}

const getContentCostructabilityEmails = (content: Object) => {
  const emails = get(content, 'emails', []);

  return emails.map((email) => {
    const recipients = get(email, 'recipients', []);

    return {
      time: email.time,
      recipients: recipients.map((recipient) => {
        return {
          first_name: recipient.first_name,
          last_name: recipient. last_name,
        };
      }),
    };
  });
};

const getRecipientsString = (recipients: Array<Object>) => {
  let text = '';
  const length = recipients.length;
  recipients.forEach((recipient, index) => {
    text += `${recipient.last_name} ${recipient.first_name}`;
    text += (index !== (length - 1)) ? ', ' : '';
  });
  return text;
};

const SendEmail = ({onSend}: Props) => {
  const emails = getContentCostructabilityEmails(mockData);
  return (
    <Row>
      <Column small={12} medium={4} large={3}>
        <Button
          className='button-green no-margin'
          label='Lähetä sähköpostitiedote'
          onClick={onSend}
          style={{marginBottom: 15}}
          title='Lähetä sähköpostitiedote'
        />
      </Column>
      <Column small={12} medium={8} large={9}>
        {emails && !!emails.length &&
          <div className='constructability__sent-emails'>
            <Row>
              <Column small={4} medium={3} large={2}>
                <FormFieldLabel>Lähetetty</FormFieldLabel>
              </Column>
              <Column small={8} medium={9} large={10}>
                <FormFieldLabel>Vastaanottajat</FormFieldLabel>
              </Column>
            </Row>
            {emails.map((email, index) => {
              return (
                <Row key={index}>
                  <Column small={4} medium={3} large={2}>
                    <p className='no-margin'>{formatDateObj(email.time) || '-'}</p>
                  </Column>
                  <Column small={8} medium={9} large={10}>
                    <p className='no-margin'>{getRecipientsString(email.recipients) || '-'}</p>
                  </Column>
                </Row>
              );
            })}
          </div>
        }
      </Column>
    </Row>
  );
};

export default SendEmail;
