// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {change, formValueSelector, getFormValues, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';

import Authorization from '$components/authorization/Authorization';
import Button from '$components/button/Button';
import FormField from '$components/form/FormField';
import ModalButtonWrapper from '$components/modal/ModalButtonWrapper';
import {fetchDistrictsByMunicipality} from '$src/district/actions';
import {ButtonColors, FieldTypes} from '$components/enums';
import {FormNames, LeaseFieldPaths, LeaseFieldTitles} from '$src/leases/enums';
import {filterOptionsByLabel} from '$components/form/filter';
import {getDistrictOptions} from '$src/district/helpers';
import {getPayloadCreateLease} from '$src/leases/helpers';
import {getFieldAttributes, isFieldAllowedToEdit} from '$util/helpers';
import {getDistrictsByMunicipality} from '$src/district/selectors';
import {getAttributes as getLeaseAttributes} from '$src/leases/selectors';
import {referenceNumber} from '$components/form/validations';

import type {Attributes} from '$src/types';
import type {DistrictList} from '$src/district/types';


type Props = {
  change: Function,
  districts: DistrictList,
  fetchDistrictsByMunicipality: Function,
  formValues: Object,
  handleSubmit: Function,
  leaseAttributes: Attributes,
  municipality: string,
  onClose: Function,
  onSubmit: Function,
  setRefForFirstField?: Function,
  valid: boolean,
}

class CreateLeaseForm extends Component<Props> {
  firstField: any

  UNSAFE_componentWillReceiveProps(nextProps) {
    if(this.props.municipality !== nextProps.municipality) {
      const {change, fetchDistrictsByMunicipality} = this.props;

      if(nextProps.municipality) {
        fetchDistrictsByMunicipality(nextProps.municipality);
        change('district', '');
      } else {
        change('district', '');
      }
    }
  }

  setRefForFirstField = (element: any) => {
    this.firstField = element;
  }

  setFocus = () => {
    if(this.firstField) {
      this.firstField.focus();
    }
  }

  handleCreate = () => {
    const {
      formValues,
      onSubmit,
    } = this.props;

    onSubmit(getPayloadCreateLease(formValues));
  };

  render() {
    const {
      districts,
      handleSubmit,
      leaseAttributes,
      onClose,
      valid,
    } = this.props;

    const districtOptions = getDistrictOptions(districts);

    return (
      <form onSubmit={handleSubmit}>
        <Row>
          <Column small={4} medium={3}>
            <Authorization allow={isFieldAllowedToEdit(leaseAttributes, LeaseFieldPaths.STATE)}>
              <FormField
                fieldAttributes={getFieldAttributes(leaseAttributes, LeaseFieldPaths.STATE)}
                name='state'
                setRefForField={this.setRefForFirstField}
                overrideValues={{label: LeaseFieldTitles.STATE}}
              />
            </Authorization>
          </Column>
        </Row>
        <Row>
          <Column small={4} medium={3}>
            <Authorization allow={isFieldAllowedToEdit(leaseAttributes, LeaseFieldPaths.TYPE)}>
              <FormField
                fieldAttributes={getFieldAttributes(leaseAttributes, LeaseFieldPaths.TYPE)}
                name='type'
                overrideValues={{label: LeaseFieldTitles.TYPE}}
              />
            </Authorization>
          </Column>
          <Column small={4} medium={3}>
            <Authorization allow={isFieldAllowedToEdit(leaseAttributes, LeaseFieldPaths.MUNICIPALITY)}>
              <FormField
                fieldAttributes={getFieldAttributes(leaseAttributes, LeaseFieldPaths.MUNICIPALITY)}
                name='municipality'
                overrideValues={{label: LeaseFieldTitles.MUNICIPALITY}}
              />
            </Authorization>
          </Column>
          <Column small={4} medium={3}>
            <Authorization allow={isFieldAllowedToEdit(leaseAttributes, LeaseFieldPaths.DISTRICT)}>
              <FormField
                fieldAttributes={getFieldAttributes(leaseAttributes, LeaseFieldPaths.DISTRICT)}
                filterOption={filterOptionsByLabel}
                name='district'
                overrideValues={{
                  label: LeaseFieldTitles.DISTRICT,
                  options: districtOptions,
                }}
              />
            </Authorization>
          </Column>
        </Row>
        <Row>
          <Column small={4} medium={3}>
            <Authorization allow={isFieldAllowedToEdit(leaseAttributes, LeaseFieldPaths.REFERENCE_NUMBER)}>
              <FormField
                fieldAttributes={getFieldAttributes(leaseAttributes, LeaseFieldPaths.REFERENCE_NUMBER)}
                name='reference_number'
                validate={referenceNumber}
                overrideValues={{label: LeaseFieldTitles.REFERENCE_NUMBER}}
              />
            </Authorization>
          </Column>
          <Column small={8} medium={6}>
            <Authorization allow={isFieldAllowedToEdit(leaseAttributes, LeaseFieldPaths.NOTE)}>
              <FormField
                fieldAttributes={getFieldAttributes(leaseAttributes, LeaseFieldPaths.NOTE)}
                name='note'
                overrideValues={{label: LeaseFieldTitles.NOTE}}
              />
            </Authorization>
          </Column>
        </Row>
        <Row>
          <Column small={4} medium={3}>
            <Authorization allow={isFieldAllowedToEdit(leaseAttributes, LeaseFieldPaths.RELATE_TO)}>
              <FormField
                fieldAttributes={getFieldAttributes(leaseAttributes, LeaseFieldPaths.RELATE_TO)}
                name='relate_to'
                overrideValues={{
                  fieldType: FieldTypes.LEASE,
                  label: LeaseFieldTitles.RELATE_TO,
                }}
              />
            </Authorization>
          </Column>
        </Row>

        <ModalButtonWrapper>
          <Button
            className={ButtonColors.SECONDARY}
            onClick={onClose}
            text='Peruuta'
          />
          <Button
            className={ButtonColors.SUCCESS}
            disabled={!valid}
            onClick={this.handleCreate}
            text='Luo tunnus'
          />
        </ModalButtonWrapper>
      </form>
    );
  }
}

const formName = FormNames.CREATE_LEASE;
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state) => {
      const municipality = selector(state, 'municipality');

      return {
        formValues: getFormValues(formName)(state),
        district: selector(state, 'district'),
        districts: getDistrictsByMunicipality(state, municipality),
        leaseAttributes: getLeaseAttributes(state),
        municipality: municipality,
        note: selector(state, 'note'),
        reference_number: selector(state, 'reference_number'),
        state: selector(state, 'state'),
        type: selector(state, 'type'),
      };
    },
    {
      change,
      fetchDistrictsByMunicipality,
    },
    null,
    {forwardRef: true}
  ),
  reduxForm({
    form: formName,
  }),
)(CreateLeaseForm);
