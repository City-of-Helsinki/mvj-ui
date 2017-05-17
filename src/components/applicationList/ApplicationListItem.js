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
    <li className={classNames('mvj-application-list__item', className, {'active': active})}>
      <div className="mvj-application-list__item--content">
        <div className="mvj-application-list__item--header">
          {formatDateObj(data.created_at)} - {t(`types.${data.type}`)}
        </div>
        <span className="content--company">{data.organization_name}</span>
        <span className="content--applicant-name">{data.contact_name}</span>
      </div>
      <div className="mvj-application-list__item--actions">
        <button onClick={() => onItemClick(data.id)}>Muokkaa</button>
        <button onClick={null}>Luo vuokraus (tms.)</button>
      </div>
    </li>
  );
};

export default flowRight(
  translate(['applications'])
)(ApplicationListItem);
