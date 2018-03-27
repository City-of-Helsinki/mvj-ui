// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import classNames from 'classnames';

import {formatDate, getFoundationBreakpoint} from '$util/helpers';

type Props = {
  inspection: Object,
}

const InspectionItem = ({inspection}: Props) => {
  const breakpoint = getFoundationBreakpoint();

  return (
    <div>
      <Row>
        <Column small={6} medium={4} large={2}>
          <label>Tarkastaja</label>
          <p className={classNames(
            {'no-margin': (breakpoint === 'xxlarge' || breakpoint === 'xlarge' || breakpoint === 'large')},
          )}>{inspection.inspector || '–'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <label>Valvonta päivämäärä</label>
          {inspection.supervision_date
            ? (
              <p className={classNames(
                {'no-margin': (breakpoint === 'xxlarge' || breakpoint === 'xlarge' || breakpoint === 'large')},
                {'alert': inspection.supervision_date && !inspection.supervised_date})}>
                <i/>
                {formatDate(inspection.supervision_date)}
              </p>
            ) : <p className={classNames(
              {'no-margin': (breakpoint === 'xxlarge' || breakpoint === 'xlarge' || breakpoint === 'large')},
            )}>–</p>
          }
        </Column>
        <Column small={6} medium={4} large={2}>
          <label>Valvottu päivämäärä</label>
          {inspection.supervised_date
            ? (
              <p className={classNames(
                {'no-margin': (breakpoint === 'xxlarge' || breakpoint === 'xlarge' || breakpoint === 'large' || breakpoint === 'small')},
                {'success': inspection.supervised_date})}>
                <i/>
                {formatDate(inspection.supervised_date)}
              </p>
            ) : <p className={classNames(
                {'no-margin': (breakpoint === 'xxlarge' || breakpoint === 'xlarge' || breakpoint === 'large' || breakpoint === 'small')}
              )}>–</p>
          }
        </Column>
        <Column small={6} medium={12} large={6}>
          <label>Selite</label>
          <p className='no-margin'>{inspection.description || '–'}</p>
        </Column>
      </Row>
    </div>
  );
};

export default InspectionItem;
