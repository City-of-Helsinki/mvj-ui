// @flow
import React from 'react';

import LeaseHistoryItem from './LeaseHistoryItem';

type Props = {
  history: Array<Object>,
}

const LeaseHistory = ({history}: Props) => {
  return (
    <div className="lease-history__component">
      <h3>Historia</h3>
      {history && !!history.length &&
        <div className="lease-history__items">
          <div className="lease-history__items-border-left" />
          {history.map((historyItem, index) => {
            return (
              <LeaseHistoryItem
                key={index}
                active={historyItem.active}
                end_date={historyItem.end_date}
                identifier={historyItem.identifier}
                start_date={historyItem.start_date}
                type={historyItem.type}
              />
            );
          })}
        </div>
      }
    </div>
  );
};

export default LeaseHistory;
