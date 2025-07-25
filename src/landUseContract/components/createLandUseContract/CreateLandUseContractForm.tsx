import React, { Component } from "react";
import { connect } from "react-redux";
import { change, formValueSelector, reduxForm } from "redux-form";
import { Row, Column } from "react-foundation";
import flowRight from "lodash/flowRight";
import get from "lodash/get";
import { getDistrictsByMunicipality } from "@/district/selectors";
import Button from "@/components/button/Button";
import FormFieldLegacy from "@/components/form/FormFieldLegacy";
import ModalButtonWrapper from "@/components/modal/ModalButtonWrapper";
import { fetchDistrictsByMunicipality } from "@/district/actions";
import { FormNames } from "@/enums";
import { ButtonColors } from "@/components/enums";
import { getAttributes } from "@/landUseContract/selectors";
import { getDistrictOptions } from "@/district/helpers";
import { getFieldOptions } from "@/util/helpers";
import type { Attributes } from "types";
import type { DistrictList } from "@/district/types";
type Props = {
  attributes: Attributes;
  change: (...args: Array<any>) => any;
  district: string;
  districts: DistrictList;
  fetchDistrictsByMunicipality: (...args: Array<any>) => any;
  municipality: string;
  onClose: (...args: Array<any>) => any;
  onSubmit: (...args: Array<any>) => any;
  valid: boolean;
  definition: string;
  status: string;
  type: string;
};

class CreateLandUseContractForm extends Component<Props> {
  firstField: any;

  componentDidUpdate(prevProps) {
    if (this.props.municipality !== prevProps.municipality) {
      const { change, fetchDistrictsByMunicipality } = this.props;

      if (this.props.municipality) {
        fetchDistrictsByMunicipality(this.props.municipality);
        change("district", "");
      } else {
        change("district", "");
      }
    }
  }

  setRefForFirstField = (element: any) => {
    this.firstField = element;
  };
  setFocus = () => {
    this.firstField.focus();
  };
  handleCreate = () => {
    const { municipality, district, onSubmit, definition, status, type } =
      this.props;
    onSubmit({
      municipality: municipality,
      district: district,
      definition: definition,
      status: status,
      type: type,
    });
  };

  render() {
    const { attributes, districts, onClose, valid } = this.props;
    const districtOptions = getDistrictOptions(districts);
    const municipalityOptions = getFieldOptions(attributes, "municipality");
    return (
      <form>
        <Row>
          <Column small={4}>
            <FormFieldLegacy
              setRefForField={this.setRefForFirstField}
              fieldAttributes={get(attributes, "municipality")}
              name="municipality"
              overrideValues={{
                // label: 'Kunta',
                options: municipalityOptions,
              }}
            />
          </Column>
          <Column small={4}>
            <FormFieldLegacy
              fieldAttributes={get(attributes, "district")}
              name="district"
              overrideValues={{
                // label: 'Kaupunginosa',
                options: districtOptions,
              }}
            />
          </Column>
          <Column small={4}>
            <FormFieldLegacy
              fieldAttributes={get(attributes, "status")}
              name="status"
            />
          </Column>
          <Column small={4}>
            <FormFieldLegacy
              fieldAttributes={get(attributes, "type")}
              name="type"
            />
          </Column>
        </Row>
        <ModalButtonWrapper>
          <Button
            className={ButtonColors.SECONDARY}
            onClick={onClose}
            text="Peruuta"
          />
          <Button
            className={ButtonColors.SUCCESS}
            disabled={!valid}
            onClick={this.handleCreate}
            text="Luo tunnus"
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
      const municipality = selector(state, "municipality");
      return {
        attributes: getAttributes(state),
        district: selector(state, "district"),
        status: selector(state, "status"),
        type: selector(state, "type"),
        definition: selector(state, "definition"),
        districts: getDistrictsByMunicipality(state, municipality),
        municipality: municipality,
      };
    },
    {
      change,
      fetchDistrictsByMunicipality,
    },
    null,
    {
      forwardRef: true,
    },
  ),
  reduxForm({
    form: formName,
  }),
)(CreateLandUseContractForm) as React.ComponentType<any>;
