// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';

import FormText from '$components/form/FormText';
import FormTitleAndText from '$components/form/FormTitleAndText';
import {formatDate} from '$util/helpers';

type Props = {
  inspection: Object,
  largeScreen?: boolean,
}

const InspectionItem = ({inspection, largeScreen}: Props) => {
  if(largeScreen) {
    return(
      <Row>
        <Column large={2}>
          <FormText>{inspection.inspector || '–'}</FormText>
        </Column>
        <Column large={2}>
          <FormText className={(inspection.supervision_date && !inspection.supervised_date) ? 'alert' : ''}>{inspection.supervision_date ? <span><i/>{formatDate(inspection.supervision_date)}</span> : '-'}</FormText>
        </Column>
        <Column large={2}>
          <FormText className={inspection.supervised_date ? 'success' : ''}>{inspection.supervised_date ? <span><i/>{formatDate(inspection.supervised_date)}</span> : '-'}</FormText>
        </Column>
        <Column large={6}>
          <FormText>{inspection.description || '–'}</FormText>
        </Column>
      </Row>
    );
  } else {
    return (
      <Row>
        <Column small={6} medium={4}>
          <FormTitleAndText
            title='Tarkastaja'
            text={inspection.inspector || '–'}
          />
        </Column>
        <Column small={6} medium={4}>
          <FormTitleAndText
            title='Valvontapvm'
            text={inspection.supervision_date ? <span><i/>{formatDate(inspection.supervision_date)}</span> : '-'}
            textClassName={(inspection.supervision_date && !inspection.supervised_date) ? 'alert' : ''}
          />
        </Column>
        <Column small={6} medium={4}>
          <FormTitleAndText
            title='Valvottu pvm'
            text={inspection.supervised_date ? <span><i/>{formatDate(inspection.supervised_date)}</span> : '-'}
            textClassName={inspection.supervised_date ? 'success' : ''}
          />
        </Column>
        <Column small={6} medium={12}>
          <FormTitleAndText
            title='Huomautus'
            text={inspection.description || '–'}
          />
        </Column>
      </Row>
    );
  }
};

export default InspectionItem;
