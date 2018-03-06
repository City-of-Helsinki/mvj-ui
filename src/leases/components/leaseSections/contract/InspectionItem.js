// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import classNames from 'classnames';

import {formatDate} from '$util/helpers';

type Props = {
  inspection: Object,
}

const InspectionItem = ({inspection}: Props) => {
  return (
    <div>
      <Row>
        <Column medium={4}>
          <label>Tarkastaja</label>
          <p>{inspection.inspector || '–'}</p>
        </Column>
        <Column medium={4}>
          <label>Valvonta päivämäärä</label>
          {inspection.supervision_date
            ? (
              <p className={classNames({'alert': inspection.supervision_date && !inspection.supervised_date})}>
                <i/>
                {formatDate(inspection.supervision_date)}
              </p>
            ) : <p>–</p>
          }
        </Column>
        <Column medium={4}>
          <label>Valvottu päivämäärä</label>
          {inspection.supervised_date
            ? (
              <p className={classNames({'success': inspection.supervised_date})}>
                <i/>
                {formatDate(inspection.supervised_date)}
              </p>
            ) : <p>–</p>
          }
        </Column>
      </Row>
      <Row>
        <Column medium={12}>
          <label>Selite</label>
          <p className='no-margin'>{inspection.inspection_description || '–'}</p>
        </Column>
      </Row>
    </div>
  );
};

export default InspectionItem;
