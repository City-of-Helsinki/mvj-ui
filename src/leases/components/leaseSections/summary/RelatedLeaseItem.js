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
  id?: number,
  indented?: boolean,
  lease: Lease,
  onDelete?: Function,
  stateOptions: Array<Object>,
  usersPermissions: UsersPermissionsType,
}

const RelatedLeaseItem = ({
  active = false,
  id,
  indented = false,
  lease,
  onDelete,
  stateOptions,
  usersPermissions,
  start_date,
  end_date,
  state
}: Props) => {
  const identifier = state ? lease : getContentLeaseIdentifier(lease);

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
                    ? identifier
                    : <ExternalLink
                      href={state ? `${getRouteById(Routes.PLOT_SEARCH)}/${id}` : `${getRouteById(Routes.LEASES)}/${lease.id}`}
                      text={identifier || ''}
                    />
                  }
                </p>
                <FormText>{start_date ? start_date : formatDate(lease.start_date)} - {end_date ? end_date : formatDate(lease.end_date)}</FormText>
                <FormText className="type">{state ? state : getLabelOfOption(stateOptions, lease.state) || '-'}</FormText>
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
)(RelatedLeaseItem);
