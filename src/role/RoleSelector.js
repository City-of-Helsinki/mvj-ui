import React, {Component} from 'react';
import {connect} from 'react-redux';
import {translate} from 'react-i18next';
import flowRight from 'lodash/flowRight';

import {changeUser} from './actions';
import {Users} from '../constants';

type Props = {
  t: Function,
  changeUser: Function
};

class RoleSelector extends Component {
  props: Props;

  handleRoleClick = (role) => {
    const {changeUser} = this.props;
    changeUser(role);
  };

  render() {
    const {t} = this.props;

    return (
      <div className="section__container role-selector">
        <h1>{t('title')}</h1>
        <h2>{t('subtitle')}</h2>

        <ul className="role-selector__list">
          {Users.map((role) =>
            <li key={role.id} onClick={() => this.handleRoleClick(role)}>{role.label}</li>
          )}
        </ul>
      </div>
    );
  }
}

export default flowRight(
  connect(null, {changeUser}),
  translate(['common', 'roles']),
)(RoleSelector);

