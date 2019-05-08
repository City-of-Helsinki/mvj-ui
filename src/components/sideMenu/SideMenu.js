// @flow
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';
import {withRouter} from 'react-router';
import classnames from 'classnames';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import Authorization from '$components/authorization/Authorization';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import SubMenu from './SubMenu';
import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import {CancelChangesModalTexts, Methods} from '$src/enums';
import {ButtonColors} from '$components/enums';
import {UsersPermissions} from '$src/usersPermissions/enums';
import {hasAnyPageDirtyForms} from '$src/helpers';
import {hasPermissions, isMethodAllowed} from '$util/helpers';
import {getRouteById, Routes} from '$src/root/routes';
import {withCommonAttributes} from '$components/attributes/CommonAttributes';

import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';
import type {Methods as MethodsType} from '$src/types';

type Props = {
  areaNoteMethods: MethodsType,
  contactMethods: MethodsType,
  history: Object,
  indexMethods: MethodsType,
  infillDevelopmentMethods: MethodsType,
  invoiceMethods: MethodsType,
  invoiceNoteMethods: MethodsType,
  isFetchingCommonAttributes: boolean,
  isOpen: boolean,
  leaseMethods: MethodsType,
  leaseholdTransferMethods: MethodsType,
  onLinkClick: Function,
  rentBasisMethods: MethodsType,
  usersPermissions: UsersPermissionsType,
}

type State = {
  isClosing: boolean,
  isOpen: boolean,
  isOpening: boolean,
  subMenuKey: string,
}

class SideMenu extends Component<Props, State> {
  _isMounted: boolean;

  component: any
  firstLink: any

  state = {
    isClosing: false,
    isOpen: false,
    isOpening: false,
    subMenuKey: '',
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if(props.isOpen !== state.isOpen) {
      newState.isOpen = props.isOpen;

      if(props.isOpen) {
        newState.isOpening = true;
      } else {
        newState.isClosing = true;
      }
    }

    return !isEmpty(newState) ? newState : null;
  }

  componentDidUpdate(prevProps: Props) {
    if(!prevProps.isOpen && this.props.isOpen) {
      const linkNode: any = ReactDOM.findDOMNode(this.firstLink);

      if(linkNode) {
        linkNode.focus();
      }
    }
  }

  componentDidMount() {
    this._isMounted = true;
    this.component.addEventListener('transitionend', this.transitionEnds);
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.component.removeEventListener('transitionend', this.transitionEnds);
  }

  transitionEnds = () => {
    if(!this._isMounted) return;
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

  handleHeaderClick = (key) => {
    this.setState({subMenuKey: key});
  }

  render() {
    const {
      areaNoteMethods,
      contactMethods,
      indexMethods,
      infillDevelopmentMethods,
      invoiceMethods,
      invoiceNoteMethods,
      isFetchingCommonAttributes,
      isOpen,
      leaseMethods,
      leaseholdTransferMethods,
      rentBasisMethods,
      usersPermissions,
    } = this.props;
    const {isClosing, isOpening, subMenuKey} = this.state;
    const width =  this.getSideMenuWidth();


    return(
      <AppConsumer>
        {({dispatch}) => {
          const handleClick = (e: any) => {
            const {onLinkClick} = this.props,
              hasDirtyPages = hasAnyPageDirtyForms();

            this.setState({subMenuKey: ''});

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
            <div
              ref={this.setComponentRef}
              className={classnames('side-menu',
                {
                  'is-closing': isClosing,
                  'is-menu-open': isOpen,
                  'is-opening': isOpening,
                },
              )}
              style={{width: width}}
            >
              {isFetchingCommonAttributes && <LoaderWrapper><Loader isLoading={true} /></LoaderWrapper>}
              {!isFetchingCommonAttributes &&
                <ul hidden={!isOpen && !isClosing && !isOpening}>
                  <Authorization allow={isMethodAllowed(leaseMethods, Methods.GET)}>
                    <li><Link ref={this.setLinkRef} onClick={handleClick} to={getRouteById(Routes.LEASES)}>Vuokraukset</Link></li>
                  </Authorization>
                  <Authorization allow={isMethodAllowed(contactMethods, Methods.GET)}>
                    <li><Link onClick={handleClick} to={getRouteById(Routes.CONTACTS)}>Asiakkaat</Link></li>
                  </Authorization>
                  <li><Link onClick={handleClick} to={getRouteById(Routes.LAND_USE_CONTRACTS)}>Maankäyttösopimukset</Link></li>
                  <Authorization allow={isMethodAllowed(areaNoteMethods, Methods.GET)}>
                    <li><Link onClick={handleClick} to={getRouteById(Routes.AREA_NOTES)}>Muistettavat ehdot</Link></li>
                  </Authorization>
                  <Authorization allow={isMethodAllowed(infillDevelopmentMethods, Methods.GET)}>
                    <li><Link onClick={handleClick} to={getRouteById(Routes.INFILL_DEVELOPMENTS)}>Täydennysrakentamiskorvaukset</Link></li>
                  </Authorization>
                  <Authorization allow={isMethodAllowed(rentBasisMethods, Methods.GET)}>
                    <li><Link onClick={handleClick} to={getRouteById(Routes.RENT_BASIS)}>Vuokrausperiaatteet</Link></li>
                  </Authorization>
                  <Authorization allow={isMethodAllowed(indexMethods, Methods.GET) ||
                    hasPermissions(usersPermissions, UsersPermissions.VIEW_INVOICE) ||
                    isMethodAllowed(invoiceNoteMethods, Methods.GET) ||
                    isMethodAllowed(invoiceMethods, Methods.GET) ||
                    isMethodAllowed(leaseholdTransferMethods, Methods.GET)}
                  >
                    <SubMenu
                      header='Työkalut'
                      isOpen={subMenuKey === 'tools'}
                      items={[
                        {
                          allow: isMethodAllowed(indexMethods, Methods.GET),
                          onClick: handleClick,
                          text: 'Elinkustannusindeksit',
                          to: getRouteById(Routes.INDEX),
                        },
                        {
                          allow: hasPermissions(usersPermissions, UsersPermissions.VIEW_INVOICE),
                          onClick: handleClick,
                          text: 'Kaupparekisterihaku',
                          to: getRouteById(Routes.TRADE_REGISTER),
                        },
                        {
                          allow: isMethodAllowed(invoiceNoteMethods, Methods.GET),
                          onClick: handleClick,
                          text: 'Laskujen tiedotteet',
                          to: getRouteById(Routes.INVOICE_NOTES),
                        },
                        {
                          allow: isMethodAllowed(invoiceMethods, Methods.GET),
                          onClick: handleClick,
                          text: 'SAP laskut',
                          to: getRouteById(Routes.SAP_INVOICES),
                        },
                        {
                          allow: isMethodAllowed(leaseholdTransferMethods, Methods.GET),
                          onClick: handleClick,
                          text: 'Vuokraoikeuden siirrot',
                          to: getRouteById(Routes.LEASEHOLD_TRANSFER),
                        },
                      ]}
                      menuKey='tools'
                      onHeaderClick={this.handleHeaderClick}
                    />
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
