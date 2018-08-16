// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import classNames from 'classnames';

import FormFieldLabel from '$components/form/FormFieldLabel';
import {formatDate} from '$util/helpers';

type Props = {
  inspection: Object,
}

const InspectionItem = ({inspection}: Props) => {
  return (
    <div>
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormFieldLabel>Tarkastaja</FormFieldLabel>
          <p>{inspection.inspector || '–'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormFieldLabel>Valvontapvm</FormFieldLabel>
          {inspection.supervision_date
            ? (
              <p className={classNames({'alert': inspection.supervision_date && !inspection.supervised_date})}>
                <i/>
                {formatDate(inspection.supervision_date)}
              </p>
            ) : <p>–</p>
          }
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormFieldLabel>Valvottu pvm</FormFieldLabel>
          {inspection.supervised_date
            ? (
              <p className={classNames({'success': inspection.supervised_date})}>
                <i/>
                {formatDate(inspection.supervised_date)}
              </p>
            ) : <p>–</p>
          }
        </Column>
        <Column small={6} medium={12} large={6}>
          <FormFieldLabel>Huomautus</FormFieldLabel>
          <p>{inspection.description || '–'}</p>
        </Column>
      </Row>
    </div>
  );
};

export default InspectionItem;
