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

type State = {
  isClosing: boolean,
  isOpening: boolean,
}

class SideMenu extends Component<Props, State> {
  component: any
  firstLink: any

  state = {
    isClosing: false,
    isOpening: false,
  }

  componentDidUpdate(prevProps: Props) {
    if(!prevProps.isOpen && this.props.isOpen) {
      const linkNode: any = ReactDOM.findDOMNode(this.firstLink);
      this.setState({
        isOpening: true,
      });
      if(linkNode) {
        linkNode.focus();
      }
    } else if(prevProps.isOpen && !this.props.isOpen) {
      this.setState({
        isClosing: true,
      });
    }
  }

  componentDidMount() {
    this.component.addEventListener('transitionend', this.transitionEnds);
  }

  componentWillUnmount() {
    this.component.removeEventListener('transitionend', this.transitionEnds);
  }

  transitionEnds = () => {
    this.setState({
      isClosing: false,
      isOpening: false,
    });
  }

  setComponentRef = (element: any) => {
    this.component = element;
  }

  setLinkRef = (element: any) => {
    this.firstLink = element;
  }

  getSideMenuWidth = () => {
    const menuButton = document.getElementsByClassName('top-navigation__title_button');
    if(menuButton.length) {
      return menuButton[0].clientWidth;
    }
    return null;
  }

  render() {
    const {isOpen, onLinkClick} = this.props;
    const {isClosing, isOpening} = this.state;
    const width =  this.getSideMenuWidth();

    return(
      <div ref={this.setComponentRef} className={classnames('side-menu', {'is-menu-open': isOpen})} style={{width: width}}>
        <ul hidden={!isOpen && !isClosing && !isOpening}>
          <li onClick={onLinkClick}><Link ref={this.setLinkRef} to={getRouteById('leases')}>Vuokraukset</Link></li>
          <li onClick={onLinkClick}><Link to={getRouteById('contacts')}>Asiakkaat</Link></li>
          <li onClick={onLinkClick}><Link to={getRouteById('landUseContract')}>Maankäyttösopimukset</Link></li>
          <li onClick={onLinkClick}><Link to={getRouteById('areaNotes')}>Muistettavat ehdot</Link></li>
          <li onClick={onLinkClick}><Link to={getRouteById('infillDevelopment')}>Täydennysrakentamiskorvaukset</Link></li>
          <li onClick={onLinkClick}><Link to={getRouteById('rentBasis')}>Vuokrausperusteet</Link></li>
        </ul>
      </div>
    );
  }
}

export default SideMenu;
