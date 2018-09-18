// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';

import {FieldArray, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import type {Element} from 'react';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButtonThird from '$components/form/AddButtonThird';
import FieldAndRemoveButtonWrapper from '$components/form/FieldAndRemoveButtonWrapper';
import FormField from '$components/form/FormField';
import FormTextTitle from '$components/form/FormTextTitle';
import GreenBox from '$components/content/GreenBox';
import RemoveButton from '../../../components/form/RemoveButton';
import {receiveFormValidFlags} from '$src/landUseContract/actions';
import {DeleteModalLabels, DeleteModalTitles, FormNames} from '$src/landUseContract/enums';
import {getAttributes, getIsSaveClicked} from '$src/landUseContract/selectors';

import type {Attributes} from '$src/landUseContract/types';

type InvoicesProps = {
  attributes: Attributes,
  errors: ?Object,
  fields: any,
  isSaveClicked: boolean,
}

const renderInvoices = ({attributes, fields, isSaveClicked}: InvoicesProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  return(
    <AppConsumer>
      {({dispatch}) => {
        return(
          <div>
            {!fields || !fields.length && <p>Ei laskuja</p>}
            {fields && !!fields.length &&
              <div>
                <Row>
                  <Column small={3} large={2}><FormTextTitle title='Määrä' /></Column>
                  <Column small={3} large={2}><FormTextTitle title='Eräpäivä' /></Column>
                  <Column small={3} large={2}><FormTextTitle title='Lähetetty pvm' /></Column>
                  <Column small={3} large={2}><FormTextTitle title='Maksettu pvm' /></Column>
                </Row>
                {fields.map((invoice, index) => {
                  const handleRemove = () => {
                    dispatch({
                      type: ActionTypes.SHOW_DELETE_MODAL,
                      deleteFunction: () => {
                        fields.remove(index);
                      },
                      deleteModalLabel: DeleteModalLabels.INVOICE,
                      deleteModalTitle: DeleteModalTitles.INVOICE,
                    });
                  };

                  return (
                    <Row key={index}>
                      <Column small={3} large={2}>
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={get(attributes, 'invoices.child.children.amount')}
                          invisibleLabel
                          name={`${invoice}.amount`}
                          unit='€'
                        />
                      </Column>
                      <Column small={3} large={2}>
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={get(attributes, 'invoices.child.children.due_date')}
                          invisibleLabel
                          name={`${invoice}.due_date`}
                        />
                      </Column>
                      <Column small={3} large={2}>
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={get(attributes, 'invoices.child.children.sent_date')}
                          invisibleLabel
                          name={`${invoice}.sent_date`}
                        />
                      </Column>
                      <Column small={3} large={2}>
                        <FieldAndRemoveButtonWrapper
                          field={
                            <FormField
                              disableTouched={isSaveClicked}
                              fieldAttributes={get(attributes, 'invoices.child.children.paid_date')}
                              invisibleLabel
                              name={`${invoice}.paid_date`}
                            />
                          }
                          removeButton={
                            <RemoveButton
                              className='third-level'
                              onClick={handleRemove}
                              title="Poista sopimus"
                            />
                          }
                        />
                      </Column>
                    </Row>
                  );
                })}
              </div>
            }

            <Row>
              <Column>
                <AddButtonThird
                  label='Lisää lasku'
                  onClick={handleAdd}
                />
              </Column>
            </Row>
          </div>
        );
      }}
    </AppConsumer>
  );
};

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
