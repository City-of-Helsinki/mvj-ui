// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import isEmpty from 'lodash/isEmpty';

import Button from '$components/button/Button';
import DualListBoxInput from '$components/inputs/DualListBoxInput';
import FormText from '$components/form/FormText';
import Modal from '$components/modal/Modal';
import TextAreaInput from '$components/inputs/TextAreaInput';
import {fetchUsers} from '$src/users/actions';
import {ButtonColors} from '$components/enums';
import {getUserOptions} from '$src/users/helpers';
import {getUsers} from '$src/users/selectors';

import type {UserList} from '$src/users/types';

type Props = {
  fetchUsers: Function,
  isOpen: boolean,
  onCancel: Function,
  onClose: Function,
  onSend: Function,
  users: UserList,
}

type State = {
  note: string,
  selectedUsers: Array<string>,
  userOptions: Array<Object>,
  users: UserList,
}

class SendEmailModal extends Component<Props, State> {
  dualListBox: any

  state = {
    note: '',
    selectedUsers: [],
    userOptions: [],
    users: [],
  };

  static getDerivedStateFromProps(props, state) {
    const retObj = {};

    if(props.users !== state.users) {
      retObj.userOptions = getUserOptions(props.users);
      retObj.users = props.users;
    }

    if(!isEmpty(retObj)) {
      return retObj;
    }

    return null;
  }

  componentDidMount() {
    const {fetchUsers} = this.props;
    fetchUsers();
  }

  componentDidUpdate(prevProps) {
    // Clear selected list when opening modal
    if(!prevProps.isOpen && this.props.isOpen) {
      if(this.dualListBox) {
        this.dualListBox.focus();
      }
      this.setState({
        note: '',
        selectedUsers: [],
      });
    }
  }

  handleSetAvailableReference = (element: any) => {
    this.dualListBox = element;
  }

  handleChangeUserList = (selected: Array<string>) => {
    this.setState({selectedUsers: selected});
  }

  handleChangeNote = (e: any) => {
    this.setState({
      note: e.target.value,
    });
  }

  render() {
    const {
      isOpen,
      onCancel,
      onClose,
      onSend,
    } = this.props;
    const {note, selectedUsers, userOptions} = this.state;

    return (
      <Modal
        className='modal-autoheight modal-center'
        title='Lähetä sähköposti'
        isOpen={isOpen}
        onClose={onClose}
      >
        <FormText>Valitse sähköpostin vastaanottajat</FormText>
        <DualListBoxInput
          filterPlaceholder='Hae vastaanottajia...'
          onChange={this.handleChangeUserList}
          options={userOptions}
          selected={selectedUsers}
          setAvailabelReference={this.handleSetAvailableReference}
        />

        <FormText><label htmlFor='send-email_comment'> Sähköpostiin liittyvä kommentti</label></FormText>
        <TextAreaInput
          className="no-margin"
          id='send-email_comment'
          onChange={this.handleChangeNote}
          placeholder=''
          rows={4}
          value={note}
        />
        <div className='constructability__send-email-modal_footer'>
          <Button
            className={ButtonColors.SECONDARY}
            onClick={onCancel}
            text='Peruuta'
          />
          <Button
            className={ButtonColors.SUCCESS}
            disabled={!selectedUsers.length}
            onClick={onSend}
            text='Lähetä'
          />
        </div>
      </Modal>
    );
  }
}


export default connect(
  (state) => {
    return {
      users: getUsers(state),
    };
  },
  {
    fetchUsers,
  }
)(SendEmailModal);
