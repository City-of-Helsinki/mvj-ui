// @flow
import React from 'react';
import classNames from 'classnames';

type Props = {
  className?: string,
  data: Object,
  onItemClick: Function,
};

const ApplicationListItem = ({className, data, onItemClick}: Props) => {
  return (
    <li className={classNames('mvj-application-list__item', className)}
        onClick={() => onItemClick(data.id)}>
      <div className="mvj-application-list__item--header">
        <span className="header--id">Hakemus {data.id}</span>
        <span className="header--date">{data.date}</span>
      </div>

      <div className="mvj-application-list__item--content">
        <span className="content--company">{data.company}</span>
        <span className="content--applicant-name">{data.name}</span>
      </div>
    </li>
  );
};

export default ApplicationListItem;
