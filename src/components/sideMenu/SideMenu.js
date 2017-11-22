// @flow
import React, {Component} from 'react';
import classnames from 'classnames';

type Props = {
  isOpen: boolean,
}

class SideMenu extends Component {
  props: Props;

  render() {
    const {isOpen} = this.props;

    return (
      <div className={classnames('side-menu', {'is-menu-open': isOpen})}>
        <ul>
          <li>Haku</li>
          <li>Raportointi</li>
          <li>Tietoa palvelusta</li>
        </ul>
      </div>
    );
  }
}

export default SideMenu;
