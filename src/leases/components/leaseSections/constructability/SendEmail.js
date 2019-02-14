// @flow
import React, {Fragment, PureComponent} from 'react';
import {Row, Column} from 'react-foundation';
import {connect} from 'react-redux';

import Authorization from '$components/authorization/Authorization';
import Button from '$components/button/Button';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import ListItem from '$components/content/ListItem';
import SendEmailModal from './SendEmailModal';
import {sendEmail} from '$src/leases/actions';
import {ButtonColors} from '$components/enums';
import {SendEmailTypes} from '$src/leases/enums';
import {UsersPermissions} from '$src/usersPermissions/enums';
import {getContentEmailLogs} from '$src/leases/helpers';
import {getUserFullName} from '$src/users/helpers';
import {formatDate, hasPermissions} from '$util/helpers';
import {getCurrentLease} from '$src/leases/selectors';
import {getUsersPermissions} from '$src/usersPermissions/selectors';

import type {Lease} from '$src/leases/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';

type Props = {
  currentLease: Lease,
  sendEmail: Function,
  usersPermissions: UsersPermissionsType,
}

type State = {
  currentLease: Lease,
  emailLogs: Array<Object>,
  isOpen: boolean,
}

class SendEmail extends PureComponent<Props, State> {
  state = {
    currentLease: {},
    emailLogs: [],
    isOpen: false,
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if(props.currentLease !== state.currentLease) {
      newState.currentLease = props.currentLease;
      newState.emailLogs = getContentEmailLogs(props.currentLease);
    }

    return newState;
  }

  handleShowModal = () => {
    this.setState({
      isOpen: true,
    });
  }

  handleHideModal = () => {
    this.setState({
      isOpen: false,
    });
  }

  handleSend = (values: Object) => {
    const {currentLease, sendEmail} = this.props;
    const payload = {
      ...values,
      type: SendEmailTypes.CONSTRUCTABILITY,
      lease: currentLease.id,
    };

    sendEmail(payload);
    this.setState({isOpen: false});
  }

  getRecipientString = (recipients: Array<Object>) =>
    recipients.map((recipient) => getUserFullName(recipient)).join(', ');

  render() {
    const {usersPermissions} = this.props;
    const {emailLogs, isOpen} = this.state;

    return (
      <Fragment>
        <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.VIEW_LEASE)}>
          <SendEmailModal
            isOpen={isOpen}
            onCancel={this.handleHideModal}
            onClose={this.handleHideModal}
            onSend={this.handleSend}
          />
        </Authorization>

        <Row>
          <Column small={12} medium={4} large={3}>
            <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.VIEW_LEASE)}>
              <Button
                className={`${ButtonColors.NEUTRAL} no-margin`}
                onClick={this.handleShowModal}
                style={{marginBottom: 15}}
                text='Lähetä sähköposti'
              />
            </Authorization>
          </Column>
          <Column small={12} medium={8} large={9}>
            <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.VIEW_LEASE_LEASE_AREAS) ||
              hasPermissions(usersPermissions, UsersPermissions.CHANGE_LEASE_LEASE_AREAS)}>
              {!emailLogs.length && <FormText>Ei lähetettyjä sähköposteja</FormText>}
              {!!emailLogs.length &&
                <div className='constructability__send-email_sent-emails'>
                  <Row>
                    <Column small={4} medium={3} large={2}>
                      <FormTextTitle title='Lähetetty' />
                    </Column>
                    <Column small={4} medium={3} large={2}>
                      <FormTextTitle title='Lähettäjä' />
                    </Column>
                    <Column small={4} medium={6} large={8}>
                      <FormTextTitle title='Vastaanottajat' />
                    </Column>
                  </Row>
                  {emailLogs.map((email, index) => {
                    return (
                      <Row key={index}>
                        <Column small={4} medium={3} large={2}>
                          <ListItem>{formatDate(email.created_at, 'DD.MM.YYYY HH:mm') || '-'}</ListItem>
                        </Column>
                        <Column small={4} medium={3} large={2}>
                          <ListItem>{getUserFullName(email.user) || '-'}</ListItem>
                        </Column>
                        <Column small={4} medium={6} large={8}>
                          <ListItem>{this.getRecipientString(email.recipients) || '-'}</ListItem>
                        </Column>
                      </Row>
                    );
                  })}
                </div>
              }
            </Authorization>
          </Column>
        </Row>
      </Fragment>
    );
  }
}

export default connect(
  (state) => {
    return {
      currentLease: getCurrentLease(state),
      usersPermissions: getUsersPermissions(state),
    };
  },
  {
    sendEmail,
  }
)(SendEmail);
