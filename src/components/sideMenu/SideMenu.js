// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import {Link} from 'react-router';
import classnames from 'classnames';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import {CancelChangesModalTexts} from '$src/enums';
import {hasAnyPageDirtyForms} from '$src/helpers';
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

  static contextTypes = {
    router: PropTypes.object,
  };

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
    const {isOpen} = this.props;
    const {isClosing, isOpening} = this.state;
    const width =  this.getSideMenuWidth();

    return(
      <AppConsumer>
        {({dispatch}) => {
          const handleClick = (e: any) => {
            const {onLinkClick} = this.props,
              hasDirtyPages = hasAnyPageDirtyForms();

            if(hasDirtyPages) {
              const target = e.target;

              e.preventDefault();

              dispatch({
                type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                confirmationFunction: () => {
                  const {router} = this.context;
                  router.push(target.href);
                  onLinkClick();
                },
                confirmationModalButtonText: CancelChangesModalTexts.BUTTON,
                confirmationModalLabel: CancelChangesModalTexts.LABEL,
                confirmationModalTitle: CancelChangesModalTexts.TITLE,
              });
            } else {
              onLinkClick();
            }
          };

          return(
            <div ref={this.setComponentRef} className={classnames('side-menu', {'is-menu-open': isOpen})} style={{width: width}}>
              <ul hidden={!isOpen && !isClosing && !isOpening}>
                <li><Link ref={this.setLinkRef} onClick={handleClick} to={getRouteById('leases')}>Vuokraukset</Link></li>
                <li><Link onClick={handleClick} to={getRouteById('contacts')}>Asiakkaat</Link></li>
                <li><Link onClick={handleClick} to={getRouteById('landUseContract')}>Maankäyttösopimukset</Link></li>
                <li><Link onClick={handleClick} to={getRouteById('areaNotes')}>Muistettavat ehdot</Link></li>
                <li><Link onClick={handleClick} to={getRouteById('infillDevelopment')}>Täydennysrakentamiskorvaukset</Link></li>
                <li><Link onClick={handleClick} to={getRouteById('rentBasis')}>Vuokrausperusteet</Link></li>
              </ul>
            </div>
          );
        }}
      </AppConsumer>
    );
  }
}

export default SideMenu;
