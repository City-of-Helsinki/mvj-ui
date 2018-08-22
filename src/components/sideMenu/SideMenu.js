// @flow
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router';
import classnames from 'classnames';

import {getRouteById} from '$src/root/routes';

type Props = {
  isOpen: boolean,
  onLinkClick: Function,
}

class SideMenu extends Component<Props> {
  firstLink: any

  componentDidUpdate(prevProps: Props) {
    if(!prevProps.isOpen && this.props.isOpen) {
      const linkNode: any = ReactDOM.findDOMNode(this.firstLink);
      if(linkNode) {
        linkNode.focus();
      }
    }
  }

  setLinkRef = (element: any) => {
    this.firstLink = element;
  }

  render() {
    const {isOpen, onLinkClick} = this.props;
    return(
      <div className={classnames('side-menu', {'is-menu-open': isOpen})}>
        <ul>
          <li onClick={onLinkClick}><Link ref={this.setLinkRef} to={isOpen ? getRouteById('leases') : ''}>Vuokraukset</Link></li>
          <li onClick={onLinkClick}><Link to={isOpen ? getRouteById('contacts') : ''}>Asiakkaat</Link></li>
          <li onClick={onLinkClick}><Link to={isOpen ? getRouteById('landUseContract') : ''}>Maankäyttösopimukset</Link></li>
          <li onClick={onLinkClick}><Link to={isOpen ? getRouteById('areaNotes') : ''}>Muistettavat ehdot</Link></li>
          <li onClick={onLinkClick}><Link to={isOpen ? getRouteById('infillDevelopment') : ''}>Täydennysrakentamiskorvaukset</Link></li>
          <li onClick={onLinkClick}><Link to={isOpen ? getRouteById('rentBasis') : ''}>Vuokrausperusteet</Link></li>
        </ul>
      </div>
    );
  }
}

export default SideMenu;
