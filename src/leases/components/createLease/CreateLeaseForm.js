// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {change, formValueSelector, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import Button from '$components/button/Button';
import FormField from '$components/form/FormField';
import ModalButtonWrapper from '$components/modal/ModalButtonWrapper';
import {fetchDistrictsByMunicipality} from '$src/district/actions';
import {ButtonColors} from '$components/enums';
import {Classification, FormNames} from '$src/leases/enums';
import {filterSelectOptionByLabel} from '$components/form/filter';
import {getDistrictOptions} from '$src/district/helpers';
import {getDistrictsByMunicipality} from '$src/district/selectors';
import {getAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/types';
import type {DistrictList} from '$src/district/types';


type Props = {
  attributes: Attributes,
  change: Function,
  district: string,
  districts: DistrictList,
  fetchDistrictsByMunicipality: Function,
  handleSubmit: Function,
  municipality: string,
  note: string,
  onClose: Function,
  onSubmit: Function,
  reference_number: string,
  setRefForFirstField?: Function,
  state: string,
  type: string,
  valid: boolean,
}

class CreateLeaseForm extends Component<Props> {
  firstField: any

  componentWillReceiveProps(nextProps) {
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
      state,
      type,
      municipality,
      district,
      reference_number,
      note,
      onSubmit,
    } = this.props;

    onSubmit({
      state: state,
      type: type,
      municipality: municipality,
      district: district,
      reference_number: reference_number,
      note: note,
      classification: Classification.PUBLIC,
    });
  };

  render() {
    const {
      attributes,
      districts,
      handleSubmit,
      onClose,
      valid,
    } = this.props;

    const districtOptions = getDistrictOptions(districts);

    return (
      <form onSubmit={handleSubmit}>
        <Row>
          <Column small={4} medium={3}>
            <FormField
              fieldAttributes={get(attributes, 'state')}
              name='state'
              setRefForField={this.setRefForFirstField}
              overrideValues={{
                label: 'Tyyppi',
              }}
            />
          </Column>
        </Row>
        <Row>
          <Column small={4} medium={3}>
            <FormField
              fieldAttributes={get(attributes, 'type')}
              name={'type'}
              overrideValues={{
                label: 'Vuokrauksen laji',
              }}
            />
          </Column>
          <Column small={4} medium={3}>
            <FormField
              fieldAttributes={get(attributes, 'municipality')}
              filterOption={filterSelectOptionByLabel}
              name='municipality'
              overrideValues={{
                label: 'Kunta',
              }}
            />
          </Column>
          <Column small={4} medium={3}>
            <FormField
              fieldAttributes={get(attributes, 'district')}
              filterOption={filterSelectOptionByLabel}
              name='district'
              overrideValues={{
                label: 'Kaupunginosa',
                options: districtOptions,
              }}
            />
          </Column>
        </Row>
        <Row>
          <Column small={4} medium={3}>
            <FormField
              fieldAttributes={get(attributes, 'reference_number')}
              name='reference_number'
              overrideValues={{
                label: 'Diaarinumero',
              }}
            />
          </Column>
          <Column small={8} medium={6}>
            <FormField
              fieldAttributes={get(attributes, 'note')}
              name='note'
              overrideValues={{
                label: 'Huomautus',
              }}
            />
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
        attributes: getAttributes(state),
        district: selector(state, 'district'),
        districts: getDistrictsByMunicipality(state, municipality),
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
    {withRef: true}
  ),
  reduxForm({
    form: formName,
  }),
)(CreateLeaseForm);
