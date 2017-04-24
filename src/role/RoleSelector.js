import React, {Component} from 'react';
import {withRouter, Link} from 'react-router';
import {connect} from 'react-redux';
import {translate} from 'react-i18next';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import {changeUser} from './actions';
import {Users} from '../constants';
import {getUser} from './selectors';

type Props = {
  changeUser: Function,
  currentUser: Object,
  params: Object,
  t: Function,
};

class RoleSelector extends Component {
  props: Props;

  handleRoleClick = (role) => {
    const {changeUser} = this.props;
    changeUser(role);
  };

  render() {
    const {currentUser, t, params: {language}} = this.props;

    return (
      <div className="section__container role-selector">
        <h1>{t('title')}</h1>
        <h2>{t('subtitle')}</h2>

        <ul className="role-selector__list">
          {Users.map((role) =>
            <li key={role.id} onClick={() => this.handleRoleClick(role)}>{role.label}</li>
          )}
        </ul>

        {!isEmpty(currentUser) &&
        <Link className="button primary"
              to={`${language}/applications`}>
          {t('goToApplications')} <i className="mi mi-keyboard-arrow-down"/>
        </Link>
        }
      </div>
    );
  }
}

export default flowRight(
  connect((state) => {
    return {
      currentUser: getUser(state),
    };
  }, {changeUser}),
  translate(['common', 'roles']),
  withRouter,
)(RoleSelector);

