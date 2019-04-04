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
import {FormNames} from '$src/enums';
import {ButtonColors} from '$components/enums';
import {getDistrictOptions} from '$src/district/helpers';
import {getDistrictsByMunicipality} from '$src/district/selectors';
import {getAttributes} from '$src/landUseContract/selectors';

import type {Attributes} from '$src/types';
import type {DistrictList} from '$src/district/types';

type Props = {
  attributes: Attributes,
  change: Function,
  district: string,
  districts: DistrictList,
  fetchDistrictsByMunicipality: Function,
  municipality: string,
  onClose: Function,
  onSubmit: Function,
  valid: boolean,
}

class CreateLandUseContractForm extends Component<Props> {
  firstField: any

  componentDidUpdate(prevProps) {
    if(this.props.municipality !== prevProps.municipality) {
      const {change, fetchDistrictsByMunicipality} = this.props;

      if(this.props.municipality) {
        fetchDistrictsByMunicipality(this.props.municipality);
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
    this.firstField.focus();
  }

  handleCreate = () => {
    const {
      municipality,
      district,
      onSubmit,
    } = this.props;

    onSubmit({
      municipality: municipality,
      district: district,
    });
  };

  render() {
    const {
      attributes,
      districts,
      onClose,
      valid,
    } = this.props;

    const districtOptions = getDistrictOptions(districts);

    return (
      <form>
        <Row>
          <Column small={4} medium={3}>
            <FormField
              setRefForField={this.setRefForFirstField}
              fieldAttributes={get(attributes, 'municipality')}
              name='municipality'
              overrideValues={{
                label: 'Kunta',
              }}
            />
          </Column>
          <Column small={4} medium={3}>
            <FormField
              fieldAttributes={get(attributes, 'district')}
              name='district'
              overrideValues={{
                label: 'Kaupunginosa',
                options: districtOptions,
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

const formName = FormNames.LAND_USE_CONTRACT_CREATE;
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
)(CreateLandUseContractForm);
