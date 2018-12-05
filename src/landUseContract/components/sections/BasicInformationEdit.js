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
import Collapse from '$components/collapse/Collapse';
import Divider from '$components/content/Divider';
import FieldAndRemoveButtonWrapper from '$components/form/FieldAndRemoveButtonWrapper';
import FormField from '$components/form/FormField';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import RemoveButton from '$components/form/RemoveButton';
import SubTitle from '$components/content/SubTitle';
import {receiveCollapseStates, receiveFormValidFlags} from '$src/landUseContract/actions';
import {ViewModes} from '$src/enums';
import {ButtonColors} from '$components/enums';
import {DeleteModalLabels, DeleteModalTitles, FormNames} from '$src/landUseContract/enums';
import {getAttributes, getCollapseStateByKey, getIsSaveClicked} from '$src/landUseContract/selectors';
import {referenceNumber} from '$components/form/validations';

import type {Attributes} from '$src/landUseContract/types';

type AreasProps = {
  attributes: Attributes,
  fields: any,
  isSaveClicked: boolean,
}

const renderAreas = ({attributes, fields, isSaveClicked}: AreasProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <div>
            <FormTextTitle title='Kohteen tunnus' />
            {fields && !!fields.length && fields.map((field, index) => {
              const handleRemove = () => {
                dispatch({
                  type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                  confirmationFunction: () => {
                    fields.remove(index);
                  },
                  confirmationModalButtonClassName: ButtonColors.ALERT,
                  confirmationModalButtonText: 'Poista',
                  confirmationModalLabel: DeleteModalLabels.AREA,
                  confirmationModalTitle: DeleteModalTitles.AREA,
                });
              };

              return(
                <Row key={index}>
                  <Column>
                    <FieldAndRemoveButtonWrapper
                      field={
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={get(attributes, 'areas.child.children.area')}
                          invisibleLabel
                          name={`${field}.area`}
                          overrideValues={{
                            label: 'Kohde',
                          }}
                        />
                      }
                      removeButton={
                        <RemoveButton
                          className='third-level'
                          onClick={handleRemove}
                          title="Poista kohde"
                        />
                      }
                    />
                  </Column>
                </Row>
              );
            })}
            <Row>
              <Column>
                <AddButtonThird
                  label='Lisää kohde'
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
  basicInformationCollapseState: boolean,
  change: Function,
  isSaveClicked: boolean,
  receiveCollapseStates: Function,
  receiveFormValidFlags: Function,
  valid: boolean,
}

class BasicInformationEdit extends Component<Props> {
  componentDidUpdate(prevProps) {
    const {receiveFormValidFlags} = this.props;

    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [FormNames.BASIC_INFORMATION]: this.props.valid,
      });
    }
  }

  handleBasicInformationCollapseToggle = (val: boolean) => {
    const {receiveCollapseStates} = this.props;

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [FormNames.BASIC_INFORMATION]: {
          basic_information: val,
        },
      },
    });
  }

  render() {
    const {
      attributes,
      basicInformationCollapseState,
      isSaveClicked,
    } = this.props;

    return (
      <form>
        <h2>Perustiedot</h2>
        <Divider />
        <Collapse
          defaultOpen={basicInformationCollapseState !== undefined ? basicInformationCollapseState : true}
          headerTitle={<h3 className='collapse__header-title'>Perustiedot</h3>}
          onToggle={this.handleBasicInformationCollapseToggle}
        >
          <Row>
            <Column small={6} medium={4} large={2}>
              <FieldArray
                attributes={attributes}
                component={renderAreas}
                isSaveClicked={isSaveClicked}
                name='areas'
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'project_area')}
                name='project_area'
                overrideValues={{
                  label: 'Hankealue',
                }}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle title='Valmistelijat' />
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'preparer')}
                invisibleLabel
                name='preparer'
                overrideValues={{
                  fieldType: 'user',
                  label: 'Valmistelija 1',
                }}
              />
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'preparer')}
                invisibleLabel
                name='preparer2'
                overrideValues={{
                  fieldType: 'user',
                  label: 'Valmistelija 2',
                }}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'land_use_contract_type')}
                name='land_use_contract_type'
                overrideValues={{
                  label: 'Maankäyttösopimus',
                }}
              />
            </Column>
          </Row>
          <Row>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'estimated_completion_year')}
                name='estimated_completion_year'
                overrideValues={{
                  label: 'Arvioitu toteutumisvuosi',
                }}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'estimated_introduction_year')}
                name='estimated_introduction_year'
                overrideValues={{
                  label: 'Arvioitu toteutumisvuosi',
                }}
              />
            </Column>
          </Row>

          <SubTitle>Liitetiedostot</SubTitle>
          <FormText>Ei liitetiedostoja</FormText>

          <SubTitle>Asemakaavatiedot</SubTitle>
          <Row>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'plan_reference_number')}
                name='plan_reference_number'
                validate={referenceNumber}
                overrideValues={{
                  label: 'Asemakaavan diaarinumero',
                }}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'plan_number')}
                name='plan_number'
                overrideValues={{
                  label: 'Asemakaavan numero',
                }}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'state')}
                name='state'
                overrideValues={{
                  label: 'Asemakaavan käsittelyvaihe',
                }}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'plan_acceptor')}
                name='plan_acceptor'
                overrideValues={{
                  label: 'Asemakaavan hyväksyjä',
                }}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'plan_lawfulness_date')}
                name='plan_lawfulness_date'
                overrideValues={{
                  label: 'Asemakaavan lainvoimaisuuspvm',
                }}
              />
            </Column>
          </Row>
        </Collapse>
      </form>
    );
  }
}

const formName = FormNames.BASIC_INFORMATION;

export default flowRight(
  connect(
    (state) => {
      return {
        attributes: getAttributes(state),
        basicInformationCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.basic_information`),
        isSaveClicked: getIsSaveClicked(state),
      };
    },
    {
      receiveCollapseStates,
      receiveFormValidFlags,
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(BasicInformationEdit);
