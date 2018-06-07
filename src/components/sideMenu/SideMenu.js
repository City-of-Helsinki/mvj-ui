// @flow
import React from 'react';
import {Link} from 'react-router';
import classnames from 'classnames';

import {getRouteById} from '$src/root/routes';

type Props = {
  isOpen: boolean,
  onLinkClick: Function,
}

const SideMenu = ({isOpen, onLinkClick}: Props) =>
  <div className={classnames('side-menu', {'is-menu-open': isOpen})}>
    <ul>
      <li onClick={onLinkClick}><Link to={getRouteById('leases')}>Vuokraukset</Link></li>
      <li onClick={onLinkClick}><Link to={getRouteById('areaNotes')}>Muistettavat ehdot</Link></li>
      <li onClick={onLinkClick}><Link to={getRouteById('rentBasis')}>Vuokrausperusteet</Link></li>
      <li onClick={onLinkClick}><Link to={getRouteById('infillDevelopment')}>Täydennysrakentaminen</Link></li>
      <li onClick={onLinkClick}><Link to={getRouteById('contacts')}>Asiakkaat</Link></li>
    </ul>
  </div>;

export default SideMenu;
