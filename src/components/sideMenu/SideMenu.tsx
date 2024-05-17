import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import classnames from "classnames";
import flowRight from "lodash/flowRight";
import isEmpty from "lodash/isEmpty";
import Authorization from "src/components/authorization/Authorization";
import Loader from "src/components/loader/Loader";
import LoaderWrapper from "src/components/loader/LoaderWrapper";
import SubMenu from "./SubMenu";
import { ActionTypes, AppConsumer } from "src/app/AppContext";
import { ConfirmationModalTexts } from "src/enums";
import { ButtonColors } from "src/components/enums";
import { UsersPermissions } from "src/usersPermissions/enums";
import { hasAnyPageDirtyForms } from "src/util/forms";
import { hasPermissions } from "src/util/helpers";
import { getRouteById, Routes } from "src/root/routes";
import { withUsersPermissions } from "src/components/attributes/UsersPermissions";
import type { UsersPermissions as UsersPermissionsType } from "src/usersPermissions/types";
type OwnProps = {};
type Props = OwnProps & {
  history: Record<string, any>;
  isFetchingUsersPermissions: boolean;
  isOpen: boolean;
  onLinkClick: (...args: Array<any>) => any;
  usersPermissions: UsersPermissionsType;
};
type State = {
  isClosing: boolean;
  isOpen: boolean;
  isOpening: boolean;
  subMenuKey: string;
};

class SideMenu extends Component<Props, State> {
  _isMounted: boolean;
  component: any;
  firstLink: any;
  state = {
    isClosing: false,
    isOpen: false,
    isOpening: false,
    subMenuKey: ''
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if (props.isOpen !== state.isOpen) {
      newState.isOpen = props.isOpen;

      if (props.isOpen) {
        newState.isOpening = true;
      } else {
        newState.isClosing = true;
      }
    }

    return !isEmpty(newState) ? newState : null;
  }

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.isOpen && this.props.isOpen) {
      const linkNode: any = ReactDOM.findDOMNode(this.firstLink);

      if (linkNode) {
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
    if (!this._isMounted) return;
    this.setState({
      isClosing: false,
      isOpening: false
    });
  };
  setComponentRef = (element: any) => {
    this.component = element;
  };
  setLinkRef = (element: any) => {
    this.firstLink = element;
  };
  getSideMenuWidth = () => {
    const menuButton = document.getElementsByClassName('top-navigation__title_button');

    if (menuButton.length) {
      return menuButton[0].clientWidth;
    }

    return null;
  };
  handleHeaderClick = key => {
    this.setState({
      subMenuKey: key
    });
  };

  render() {
    const {
      isFetchingUsersPermissions,
      isOpen,
      usersPermissions
    } = this.props;
    const {
      isClosing,
      isOpening,
      subMenuKey
    } = this.state;
    const width = this.getSideMenuWidth();
    return <AppConsumer>
        {({
        dispatch
      }) => {
        const handleClick = (e: any) => {
          const {
            onLinkClick
          } = this.props,
                hasDirtyPages = hasAnyPageDirtyForms();
          this.setState({
            subMenuKey: ''
          });

          if (hasDirtyPages) {
            const target = e.target;
            e.preventDefault();
            dispatch({
              type: ActionTypes.SHOW_CONFIRMATION_MODAL,
              confirmationFunction: () => {
                const {
                  history
                } = this.props;
                const relativeUrl = target.href.replace(location.origin, '');
                history.push(relativeUrl);
                onLinkClick();
              },
              confirmationModalButtonClassName: ButtonColors.ALERT,
              confirmationModalButtonText: ConfirmationModalTexts.CANCEL_CHANGES.BUTTON,
              confirmationModalLabel: ConfirmationModalTexts.CANCEL_CHANGES.LABEL,
              confirmationModalTitle: ConfirmationModalTexts.CANCEL_CHANGES.TITLE
            });
          } else {
            onLinkClick();
          }
        };

        return <div ref={this.setComponentRef} className={classnames('side-menu', {
          'is-closing': isClosing,
          'is-menu-open': isOpen,
          'is-opening': isOpening
        })} style={{
          width: width
        }}>
              {isFetchingUsersPermissions && <LoaderWrapper><Loader isLoading={true} /></LoaderWrapper>}
              {!isFetchingUsersPermissions && <ul hidden={!isOpen && !isClosing && !isOpening}>
                  <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.VIEW_LEASE)}>
                    <li><Link ref={this.setLinkRef} onClick={handleClick} to={getRouteById(Routes.LEASES)}>Vuokraukset</Link></li>
                  </Authorization>

                  <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.VIEW_CONTACT)}>
                    <li><Link onClick={handleClick} to={getRouteById(Routes.CONTACTS)}>Asiakkaat</Link></li>
                  </Authorization>


                  <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.VIEW_AREANOTE)}>
                    <li><Link onClick={handleClick} to={getRouteById(Routes.AREA_NOTES)}>Muistettavat ehdot</Link></li>
                  </Authorization>

                  <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.VIEW_BASISOFRENT)}>
                    <li><Link onClick={handleClick} to={getRouteById(Routes.RENT_BASIS)}>Vuokrausperiaatteet</Link></li>
                  </Authorization>

                  <li><Link onClick={handleClick} to={getRouteById(Routes.LEASE_STATISTIC_REPORT)}>Tilastot ja raportit</Link></li>

                  <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.VIEW_INFILLDEVELOPMENTCOMPENSATION)}>
                    <li><Link style={{
                  color: '#b7b7b7'
                }} onClick={handleClick} to={getRouteById(Routes.INFILL_DEVELOPMENTS)}>Täydennysrakentamiskorvaukset</Link></li>
                  </Authorization>

                  <li><Link style={{
                color: '#b7b7b7'
              }} onClick={handleClick} to={getRouteById(Routes.LAND_USE_CONTRACTS)}>Maankäyttösopimukset</Link></li>
                  
                  {process.env.NODE_ENV !== 'production' && <SubMenu header='Tonttihaut ja kilpailut' isOpen={subMenuKey === 'plot'} items={[{
              allow: hasPermissions(usersPermissions, UsersPermissions.VIEW_PLOTSEARCH),
              onClick: handleClick,
              text: 'Tonttihaut',
              to: getRouteById(Routes.PLOT_SEARCH)
            }, {
              allow: hasPermissions(usersPermissions, UsersPermissions.VIEW_ANSWER),
              onClick: handleClick,
              text: 'Tonttihakemukset',
              to: getRouteById(Routes.PLOT_APPLICATIONS)
            }]} menuKey='plot' onHeaderClick={this.handleHeaderClick} />}
                  {process.env.NODE_ENV !== 'production' && <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.VIEW_AREASEARCH)}>
                    <li><Link onClick={handleClick} to={getRouteById(Routes.AREA_SEARCH)}>Aluehaut</Link></li>
                  </Authorization>}

                  <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_LEASEBASISOFRENT) || hasPermissions(usersPermissions, UsersPermissions.VIEW_INDEX) || hasPermissions(usersPermissions, UsersPermissions.VIEW_JOBRUN) || hasPermissions(usersPermissions, UsersPermissions.VIEW_SCHEDULEDJOB) || hasPermissions(usersPermissions, UsersPermissions.VIEW_INVOICE) || hasPermissions(usersPermissions, UsersPermissions.VIEW_INVOICENOTE) || hasPermissions(usersPermissions, UsersPermissions.VIEW_LEASEHOLDTRANSFER)}>
                    <SubMenu header='Lisää' isOpen={subMenuKey === 'tools'} items={[{
                allow: hasPermissions(usersPermissions, UsersPermissions.VIEW_INDEX),
                onClick: handleClick,
                text: 'Elinkustannusindeksit',
                to: getRouteById(Routes.INDEX)
              }, {
                allow: hasPermissions(usersPermissions, UsersPermissions.VIEW_JOBRUN) || hasPermissions(usersPermissions, UsersPermissions.VIEW_SCHEDULEDJOB),
                onClick: handleClick,
                text: 'Eräajot',
                to: getRouteById(Routes.BATCH_RUN)
              }, {
                allow: hasPermissions(usersPermissions, UsersPermissions.VIEW_INVOICE),
                onClick: handleClick,
                text: 'Kaupparekisterihaku',
                to: getRouteById(Routes.TRADE_REGISTER)
              }, {
                allow: hasPermissions(usersPermissions, UsersPermissions.VIEW_INVOICENOTE),
                onClick: handleClick,
                text: 'Laskujen tiedotteet',
                to: getRouteById(Routes.INVOICE_NOTES)
              }, {
                allow: hasPermissions(usersPermissions, UsersPermissions.VIEW_INVOICE),
                onClick: handleClick,
                text: 'SAP laskut',
                to: getRouteById(Routes.SAP_INVOICES)
              }, {
                allow: hasPermissions(usersPermissions, UsersPermissions.ADD_LEASEBASISOFRENT),
                onClick: handleClick,
                text: 'Vuokralaskuri',
                to: getRouteById(Routes.BASIS_OF_RENT_CALCULATOR)
              }, {
                allow: hasPermissions(usersPermissions, UsersPermissions.VIEW_LEASEHOLDTRANSFER),
                onClick: handleClick,
                text: 'Vuokraoikeuden siirrot',
                to: getRouteById(Routes.LEASEHOLD_TRANSFER)
              }, {
                allow: hasPermissions(usersPermissions, UsersPermissions.VIEW_CREDITDECISION),
                onClick: handleClick,
                text: 'Asiakastieto',
                to: getRouteById(Routes.CREDIT_DECISION)
              }]} menuKey='tools' onHeaderClick={this.handleHeaderClick} />
                  </Authorization>
                </ul>}
            </div>;
      }}
      </AppConsumer>;
  }

}

export default (flowRight(withUsersPermissions, withRouter)(SideMenu) as React.ComponentType<OwnProps>);