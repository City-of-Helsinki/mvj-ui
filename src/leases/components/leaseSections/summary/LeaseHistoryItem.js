// @flow
import React from 'react';
import classNames from 'classnames';
import {formatDate} from '$util/helpers';

type Props = {
  active?: boolean,
  end_date: string,
  identifier: string,
  start_date: string,
  type: string,
}

const LeaseHistoryItem = ({
  active = false,
  end_date,
  identifier,
  start_date,
  type,
}: Props) => {
  return (
    <div className="lease-history__item">
      <div className={classNames('lease-history__item-badge', {'active': active})}></div>
      <div className={classNames('lease-history__item-info', {'active': active})}>
        <p className="identifier">{identifier}</p>
        <p>{formatDate(start_date)} - {formatDate(end_date)}</p>
        <p className="type">{type}</p>
      </div>
    </div>
  );
};

export default LeaseHistoryItem;
