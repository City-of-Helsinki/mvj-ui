// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';

import {FieldArray, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import type {Element} from 'react';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import FormField from '$components/form/FormField';
import FormFieldLabel from '$components/form/FormFieldLabel';
import GreenBox from '$components/content/GreenBox';
import RemoveButton from '../../../components/form/RemoveButton';
import {receiveFormValidFlags} from '$src/landUseContract/actions';
import {FormNames} from '$src/landUseContract/enums';
import {getAttributes, getIsSaveClicked} from '$src/landUseContract/selectors';

import type {Attributes} from '$src/landUseContract/types';

type InvoicesProps = {
  attributes: Attributes,
  errors: ?Object,
  fields: any,
  isSaveClicked: boolean,
}

const renderInvoices = ({attributes, fields, isSaveClicked}: InvoicesProps): Element<*> =>
  <div>
    {!fields || !fields.length && <p>Ei laskuja</p>}
    {fields && !!fields.length &&
      <div>
        <Row>
          <Column small={3} large={2}><FormFieldLabel>Määrä</FormFieldLabel></Column>
          <Column small={3} large={2}><FormFieldLabel>Eräpäivä</FormFieldLabel></Column>
          <Column small={2} large={2}><FormFieldLabel>Lähetetty pvm</FormFieldLabel></Column>
          <Column small={2} large={2}><FormFieldLabel>Maksettu pvm</FormFieldLabel></Column>
        </Row>
        {fields.map((invoice, index) => {
          return (
            <Row key={index}>
              <Column small={3} large={2}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'invoices.child.children.amount')}
                  name={`${invoice}.amount`}
                  unit='€'
                  overrideValues={{
                    label: '',
                  }}
                />
              </Column>
              <Column small={3} large={2}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'invoices.child.children.due_date')}
                  name={`${invoice}.due_date`}
                  overrideValues={{
                    label: '',
                  }}
                />
              </Column>
              <Column small={2} large={2}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'invoices.child.children.sent_date')}
                  name={`${invoice}.sent_date`}
                  overrideValues={{
                    label: '',
                  }}
                />
              </Column>
              <Column small={2} large={2}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'invoices.child.children.paid_date')}
                  name={`${invoice}.paid_date`}
                  overrideValues={{
                    label: '',
                  }}
                />
              </Column>
              <Column>
                <RemoveButton
                  onClick={() => fields.remove(index)}
                  title="Poista sopimus"
                />
              </Column>
            </Row>
          );
        })}
      </div>
    }

    <Row>
      <Column>
        <AddButtonSecondary
          label='Lisää lasku'
          onClick={() => fields.push({})}
          title='Lisää lasku'
        />
      </Column>
    </Row>
  </div>;

type Props = {
  attributes: Attributes,
  isSaveClicked: boolean,
  receiveFormValidFlags: Function,
  valid: boolean,
}

class InvoicesEdit extends Component<Props> {
  componentDidUpdate(prevProps) {
    const {receiveFormValidFlags} = this.props;

    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [FormNames.CONTRACTS]: this.props.valid,
      });
    }
  }

  render() {
    const {attributes, isSaveClicked} = this.props;

    return (
      <form>
        <GreenBox>
          <FieldArray
            attributes={attributes}
            component={renderInvoices}
            isSaveClicked={isSaveClicked}
            name="invoices"
          />
        </GreenBox>
      </form>
    );
  }
}

const formName = FormNames.INVOICES;

export default flowRight(
  connect(
    (state) => {
      return {
        attributes: getAttributes(state),
        isSaveClicked: getIsSaveClicked(state),
      };
    },
    {
      receiveFormValidFlags,
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  })
)(InvoicesEdit);
