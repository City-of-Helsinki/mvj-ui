// @flow
import React, {Component} from 'react';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import Button from '$components/button/Button';
import FormFieldLabel from '$components/form/FormFieldLabel';
import SendEmailModal from './SendEmailModal';
import {formatDateObj} from '$util/helpers';
import mockData from './mock-data.json';

const getContentCostructabilityEmails = (content: Object) => {
  const emails = get(content, 'emails', []);

  return emails.map((email) => {
    const recipients = get(email, 'recipients', []);

    return {
      time: email.time,
      sender: email.sender,
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

const getSenderString = (sender: Object) => {
  return `${sender.last_name} ${sender.first_name}`;
};

type State = {
  isOpen: boolean,
}

class SendEmail extends Component<{}, State> {
  state = {
    isOpen: false,
  }

  handleOnSend = (recipients: Array<string>) => {
    console.log(recipients);
    this.setState({isOpen: false});
  }

  render() {
    const {isOpen} = this.state;
    const emails = getContentCostructabilityEmails(mockData);

    return (
      <div>
        <SendEmailModal
          isOpen={isOpen}
          onCancel={() => this.setState({isOpen: false})}
          onClose={() => this.setState({isOpen: false})}
          onSend={(recipients) => this.handleOnSend(recipients)}
        />

        <Row>
          <Column small={12} medium={4} large={3}>
            <Button
              className='button-green no-margin'
              label='Lähetä sähköposti'
              onClick={() => this.setState({isOpen: true})}
              style={{marginBottom: 15}}
              title='Lähetä sähköposti'
            />
          </Column>
          <Column small={12} medium={8} large={9}>
            {!emails || !emails.length && <p>Ei lähetettyjä sähköpostitiedotteita</p>}
            {emails && !!emails.length &&
              <div className='constructability__send-email_sent-emails'>
                <Row>
                  <Column small={4} medium={3} large={2}>
                    <FormFieldLabel>Lähetetty</FormFieldLabel>
                  </Column>
                  <Column small={4} medium={3} large={2}>
                    <FormFieldLabel>Lähettäjä</FormFieldLabel>
                  </Column>
                  <Column small={4} medium={6} large={8}>
                    <FormFieldLabel>Vastaanottajat</FormFieldLabel>
                  </Column>
                </Row>
                {emails.map((email, index) => {
                  return (
                    <Row key={index}>
                      <Column small={4} medium={3} large={2}>
                        <p className='no-margin'>{formatDateObj(email.time) || '-'}</p>
                      </Column>
                      <Column small={4} medium={3} large={2}>
                        <p className='no-margin'>{getSenderString(email.sender) || '-'}</p>
                      </Column>
                      <Column small={4} medium={6} large={8}>
                        <p className='no-margin'>{getRecipientsString(email.recipients) || '-'}</p>
                      </Column>
                    </Row>
                  );
                })}
              </div>
            }
          </Column>
        </Row>
      </div>
    );
  }
}

export default SendEmail;
