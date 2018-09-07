// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FieldArray, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import type {Element} from 'react';

import AddButtonThird from '$components/form/AddButtonThird';
import Collapse from '$components/collapse/Collapse';
import ConfirmationModal from '$components/modal/ConfirmationModal';
import Divider from '$components/content/Divider';
import FieldAndRemoveButtonWrapper from '$components/form/FieldAndRemoveButtonWrapper';
import FormField from '$components/form/FormField';
import FormFieldLabel from '$components/form/FormFieldLabel';
import RemoveButton from '$components/form/RemoveButton';
import SubTitle from '$components/content/SubTitle';
import {receiveCollapseStates, receiveFormValidFlags} from '$src/landUseContract/actions';
import {ViewModes} from '$src/enums';
import {DeleteModalLabels, DeleteModalTitles, FormNames} from '$src/landUseContract/enums';
import {getAttributes, getCollapseStateByKey, getIsSaveClicked} from '$src/landUseContract/selectors';
import {referenceNumber} from '$components/form/validations';

import type {Attributes} from '$src/landUseContract/types';

type AreasProps = {
  attributes: Attributes,
  fields: any,
  isSaveClicked: boolean,
  onOpenDeleteModal: Function,
}

const renderAreas = ({attributes, fields, isSaveClicked, onOpenDeleteModal}: AreasProps): Element<*> => {
  const handleAdd = () => fields.push({});

  return (
    <div>
      <FormFieldLabel>Kohteet</FormFieldLabel>
      {fields && !!fields.length && fields.map((field, index) => {
        const handleOpenDeleteModal = () => {
          onOpenDeleteModal(
            () => fields.remove(index),
            DeleteModalTitles.AREA,
            DeleteModalLabels.AREA,
          );
        };

        return(
          <Row key={index}>
            <Column>
              <FieldAndRemoveButtonWrapper
                field={
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'areas.child.children.area')}
                    name={`${field}.area`}
                    overrideValues={{
                      label: '',
                    }}
                  />
                }
                removeButton={
                  <RemoveButton
                    className='third-level'
                    onClick={handleOpenDeleteModal}
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
            title='Lisää kohde'
          />
        </Column>
      </Row>
    </div>
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

type State = {
  deleteFunction: ?Function,
  deleteModalLabel: string,
  deleteModalTitle: string,
  isDeleteModalOpen: boolean,
}

class BasicInformationEdit extends Component<Props, State> {
  state = {
    deleteFunction: null,
    deleteModalLabel: DeleteModalLabels.AREA,
    deleteModalTitle: DeleteModalTitles.AREA,
    isDeleteModalOpen: false,
  }

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

  handleOpenDeleteModal = (fn: Function, modalTitle: string = DeleteModalTitles.CONTRACT, modalLabel: string = DeleteModalLabels.CONTRACT) => {
    this.setState({
      deleteFunction: fn,
      deleteModalLabel: modalLabel,
      deleteModalTitle: modalTitle,
      isDeleteModalOpen: true,
    });
  }

  handleHideDeleteModal = () => {
    this.setState({
      isDeleteModalOpen: false,
    });
  }

  handleDeleteClick = () => {
    const {deleteFunction} = this.state;
    if(deleteFunction) {
      deleteFunction();
    }
    this.handleHideDeleteModal();
  }

  render() {
    const {
      attributes,
      basicInformationCollapseState,
      isSaveClicked,
    } = this.props;
    const {
      deleteModalLabel,
      deleteModalTitle,
      isDeleteModalOpen,
    } = this.state;

    return (
      <div>
        <ConfirmationModal
          confirmButtonLabel='Poista'
          isOpen={isDeleteModalOpen}
          label={deleteModalLabel}
          onCancel={this.handleHideDeleteModal}
          onClose={this.handleHideDeleteModal}
          onSave={this.handleDeleteClick}
          title={deleteModalTitle}
        />

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
                  onOpenDeleteModal={this.handleOpenDeleteModal}
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
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'preparer')}
                  name='preparer'
                  overrideValues={{
                    fieldType: 'user',
                    label: 'Valmistelijat',
                  }}
                />
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'preparer')}
                  name='preparer2'
                  overrideValues={{
                    fieldType: 'user',
                    label: '',
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
            <p>Ei liitetiedostoja</p>

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
      </div>
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
