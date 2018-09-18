// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';

import FormTitleAndText from '$components/form/FormTitleAndText';
import {formatDate} from '$util/helpers';

type Props = {
  inspection: Object,
}

const InspectionItem = ({inspection}: Props) => {
  return (
    <div>
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Tarkastaja'
            text={inspection.inspector || '–'}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Valvontapvm'
            text={inspection.supervision_date ? <span><i/>{formatDate(inspection.supervision_date)}</span> : '-'}
            textClassName={(inspection.supervision_date && !inspection.supervised_date) ? 'alert' : ''}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Valvottu pvm'
            text={inspection.supervised_date ? <span><i/>{formatDate(inspection.supervised_date)}</span> : '-'}
            textClassName={inspection.supervised_date ? 'success' : ''}
          />
        </Column>
        <Column small={6} medium={12} large={6}>
          <FormTitleAndText
            title='Huomautus'
            text={inspection.description || '–'}
          />
        </Column>
      </Row>
    </div>
  );
};

export default InspectionItem;
