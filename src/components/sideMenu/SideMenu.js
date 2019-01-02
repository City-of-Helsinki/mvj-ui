// @flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import {Link} from 'react-router';
import classnames from 'classnames';

import Authorization from '$components/authorization/Authorization';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import {CancelChangesModalTexts} from '$src/enums';
import {ButtonColors} from '$components/enums';
import {hasAnyPageDirtyForms} from '$src/helpers';
import {getRouteById} from '$src/root/routes';
import {withCommonAttributes} from '$components/attributes/CommonAttributes';

import type {Methods} from '$src/types';

type Props = {
  contactMethods: Methods,
  isFetchingCommonAttributes: boolean,
  isOpen: boolean,
  leaseMethods: Methods,
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
    const {contactMethods, isFetchingCommonAttributes, isOpen, leaseMethods} = this.props;
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
                confirmationModalButtonClassName: ButtonColors.ALERT,
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
              {isFetchingCommonAttributes && <LoaderWrapper><Loader isLoading={true} /></LoaderWrapper>}
              {!isFetchingCommonAttributes &&
                <ul hidden={!isOpen && !isClosing && !isOpening}>
                  <Authorization allow={leaseMethods.GET}>
                    <li><Link ref={this.setLinkRef} onClick={handleClick} to={getRouteById('leases')}>Vuokraukset</Link></li>
                  </Authorization>
                  <Authorization allow={contactMethods.GET}>
                    <li><Link onClick={handleClick} to={getRouteById('contacts')}>Asiakkaat</Link></li>
                  </Authorization>
                  <li><Link onClick={handleClick} to={getRouteById('landUseContract')}>Maankäyttösopimukset</Link></li>
                  <li><Link onClick={handleClick} to={getRouteById('areaNotes')}>Muistettavat ehdot</Link></li>
                  <li><Link onClick={handleClick} to={getRouteById('infillDevelopment')}>Täydennysrakentamiskorvaukset</Link></li>
                  <li><Link onClick={handleClick} to={getRouteById('rentBasis')}>Vuokrausperusteet</Link></li>
                </ul>
              }

            </div>
          );
        }}
      </AppConsumer>
    );
  }
}

export default withCommonAttributes(SideMenu);
