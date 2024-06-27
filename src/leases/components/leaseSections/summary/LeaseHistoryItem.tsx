import React from "react";
import { connect } from "react-redux";
import classNames from "classnames";
import { ActionTypes, AppConsumer } from "/src/app/AppContext";
import AccordionIcon from "/src/components/icons/AccordionIcon";
import Authorization from "/src/components/authorization/Authorization";
import ExternalLink from "/src/components/links/ExternalLink";
import FormText from "/src/components/form/FormText";
import RemoveButton from "/src/components/form/RemoveButton";
import { ConfirmationModalTexts } from "enums";
import { LeaseHistoryItemTypes } from "/src/leases/enums";
import { ButtonColors } from "/src/components/enums";
import { UsersPermissions } from "usersPermissions/enums";
import { getContentLeaseIdentifier, getTitleText } from "/src/leases/helpers";
import { formatDate, getLabelOfOption, hasPermissions } from "util/helpers";
import { getRouteById, Routes } from "/src/root/routes";
import { getUsersPermissions } from "usersPermissions/selectors";
import type { Lease } from "/src/leases/types";
import type { UsersPermissions as UsersPermissionsType } from "usersPermissions/types";
type Props = {
  active?: boolean;
  indented?: boolean;
  lease?: Lease;
  id?: number;
  deleteId?: number;
  itemTitle?: string;
  plotSearchName?: string;
  startDate?: string;
  endDate?: string;
  receivedAt?: string;
  plotSearchType?: string;
  plotSearchSubtype?: string;
  applicantName?: string;
  itemType?: string;
  onDelete?: (...args: Array<any>) => any;
  stateOptions: Array<Record<string, any>>;
  usersPermissions: UsersPermissionsType;
};

const LeaseHistoryItem = ({
  active = false,
  indented = false,
  lease,
  id,
  deleteId,
  itemTitle = '',
  startDate,
  endDate,
  receivedAt,
  plotSearchType,
  plotSearchSubtype,
  applicantName,
  itemType = '',
  onDelete,
  stateOptions,
  usersPermissions
}: Props) => {
  const titleString = lease ? getContentLeaseIdentifier(lease) : itemTitle;
  const MAX_TITLE_LENGTH = 16;
  const title = getTitleText(titleString, MAX_TITLE_LENGTH);
  const externalLinkHref = lease ? `${getRouteById(Routes.LEASES)}/${lease.id}` : itemType === LeaseHistoryItemTypes.PLOTSEARCH && id ? `${getRouteById(Routes.PLOT_SEARCH)}/${id}` : itemType === LeaseHistoryItemTypes.PLOT_APPLICATION && id ? `${getRouteById(Routes.PLOT_APPLICATIONS)}/${id}` : itemType === LeaseHistoryItemTypes.AREA_SEARCH && id ? `${getRouteById(Routes.AREA_SEARCH)}/${id}` : null;
  const permissions = hasPermissions(usersPermissions, UsersPermissions.DELETE_LEASE_HISTORY_ITEM);
  return <AppConsumer>
      {({
      dispatch
    }) => {
      const handleDelete = () => {
        dispatch({
          type: ActionTypes.SHOW_CONFIRMATION_MODAL,
          confirmationFunction: () => {
            if (onDelete) {
              onDelete(deleteId);
            }
          },
          confirmationModalButtonClassName: ButtonColors.ALERT,
          confirmationModalButtonText: ConfirmationModalTexts.DELETE_RELATED_LEASE.BUTTON,
          confirmationModalLabel: ConfirmationModalTexts.DELETE_RELATED_LEASE.LABEL,
          confirmationModalTitle: ConfirmationModalTexts.DELETE_RELATED_LEASE.TITLE
        });
      };

      return <div className={classNames('related-leases-item', {
        'active': active
      }, {
        'indented': indented
      })}>
            <div className="related-leases-item_wrapper">
              <div className="left-border-overlay" />
              <div className="connection-line" />
              <div className={classNames('related-leases-item_badge')}>
                {!active && <AccordionIcon />}
              </div>
              <div className={classNames('related-leases-item_info')}>
                <p className="identifier">
                  {active ? title : externalLinkHref ? <ExternalLink href={externalLinkHref} text={title || ''} /> : title}
                </p>
                {receivedAt && <FormText>Saapunut {formatDate(receivedAt)}</FormText>}
                {startDate && endDate && <FormText>{formatDate(startDate)} - {formatDate(endDate)}</FormText>}
                {plotSearchType && <FormText>{plotSearchType}</FormText>}
                {plotSearchSubtype && <FormText>{plotSearchSubtype}</FormText>}
                {applicantName && <FormText>{applicantName}</FormText>}
                <FormText className="type">{lease ? getLabelOfOption(stateOptions, lease.state) : itemType}</FormText>
                <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.DELETE_LEASE_HISTORY_ITEM)}>
                  {onDelete && deleteId && <RemoveButton className='related-leases-item_remove-button' onClick={handleDelete} title='Poista liitos' />}
                </Authorization>
              </div>

            </div>
          </div>;
    }}
    </AppConsumer>;
};

export default connect(state => {
  return {
    usersPermissions: getUsersPermissions(state)
  };
})(LeaseHistoryItem);