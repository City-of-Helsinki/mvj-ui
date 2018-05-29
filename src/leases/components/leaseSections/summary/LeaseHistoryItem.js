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
    <div className={classNames('lease-history__item', {'active': active})}>
      <div className="lease-history__item-wrapper">
        <div className="lease-history__item-left-border" />
        <div className={classNames('lease-history__item-badge')}></div>
        {!!active &&
          <div className={classNames('lease-history__item-info')}>
            <p className="identifier">{identifier}</p>
          </div>
        }
        {!active &&
          <div className={classNames('lease-history__item-info')}>
            <p className="identifier"><a>{identifier}</a></p>
            <p>{formatDate(start_date)} - {formatDate(end_date)}</p>
            <p className="type">{type}</p>
          </div>
        }
      </div>
    </div>
  );
};

export default LeaseHistoryItem;
