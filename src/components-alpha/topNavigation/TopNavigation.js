// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {Link} from 'react-router-dom';
import {translate} from 'react-i18next';
// import i18n from '../../root/i18n';
import flowRight from 'lodash/flowRight';

import DropDown from '../dropdown/DropDown';
import {changeUser} from '../../role/actions';
import {getUser, getUserList} from '../../role/selectors';
import {Languages} from '../../constants';
import {getActiveLanguage} from '$util/helpers';

type Props = {
  changeUser: Function,
  currentUser: Object,
  i18n: Object,
  location: Object,
  router: Object,
  t: Function,
  userList: Array<any>,
}

class TopNavigation extends Component<Props> {
  getLocationForNewLanguage = (prevPath, langKey) => {
    const {pathname, search, hash} = prevPath;
    const pathArr = pathname.split('/');
    pathArr.splice(1, 1, langKey);
    return `${pathArr.join('/')}${search}${hash}`;
  };

  handleLanguageMenuItemClick = ({id}) => {
    console.log(id);
    // const {router, location} = this.props;
    // if (id !== i18n.language) {
    //   return i18n.changeLanguage(id, () => {
    //     // return router.push(newLocation);
    //   });
    // }
  };

  handleUserMenuItemClick = (user) => {
    const {changeUser} = this.props;
    return changeUser(user);
  };

  render() {
    const {currentUser, userList, t} = this.props;

    return (
      <section className="top-navigation-alpha">
        <div className="title">
          <Link to="/">{t('appName')}</Link>
        </div>

        <DropDown className="user-switcher"
          placeholder={t('roles:subtitle')}
          active={currentUser}
          icon={<i className="mi mi-account-circle"/>}
          iconPlacement="right"
          displayCaret={false}
          items={userList}
          onItemClick={this.handleUserMenuItemClick}/>

        <DropDown className="language-switcher"
          active={getActiveLanguage()}
          items={Languages}
          onItemClick={this.handleLanguageMenuItemClick}/>

      </section>
    );
  }
}

export default flowRight(
  connect((state) => {
    return {
      currentUser: getUser(state),
      userList: getUserList(state),
    };
  }, {changeUser}),
  withRouter,
  translate(['common', 'roles'])
)(TopNavigation);
