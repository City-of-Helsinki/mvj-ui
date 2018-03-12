// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import BoxContentWrapper from '$components/content/BoxContentWrapper';
import Button from '$components/button/Button';
import CloseButton from '$components/button/CloseButton';
import EditAbnormalDebtForm from './forms/EditAbnormalDebtForm';
import GreenBoxEdit from '$components/content/GreenBoxEdit';
import {getEditAbnormalDebtFormErrors, getEditAbnormalDebtFormValues} from './selectors';

type Props = {
  abnormalDebt: Object,
  errors: ?Object,
  newDebt: Object,
  onCancel: Function,
  onSave: Function,
  show: boolean,
}

const AbnormalDebtModalEdit = ({
  abnormalDebt,
  errors,
  newDebt,
  onCancel,
  onSave,
  show,
}: Props) => {

  if(!show) {
    return null;
  }

  return (
    <div className='billing__edit-abnormal-debt'>
      <Row>
        <Column>
          <h2>Muokkaa poikkeavaa perintää</h2>
        </Column>
      </Row>
      <GreenBoxEdit>
        <BoxContentWrapper>
          <CloseButton
            className="position-topright"
            onClick={() => onCancel()}
            title="Sulje"
          />
          <EditAbnormalDebtForm
            initialValues={{...abnormalDebt}}
          />
          <Row>
            <Column>
              <Button
                className='button-green no-margin pull-right'
                disabled={!isEmpty(errors)}
                label='Tallenna'
                onClick={() => onSave(newDebt)}
                title='Tallenna'
              />
            </Column>
          </Row>
        </BoxContentWrapper>
      </GreenBoxEdit>

    </div>
  );
};

export default flowRight(
  connect(
    (state) => {
      return {
        newDebt: getEditAbnormalDebtFormValues(state),
        errors: getEditAbnormalDebtFormErrors(state),
      };
    }
  ),
)(AbnormalDebtModalEdit);
