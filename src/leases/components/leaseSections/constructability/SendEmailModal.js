// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import isEmpty from 'lodash/isEmpty';

import Button from '$components/button/Button';
import DualListBoxInput from '$components/inputs/DualListBoxInput';
import Modal from '$components/modal/Modal';
import {fetchUsers} from '$src/users/actions';
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
  selected: Array<string>,
  userOptions: Array<Object>,
  users: UserList,
}

class SendEmailModal extends Component<Props, State> {
  state = {
    selected: [],
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
      this.setState({selected: []});
    }
  }

  onChange = (selected: Array<string>) => {
    this.setState({selected: selected});
  }

  render() {
    const {
      isOpen,
      onCancel,
      onClose,
      onSend,
    } = this.props;
    const {selected, userOptions} = this.state;

    return (
      <Modal
        className='modal-autoheight modal-center'
        title='Lähetä sähköpostitiedote'
        isOpen={isOpen}
        onClose={onClose}
      >
        <p>Valitse sähköpostitiedotteen vastaanottajat</p>
        <DualListBoxInput options={userOptions} selected={selected} onChange={this.onChange} />
        <div className='constructability__send-email-modal_footer'>
          <Button
            className='button-red'
            label='Peruuta'
            onClick={onCancel}
            title='Peruuta'
          />
          <Button
            className='button-green'
            disabled={!selected.length}
            label='Lähetä'
            onClick={onSend}
            title='Lähetä sähköpostitiedote'
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
