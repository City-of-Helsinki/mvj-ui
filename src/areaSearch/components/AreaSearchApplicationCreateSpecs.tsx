import React, { Component } from "react";
import { change, getFormMeta, getFormSyncErrors, getFormValues, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { Column, Row } from "react-foundation";
import get from "lodash/get";
import { flowRight } from "lodash/util";
import Title from "@/components/content/Title";
import { FieldTypes, FormNames } from "@/enums";
import { getAttributes, getIsPerformingFileOperation, getIsSaveClicked, getIsSubmittingAreaSearchSpecs } from "@/areaSearch/selectors";
import type { Attributes } from "types";
import Authorization from "@/components/authorization/Authorization";
import FormField from "@/components/form/FormField";
import AreaSearchMap from "@/areaSearch/components/map/AreaSearchMap";
import FormFieldLabel from "@/components/form/FormFieldLabel";
import { createAreaSearchSpecs, receiveFormValidFlags } from "@/areaSearch/actions";
import AddFileButton from "@/components/form/AddFileButton";
import RemoveButton from "@/components/form/RemoveButton";
import type { UploadedFileMeta } from "@/application/types";
import { nonEmptyGeometry } from "@/areaSearch/validators";
import { startOfToday } from "date-fns";
type OwnProps = {
  onFileAdded: (...args: Array<any>) => any;
  onFileRemoved: (...args: Array<any>) => any;
  attachments: Array<UploadedFileMeta>;
};
type Props = OwnProps & {
  change: (...args: Array<any>) => any;
  touch: (...args: Array<any>) => any;
  attributes: Attributes;
  createAreaSearchSpecs: (...args: Array<any>) => any;
  isPerformingFileOperation: boolean;
  isSaveClicked: boolean;
  isSubmittingAreaSearchSpecs: boolean;
  formValues: Record<string, any>;
  receiveFormValidFlags: (...args: Array<any>) => any;
  valid: boolean;
  formMeta: Record<string, any>;
  geometryError: any;
};

class AreaSearchApplicationCreateSpecs extends Component<Props> {
  componentDidMount() {
    const {
      receiveFormValidFlags,
      valid
    } = this.props;
    receiveFormValidFlags({
      [FormNames.AREA_SEARCH_CREATE_SPECS]: valid
    });
  }

  componentDidUpdate(prevProps) {
    const {
      receiveFormValidFlags,
      valid
    } = this.props;

    if (prevProps.valid !== valid) {
      receiveFormValidFlags({
        [FormNames.AREA_SEARCH_CREATE_SPECS]: valid
      });
    }
  }

  handleFileAdded = (e: any) => {
    const {
      onFileAdded
    } = this.props;
    onFileAdded(e.target.files[0]);
  };
  handleFileRemoved = (index: number) => {
    const {
      onFileRemoved
    } = this.props;
    onFileRemoved(index);
  };

  render(): React.ReactNode {
    const {
      attributes,
      change,
      attachments,
      isPerformingFileOperation,
      isSaveClicked,
      isSubmittingAreaSearchSpecs,
      formMeta,
      touch,
      geometryError
    } = this.props;

    if (!attributes) {
      return null;
    }

    const geometryHasError = geometryError && (isSaveClicked || formMeta.geometry?.touched);
    const today = startOfToday();
    return <div className="AreaSearchApplicationCreate">
        <Title>
          Aluehaku
        </Title>

        <Row>
          <Authorization allow={true}>
            <Column small={4} medium={3} large={3}>
              <FormField disableTouched={isSaveClicked} fieldAttributes={get(attributes, 'intended_use')} name='intended_use' overrideValues={{
              label: 'Käyttötarkoitus'
            }} />
            </Column>
          </Authorization>
          <Authorization allow={true}>
            <Column small={4} medium={3} large={3}>
              <FormField disableDirty disableTouched={isSaveClicked} fieldAttributes={get(attributes, 'start_date')} name='start_date' overrideValues={{
              required: true,
              fieldType: FieldTypes.DATE,
              label: 'Vuokra-ajan alkupvm',
              read_only: false
            }} minDate={today} />
            </Column>
          </Authorization>
          <Authorization allow={true}>
            <Column small={4} medium={3} large={3}>
              <FormField disableDirty disableTouched={isSaveClicked} fieldAttributes={get(attributes, 'end_date')} name='end_date' overrideValues={{
              fieldType: FieldTypes.DATE,
              label: 'Vuokra-ajan loppupvm',
              read_only: false
            }} minDate={today} />
            </Column>
          </Authorization>
        </Row>
        <Row>
          <Authorization allow={true}>
            <Column small={12}>
              <FormField disableTouched={isSaveClicked} fieldAttributes={get(attributes, 'description_intended_use')} name='description_intended_use' overrideValues={{
              fieldType: FieldTypes.TEXTAREA,
              label: 'Käyttötarkoituksen kuvaus'
            }} />
            </Column>
          </Authorization>
        </Row>
        <Row>
          <Column small={12}>
            <FormFieldLabel required>
              Haettava alue
            </FormFieldLabel>
            <AreaSearchMap change={features => {
            change('geometry', features);
            touch('geometry');
          }} hasError={geometryHasError} />
            <FormField disableTouched={isSaveClicked} fieldAttributes={{
            type: FieldTypes.HIDDEN,
            read_only: false,
            required: false
          }} name='geometry' validate={nonEmptyGeometry} />
          </Column>
        </Row>
        <Row>
          <Authorization allow={true}>
            <Column small={12}>
              <FormField disableTouched={isSaveClicked} fieldAttributes={get(attributes, 'description_area')} name='description_area' overrideValues={{
              fieldType: FieldTypes.TEXTAREA,
              label: 'Vuokra-alueen kuvaus'
            }} />
            </Column>
          </Authorization>
        </Row>
        <Row>
          <Authorization allow={true}>
            <Column small={12} medium={4}>
              <FormFieldLabel htmlFor="areaSearchApplicationAttachments">Liitteet</FormFieldLabel>
              {attachments.length === 0 && <div>Ei lisättyjä liitteitä.</div>}
              {attachments.map(attachment => <Row key={attachment.id}>
                <Column small={8} medium={10}>
                  {attachment.name}
                </Column>
                <Column small={4} medium={2}>
                  <RemoveButton onClick={() => this.handleFileRemoved(attachment.id)} />
                </Column>
              </Row>)}
              <AddFileButton label='Lisää tiedosto' onChange={this.handleFileAdded} name="AreaSearchApplicationCreateSpecsAttachment" disabled={isPerformingFileOperation || isSubmittingAreaSearchSpecs} />
            </Column>
          </Authorization>
        </Row>
      </div>;
  }

}

export default (flowRight(connect(state => {
  return {
    attributes: getAttributes(state),
    formValues: getFormValues(FormNames.AREA_SEARCH_CREATE_SPECS)(state),
    isPerformingFileOperation: getIsPerformingFileOperation(state),
    isSaveClicked: getIsSaveClicked(state),
    isSubmittingAreaSearchSpecs: getIsSubmittingAreaSearchSpecs(state),
    formMeta: getFormMeta(FormNames.AREA_SEARCH_CREATE_SPECS)(state),
    geometryError: getFormSyncErrors(FormNames.AREA_SEARCH_CREATE_SPECS)(state)?.geometry
  };
}, {
  createAreaSearchSpecs,
  receiveFormValidFlags
}), reduxForm({
  form: FormNames.AREA_SEARCH_CREATE_SPECS,
  destroyOnUnmount: false,
  change,
  validate: values => {
    const errors: any = {};

    if (values.start_date && values.end_date && values.start_date > values.end_date) {
      errors.start_date = 'Alkupäivämäärän on oltava ennen loppupäivämäärää';
      errors.end_date = 'Loppupäivämäärän on oltava ennen alkupäivämäärää';
    }

    return errors;
  }
}))(AreaSearchApplicationCreateSpecs) as React.ComponentType<OwnProps>);