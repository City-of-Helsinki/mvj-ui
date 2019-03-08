// @flow
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';
import {withRouter} from 'react-router';
import classnames from 'classnames';
import flowRight from 'lodash/flowRight';

import Authorization from '$components/authorization/Authorization';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import {CancelChangesModalTexts, Methods} from '$src/enums';
import {ButtonColors} from '$components/enums';
import {hasAnyPageDirtyForms} from '$src/helpers';
import {isMethodAllowed} from '$util/helpers';
import {getRouteById, Routes} from '$src/root/routes';
import {withCommonAttributes} from '$components/attributes/CommonAttributes';

import type {Methods as MethodsType} from '$src/types';

type Props = {
  areaNoteMethods: MethodsType,
  contactMethods: MethodsType,
  history: Object,
  indexMethods: MethodsType,
  infillDevelopmentMethods: MethodsType,
  invoiceMethods: MethodsType,
  isFetchingCommonAttributes: boolean,
  isOpen: boolean,
  leaseMethods: MethodsType,
  leaseholdTransferMethods: MethodsType,
  onLinkClick: Function,
  rentBasisMethods: MethodsType,
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
    const {
      areaNoteMethods,
      contactMethods,
      indexMethods,
      infillDevelopmentMethods,
      invoiceMethods,
      isFetchingCommonAttributes,
      isOpen,
      leaseMethods,
      leaseholdTransferMethods,
      rentBasisMethods,
    } = this.props;
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
                  const {history} = this.props;
                  const relativeUrl = target.href.replace(location.origin, '');

                  history.push(relativeUrl);
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
                  <Authorization allow={isMethodAllowed(leaseMethods, Methods.GET)}>
                    <li><Link ref={this.setLinkRef} onClick={handleClick} to={getRouteById(Routes.LEASES)}>Vuokraukset</Link></li>
                  </Authorization>
                  <Authorization allow={isMethodAllowed(contactMethods, Methods.GET)}>
                    <li><Link onClick={handleClick} to={getRouteById(Routes.CONTACTS)}>Asiakkaat</Link></li>
                  </Authorization>
                  <Authorization allow={isMethodAllowed(indexMethods, Methods.GET)}>
                    <li><Link onClick={handleClick} to={getRouteById(Routes.INDEX)}>Elinkustannusindeksi</Link></li>
                  </Authorization>
                  <li><Link onClick={handleClick} to={getRouteById(Routes.LAND_USE_CONTRACTS)}>Maankäyttösopimukset</Link></li>
                  <Authorization allow={isMethodAllowed(areaNoteMethods, Methods.GET)}>
                    <li><Link onClick={handleClick} to={getRouteById(Routes.AREA_NOTES)}>Muistettavat ehdot</Link></li>
                  </Authorization>
                  <li><Link onClick={handleClick} to={getRouteById(Routes.TRADE_REGISTER)}>Kaupparekisteri</Link></li>
                  <Authorization allow={isMethodAllowed(invoiceMethods, Methods.GET)}>
                    <li><Link onClick={handleClick} to={getRouteById(Routes.SAP_INVOICES)}>SAP laskut</Link></li>
                  </Authorization>
                  <Authorization allow={isMethodAllowed(infillDevelopmentMethods, Methods.GET)}>
                    <li><Link onClick={handleClick} to={getRouteById(Routes.INFILL_DEVELOPMENTS)}>Täydennysrakentamiskorvaukset</Link></li>
                  </Authorization>
                  <Authorization allow={isMethodAllowed(leaseholdTransferMethods, Methods.GET)}>
                    <li><Link onClick={handleClick} to={getRouteById(Routes.LEASEHOLD_TRANSFER)}>Vuokraoikeuden siirrot</Link></li>
                  </Authorization>
                  <Authorization allow={isMethodAllowed(rentBasisMethods, Methods.GET)}>
                    <li><Link onClick={handleClick} to={getRouteById(Routes.RENT_BASIS)}>Vuokrausperusteet</Link></li>
                  </Authorization>
                </ul>
              }
            </div>
          );
        }}
      </AppConsumer>
    );
  }
}

export default flowRight(
  withCommonAttributes,
  withRouter,
)(SideMenu);
