// @flow
import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AccordionIcon from '$components/icons/AccordionIcon';
import Authorization from '$components/authorization/Authorization';
import ExternalLink from '$components/links/ExternalLink';
import FormText from '$components/form/FormText';
import RemoveButton from '$components/form/RemoveButton';
import {ConfirmationModalTexts} from '$src/enums';
import {ButtonColors} from '$components/enums';
import {UsersPermissions} from '$src/usersPermissions/enums';
import {getContentLeaseIdentifier} from '$src/leases/helpers';
import {formatDate, getLabelOfOption, hasPermissions} from '$util/helpers';
import {getRouteById, Routes} from '$src/root/routes';
import {getUsersPermissions} from '$src/usersPermissions/selectors';

import type {Lease} from '$src/leases/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';

type Props = {
  active?: boolean,
  indented?: boolean,
  lease?: Lease,
  id?: number,
  itemTitle?: string,
  plotSearchName?: string,
  startDate?: string,
  endDate?: string,
  receivedAt?: string,
  plotSearchType?: string,
  plotSearchSubtype?: string,
  itemType?: string,
  onDelete?: Function,
  stateOptions: Array<Object>,
  usersPermissions: UsersPermissionsType,
}

const LeaseHistoryItem = (
  {
    active = false,
    indented = false,
    lease,
    id,
    itemTitle = '',
    startDate,
    endDate,
    receivedAt,
    plotSearchType,
    plotSearchSubtype,
    itemType = '',
    onDelete,
    stateOptions,
    usersPermissions
  }: Props,
) => {
  const title = lease ? getContentLeaseIdentifier(lease) : itemTitle;
  const externalLinkHref = lease ? `${getRouteById(Routes.LEASES)}/${lease.id}`
    : itemType === 'Haku' && id ? `${getRouteById(Routes.PLOT_SEARCH)}/${id}`
    : itemType === 'Hakemus' && id ? `${getRouteById(Routes.PLOT_APPLICATIONS)}/${id}`
    : null
  // TODO: Add permissions for deleting plot searches and plot applications
  // TODO: implement usersPermissions properly
  const permissions = hasPermissions(usersPermissions, UsersPermissions.DELETE_RELATEDLEASE)

  return (
    <AppConsumer>
      {({dispatch}) => {
        const handleDelete = () => {
          dispatch({
            type: ActionTypes.SHOW_CONFIRMATION_MODAL,
            confirmationFunction: () => {
              if(onDelete) {
                onDelete(id);
              }
            },
            confirmationModalButtonClassName: ButtonColors.ALERT,
            confirmationModalButtonText: ConfirmationModalTexts.DELETE_RELATED_LEASE.BUTTON,
            confirmationModalLabel: ConfirmationModalTexts.DELETE_RELATED_LEASE.LABEL,
            confirmationModalTitle: ConfirmationModalTexts.DELETE_RELATED_LEASE.TITLE,
          });
        };

        return(
          <div className={classNames('related-leases-item', {'active': active}, {'indented': indented})}>
            <div className="related-leases-item_wrapper">
              <div className="left-border-overlay" />
              <div className="connection-line" />
              <div className={classNames('related-leases-item_badge')}>
                {!active && <AccordionIcon/>}
              </div>
              <div className={classNames('related-leases-item_info')}>
                <p className="identifier">
                  {active
                    ? title
                    : externalLinkHref
                    ? <ExternalLink
                        href={externalLinkHref}
                        text={title || ''}
                      />
                    : title
                  }
                </p>
                {receivedAt && <FormText>Hakemus saapunut {formatDate(receivedAt)}</FormText>}
                {startDate && endDate && <FormText>{formatDate(startDate)} - {formatDate(endDate)}</FormText>}
                {plotSearchType && <FormText>{plotSearchType}</FormText>}
                {plotSearchSubtype && <FormText>{plotSearchSubtype}</FormText>}
                <FormText className="type">{lease ? getLabelOfOption(stateOptions, lease.state) : itemType}</FormText>
                <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.DELETE_RELATEDLEASE)}>
                  {onDelete &&
                    <RemoveButton
                      className='related-leases-item_remove-button'
                      onClick={handleDelete}
                      title='Poista liitos'
                    />
                  }
                </Authorization>
              </div>

            </div>
          </div>
        );
      }}
    </AppConsumer>
  );
};

export default connect(
  (state) => {
    return {
      usersPermissions: getUsersPermissions(state),
    };
  }
)(LeaseHistoryItem);
