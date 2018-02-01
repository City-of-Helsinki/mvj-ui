// @flow
import React, {Component} from 'react';
import {Link} from 'react-router';
import classnames from 'classnames';

type Props = {
  isOpen: boolean,
  onLinkClick: Function,
}

class SideMenu extends Component {
  props: Props;

  render() {
    const {isOpen, onLinkClick} = this.props;

    return (
      <div className={classnames('side-menu', {'is-menu-open': isOpen})}>
        <ul>
          <li onClick={onLinkClick}><Link to="/leases">Haku</Link></li>
          <li>Raportointi</li>
          <li>Tietoa palvelusta</li>
        </ul>
      </div>
    );
  }
}

export default SideMenu;
