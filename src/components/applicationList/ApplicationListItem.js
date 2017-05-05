// @flow
import React from 'react';
import classNames from 'classnames';
import {formatDateObj} from '../../util/helpers';

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
        <span className="header--date">{formatDateObj(data.created_at)}</span>
      </div>

      <div className="mvj-application-list__item--content">
        <span className="content--company">{data.organization_name}</span>
        <span className="content--applicant-name">{data.contact_name}</span>
      </div>
    </li>
  );
};

export default ApplicationListItem;
