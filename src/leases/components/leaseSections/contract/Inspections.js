// @flow
import React from 'react';
import get from 'lodash/get';
import {Row, Column} from 'react-foundation';
import classNames from 'classnames';
import {formatDate} from '../../../../util/helpers';

type Props = {
  inspections: Array<Object>,
}

const Inspections = ({inspections}: Props) => {

  return (
    <div className='lease-section'>
      {inspections &&
      <div className='green-box'>
        {inspections && inspections.map((inspection, index) =>
          <div className='section-item' key={index}>
            <Row>
              <Column medium={4}>
                <label>Tarkastaja</label>
                <p>{inspection.inspector ? get(inspection, 'inspector', '–') : '–'}</p>
              </Column>
              <Column medium={4}>
                <label>Valvonta päivämäärä</label>
                {inspection.supervision_date ? <p className={classNames({'alert': inspection.supervision_date && !inspection.supervised_date})}><i/>{formatDate(inspection.supervision_date)} </p> : <p>–</p>}
              </Column>
              <Column medium={4}>
                <label>Valvottu päivämäärä</label>
                {inspection.supervised_date ? <p className={classNames({'success': inspection.supervised_date})}><i/>{formatDate(inspection.supervised_date)}</p> : <p>–</p>}
              </Column>
            </Row>
            <Row>
              <Column medium={12}>
                <label>Selite</label>
                <p>{inspection.inspection_description ? get(inspection, 'inspection_description', '–') : '–'}</p>
              </Column>
            </Row>
          </div>)
        }
      </div>}
    </div>
  );
};

export default Inspections;
