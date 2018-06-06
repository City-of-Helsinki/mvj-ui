// @flow
import React from 'react';
import classNames from 'classnames';

import RemoveButton from '$components/form/RemoveButton';
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

  const handleDelete = () => {
    onDelete(id);
  };

  return (
    <div className={classNames('related-leases__item', {'active': active}, {'indented': indented})}>
      <div className="related-leases__item_wrapper">
        <div className="related-leases__item_left-border-overlay" />
        <div className="related-leases__item_connection-line" />
        <div className={classNames('related-leases__item_badge')}></div>
        {!!active &&
          <div className={classNames('related-leases__item_info')}>
            <p className="identifier">{identifier}</p>
          </div>
        }
        {!active &&
          <div className={classNames('related-leases__item_info')}>
            <p className="identifier"><a href={`${getRouteById('leases')}/${lease.id}`} target='_blank'>{identifier}</a></p>
            <p>{formatDate(lease.start_date)} - {formatDate(lease.end_date)}</p>
            <p className="type">{getLabelOfOption(stateOptions, lease.state) || '-'}</p>
            {allowDelete &&
              <RemoveButton
                className='related-leases__item_remove-button'
                onClick={handleDelete}
                title='Poista'
              />
            }
          </div>
        }
      </div>
    </div>
  );
};

export default LeaseHistoryItem;
