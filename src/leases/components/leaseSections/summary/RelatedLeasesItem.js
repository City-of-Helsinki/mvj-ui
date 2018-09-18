// @flow
import React from 'react';
import classNames from 'classnames';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import ExternalLink from '$components/links/ExternalLink';
import RemoveButton from '$components/form/RemoveButton';
import {DeleteModalLabels, DeleteModalTitles} from '$src/leases/enums';
import {getContentLeaseIdentifier} from '$src/leases/helpers';
import {formatDate, getLabelOfOption} from '$util/helpers';
import {getRouteById} from '$src/root/routes';

import type {Lease} from '$src/leases/types';

type Props = {
  active?: boolean,
  allowDelete?: boolean,
  id?: number,
  indented?: boolean,
  lease: Lease,
  onDelete?: Function,
  stateOptions: Array<Object>,
}

const LeaseHistoryItem = ({
  active = false,
  allowDelete = false,
  id,
  indented = false,
  lease,
  onDelete = () => console.error('Delete related lease function missing'),
  stateOptions,
}: Props) => {
  const identifier = getContentLeaseIdentifier(lease);

  return (
    <AppConsumer>
      {({dispatch}) => {
        const handleDelete = () => {
          dispatch({
            type: ActionTypes.SHOW_DELETE_MODAL,
            deleteFunction: () => {
              onDelete(id);
            },
            deleteModalLabel: DeleteModalLabels.RELATED_LEASE,
            deleteModalTitle: DeleteModalTitles.RELATED_LEASE,
          });
        };

        return(
          <div className={classNames('related-leases-item', {'active': active}, {'indented': indented})}>
            <div className="related-leases-item_wrapper">
              <div className="left-border-overlay" />
              <div className="connection-line" />
              <div className={classNames('related-leases-item_badge')}></div>
              {!!active &&
                <div className={classNames('related-leases-item_info')}>
                  <p className="identifier">{identifier}</p>
                </div>
              }
              {!active &&
                <div className={classNames('related-leases-item_info')}>
                  <p className="identifier">
                    <ExternalLink
                      href={`${getRouteById('leases')}/${lease.id}`}
                      text={identifier || ''}
                    />
                  </p>
                  <p>{formatDate(lease.start_date)} - {formatDate(lease.end_date)}</p>
                  <p className="type">{getLabelOfOption(stateOptions, lease.state) || '-'}</p>
                  {allowDelete &&
                    <RemoveButton
                      className='related-leases-item_remove-button'
                      onClick={handleDelete}
                      title='Poista liitos'
                    />
                  }
                </div>
              }
            </div>
          </div>
        );
      }}
    </AppConsumer>
  );
};

export default LeaseHistoryItem;
