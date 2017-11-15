import React, {Component} from 'react';
import {withRouter, Link} from 'react-router';
import {connect} from 'react-redux';
import {translate} from 'react-i18next';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';
import classNames from 'classnames';

import {changeUser} from './actions';
import {getIsFetching, getUser, getUserList} from './selectors';

type Props = {
  changeUser: Function,
  currentUser: Object,
  isFetching: boolean,
  params: Object,
  t: Function,
  userList: Array<any>,
};

class RoleSelector extends Component {
  props: Props;

  handleUserClick = (user) => {
    const {changeUser} = this.props;
    changeUser(user);
  };

  getRoleLink = () => {
    const {t, currentUser: {username}, params: {language}} = this.props;
    const link = username === 'applicant' ? `/alpha/${language}/applications/create` : `/alpha/${language}/applications`;
    const linkText = username === 'applicant' ? t('createApplication') : t('goToApplications');

    return (
      <div>
        <Link className="button primary role__action-button"
          to={link}>
          {linkText} <i className="mi mi-chevron-right"/>
        </Link>
        {username !== 'applicant' &&
        <Link className="button primary role__action-button"
          to={`/alpha/${language}/leases`}>
          {t('goToLeases')} <i className="mi mi-chevron-right"/>
        </Link>
        }
      </div>
    );
  };

  render() {
    const {currentUser, userList, isFetching, t} = this.props;

    return (
      <div className="section__container role-selector">
        <h1>{t('title')}</h1>
        <h2>{t('subtitle')}</h2>

        {!isFetching &&
        <ul className="role-selector__list">
          {userList.map((user, i) =>
            <li key={i}
              className={classNames({'active': currentUser && currentUser.id === user.id})}
              onClick={() => this.handleUserClick(user)}>
              {user.label}
            </li>
          )}
        </ul>
        }

        {!isEmpty(currentUser) && this.getRoleLink()}
      </div>
    );
  }
}

export default flowRight(
  connect((state) => {
    return {
      userList: getUserList(state),
      currentUser: getUser(state),
      isFetching: getIsFetching(state),
    };
  }, {changeUser}),
  translate(['common', 'roles']),
  withRouter,
)(RoleSelector);
