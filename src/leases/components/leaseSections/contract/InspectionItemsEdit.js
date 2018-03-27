// @flow
import React from 'react';
import classNames from 'classnames';
import {Field} from 'redux-form';
import {Row, Column} from 'react-foundation';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import FieldTypeDatePicker from '$components/form/FieldTypeDatePicker';
import FieldTypeText from '$components/form/FieldTypeText';
import GreenBoxEdit from '$components/content/GreenBoxEdit';
import GreenBoxItem from '$components/content/GreenBoxItem';
import RemoveButton from '$components/form/RemoveButton';
import {getFoundationBreakpoint} from '$src/util/helpers';

type Props = {
  fields: any,
}

const InspectionItemsEdit = ({fields}: Props) => {
  const breakpoint = getFoundationBreakpoint();
  return(
    <GreenBoxEdit>
      {fields && fields.length > 0 && fields.map((inspection, index) =>
        <GreenBoxItem className='no-border-on-first-child' key={index}>
          <BoxContentWrapper>
            <RemoveButton
              className='position-topright-no-padding'
              onClick={() => fields.remove(index)}
              title="Poista tarkastus"
            />
            <Row>
              <Column small={6} medium={4} large={2}>
                <Field
                  className={classNames(
                     {'no-margin': (breakpoint === 'xxlarge' || breakpoint === 'xlarge' || breakpoint === 'large')}
                   )}
                  component={FieldTypeText}
                  label='Tarkastaja'
                  name={`${inspection}.inspector`}
                />
              </Column>
              <Column small={6} medium={4} large={2}>
                <Field
                  className={classNames(
                     {'no-margin': (breakpoint === 'xxlarge' || breakpoint === 'xlarge' || breakpoint === 'large')}
                   )}
                  component={FieldTypeDatePicker}
                  label='Valvonta päivämäärä'
                  name={`${inspection}.supervision_date`}
                />
              </Column>
              <Column small={6} medium={4} large={2}>
                <Field
                  className={classNames(
                     {'no-margin': (breakpoint === 'xxlarge' || breakpoint === 'xlarge' || breakpoint === 'large' || breakpoint === 'small')}
                   )}
                  component={FieldTypeDatePicker}
                  label='Valvottu päivämäärä'
                  name={`${inspection}.supervised_date`}
                />
              </Column>
              <Column small={6} medium={12} large={6}>
                <Field
                  className='no-margin'
                  component={FieldTypeText}
                  label='Selite'
                  name={`${inspection}.description`}
                />
              </Column>
            </Row>
          </BoxContentWrapper>
        </GreenBoxItem>
      )}
      <Row>
        <Column>
          <AddButtonSecondary
            className='no-margin'
            label='Lisää tarkastus'
            onClick={() => fields.push({})}
            title='Lisää tarkastus'
          />
        </Column>
      </Row>
    </GreenBoxEdit>
  );
};

export default InspectionItemsEdit;
