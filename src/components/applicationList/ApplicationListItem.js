// @flow
import React from 'react';
import {translate} from 'react-i18next';
import flowRight from 'lodash/flowRight';
import classNames from 'classnames';

import {formatDateObj} from '../../util/helpers';

type Props = {
  active: ?boolean,
  className: ?string,
  data: Object,
  onItemClick: Function,
  t: Function,
};

const ApplicationListItem = ({active, className, data, onItemClick, t}: Props) => {
  return (
    <li className={classNames('mvj-application-list__item', className, {'active': active})}
        onClick={() => onItemClick(data.id)}>
      <div className="mvj-application-list__item--header">
        <span className="header--id">Hakemus {data.id}: {t(`types.${data.type}`)}</span>
        <span className="header--date">{formatDateObj(data.created_at)}</span>
      </div>

      <div className="mvj-application-list__item--content">
        <span className="content--company">{data.organization_name}</span>
        <span className="content--applicant-name">{data.contact_name}</span>
      </div>
    </li>
  );
};

export default flowRight(
  translate(['applications'])
)(ApplicationListItem);
