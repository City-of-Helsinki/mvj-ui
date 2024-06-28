import React, { Component } from "react";
import { flowRight } from "lodash/util";
import { getFormValues, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { Column, Row } from "react-foundation";
import get from "lodash/get";
import { editAreaSearch } from "/src/areaSearch/actions";
import FormField from "/src/components/form/FormField";
import { getAttributes } from "/src/areaSearch/selectors";
import { AreaSearchFieldTitles } from "/src/areaSearch/enums";
import { FieldTypes, FormNames } from "enums";
import Button from "/src/components/button/Button";
import { ButtonColors } from "/src/components/enums";
import { getInitialAreaSearchEditForm } from "/src/areaSearch/helpers";
import ModalButtonWrapper from "/src/components/modal/ModalButtonWrapper";
import AreaSearchStatusNoteHistory from "/src/areaSearch/components/AreaSearchStatusNoteHistory";
import type { Attributes } from "types";
type OwnProps = {
  onClose: (...args: Array<any>) => any;
  onSubmit: (...args: Array<any>) => any;
  areaSearchData: Record<string, any> | null | undefined;
  ref?: any;
};
type Props = OwnProps & {
  editAreaSearch: (...args: Array<any>) => any;
  areaSearchAttributes: Attributes;
  initialize: (...args: Array<any>) => any;
  formValues: Record<string, any> | null | undefined;
};

class EditAreaSearchPreparerForm extends Component<Props> {
  firstField: any;

  componentDidUpdate(prevProps: Props) {
    const {
      areaSearchData,
      initialize
    } = this.props;

    if (areaSearchData?.id && areaSearchData.id !== prevProps.areaSearchData?.id) {
      initialize(getInitialAreaSearchEditForm(areaSearchData));
    }
  }

  setRefForFirstField = (element: any) => {
    this.firstField = element;
  };
  setFocus = () => {
    if (this.firstField) {
      this.firstField.focus();
    }
  };

  render(): React.ReactNode {
    const {
      areaSearchAttributes,
      areaSearchData,
      onSubmit,
      onClose,
      formValues
    } = this.props;
    return <form>
        <Row>
          <Column small={6} medium={4} large={4}>
            <FormField name='lessor' fieldAttributes={get(areaSearchAttributes, 'lessor')} overrideValues={{
            label: AreaSearchFieldTitles.LESSOR
          }} setRefForField={this.setRefForFirstField} />
          </Column>
          <Column small={6} medium={4} large={4}>
            <FormField name='preparer' fieldAttributes={get(areaSearchAttributes, 'preparer')} overrideValues={{
            fieldType: FieldTypes.USER,
            label: AreaSearchFieldTitles.PREPARER,
            required: false
          }} />
          </Column>
        </Row>
        <Row>
          <Column small={12} medium={12} large={12}>
            <FormField name='status_notes' fieldAttributes={get(areaSearchAttributes, 'area_search_status.children.status_notes.child.children.note')} overrideValues={{
            fieldType: FieldTypes.TEXTAREA,
            label: AreaSearchFieldTitles.STATUS_NOTES,
            required: false
          }} />
          </Column>
        </Row>
        <Row className='statusNotes'>
          <Column small={12} medium={12} large={12}>
            {areaSearchData?.area_search_status?.status_notes && areaSearchData.area_search_status.status_notes.length > 0 && <AreaSearchStatusNoteHistory statusNotes={areaSearchData.area_search_status.status_notes} />}
          </Column>
        </Row>
        <ModalButtonWrapper>
          <Button onClick={onClose} className={ButtonColors.SECONDARY} text="Peruuta" />
          <Button onClick={() => onSubmit(formValues)} text={'Tallenna'} />
        </ModalButtonWrapper>
      </form>;
  }

}

export default (flowRight(connect(state => ({
  areaSearchAttributes: getAttributes(state),
  formValues: getFormValues(FormNames.AREA_SEARCH_PREPARER)(state)
}), {
  editAreaSearch
}, null, {
  forwardRef: true
}), reduxForm({
  form: FormNames.AREA_SEARCH_PREPARER
}))(EditAreaSearchPreparerForm) as React.ComponentType<OwnProps>);