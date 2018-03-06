// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {formValueSelector, reduxForm, Field, FieldArray} from 'redux-form';
import {Row, Column} from 'react-foundation';
import capitalize from 'lodash/capitalize';
import flowRight from 'lodash/flowRight';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import Collapse from '$components/collapse/Collapse';
import FieldTypeDatePicker from '$components/form/FieldTypeDatePicker';
import FieldTypeText from '$components/form/FieldTypeText';
import FieldTypeSelect from '$components/form/FieldTypeSelect';
import FormSection from '$components/form/FormSection';
import GreenBoxEdit from '$components/content/GreenBoxEdit';
import MapIcon from '$components/icons/MapIcon';
import RemoveButton from '$components/form/RemoveButton';
import {
  constructionEligibilityReportOptions,
  constructionEligibilityRentConditionsOptions,
  researchStateOptions,
} from '../../../../constants';

type CommentProps = {
  fields: any,
}

const renderComments = ({fields}: CommentProps) => {
  return (
    <div>
      {fields && fields.length > 0 && fields.map((comment, index) => {
        return (
          <div className='construction-eligibility__comment-item'  key={index}>
            <BoxContentWrapper>
              <RemoveButton
                className='position-topright-no-padding'
                onClick={() => fields.remove(index)}
                title="Poista kommentti"
              />
              <Row>
                <Column medium={9} large={10}>
                  <Field
                    className='no-margin'
                    component={FieldTypeText}
                    label='Selitys'
                    name={`${comment}.comment`}
                    type="text"
                  />
                </Column>
                <Column medium={3} large={2}>
                  <Field
                    className='no-margin'
                    component={FieldTypeText}
                    label='AHJO diaarinumero'
                    name={`${comment}.AHJO_number`}
                    type="text"
                  />
                </Column>
              </Row>
            </BoxContentWrapper>
          </div>
        );
      })}
      <Row>
        <Column>
          <AddButtonSecondary
            className='no-margin'
            label='Lisää selitys'
            onClick={() => fields.push({})}
            title='Lisää selitys'
          />
        </Column>
      </Row>
    </div>
  );
};


type AreaProps = {
  fields: any,
  areas: Array<Object>,
}

const renderArea = ({fields, areas}: AreaProps) => {
  return (
    <div>
      {fields && fields.length > 0 && fields.map((area, index) => {
        return (
          <div key={index}>
            <Collapse
              defaultOpen={true}
              header={
                <Row>
                  <Column medium={4} className='collapse__header-title'>
                    <MapIcon />
                    {areas && areas.length > index &&
                      <span>
                        <span>{`${areas[index].municipality}-${areas[index].district}-${areas[index].group_number}-${areas[index].unit_number}`}</span>
                        &nbsp;&nbsp;
                        <span className='collapse__header-subtitle'>{`(${areas[index].explanation})`}</span>
                      </span>
                    }
                  </Column>
                  <Column medium={4} className='collapse__header-subtitle'>
                    {areas && areas.length > index &&  <span>{`${capitalize(areas[index].address)}, ${areas[index].zip_code} ${capitalize(areas[index].town)}`}</span>}
                  </Column>
                  <Column medium={4} className='collapse__header-subtitle'>
                    {areas && areas.length > index &&  <span>{areas[index].full_area} m<sup>2</sup> / {capitalize(areas[index].position)}</span>}
                  </Column>
                </Row>
              }
            >
              <GreenBoxEdit>
                <h2>Esirakentaminen, johtosiirrot ja kunnallistekniikka</h2>
                <Row>
                  <Column medium={3} large={2}>
                    <Field
                      component={FieldTypeSelect}
                      label='Selvitysaste'
                      name={`${area}.construction_eligibility.preconstruction.research_state`}
                      options={researchStateOptions}
                    />
                  </Column>
                </Row>
                <FieldArray name={`${area}.construction_eligibility.preconstruction.comments`} component={renderComments}/>
              </GreenBoxEdit>

              <GreenBoxEdit>
                <h2>Purku</h2>
                <Row>
                  <Column medium={3} large={2}>
                    <Field
                      component={FieldTypeSelect}
                      label='Selvitysaste'
                      name={`${area}.construction_eligibility.demolition.research_state`}
                      options={researchStateOptions}
                    />
                  </Column>
                </Row>
                <FieldArray name={`${area}.construction_eligibility.demolition.comments`} component={renderComments}/>
              </GreenBoxEdit>

              <GreenBoxEdit>
                <h2>Pima</h2>
                <Row>
                  <Column medium={3} large={2}>
                    <Field
                      component={FieldTypeSelect}
                      label='Selvitysaste'
                      name={`${area}.construction_eligibility.contamination.research_state`}
                      options={researchStateOptions}
                    />
                  </Column>
                  <Column medium={3} large={2}>
                    <Field
                      component={FieldTypeSelect}
                      label='Vuokraehdot'
                      name={`${area}.construction_eligibility.contamination.rent_conditions`}
                      options={constructionEligibilityRentConditionsOptions}
                    />
                  </Column>
                  <Column medium={3} large={2}>
                    <Field
                      component={FieldTypeDatePicker}
                      label='Päivämäärä'
                      name={`${area}.construction_eligibility.contamination.rent_condition_date`}
                      type="text"
                    />
                  </Column>
                  <Column medium={3} large={2}>
                    <Field
                      component={FieldTypeText}
                      label='PIMA valmistelija'
                      name={`${area}.construction_eligibility.contamination.contamination_author`}
                      type="text"
                    />
                  </Column>
                  <Column medium={3} large={2}>
                    <Field
                      component={FieldTypeText}
                      label='ProjectWise kohdenumero'
                      name={`${area}.construction_eligibility.contamination.projectwise_number`}
                      type="text"
                    />
                  </Column>
                  <Column medium={3} large={2}>
                    <Field
                      component={FieldTypeText}
                      label='Matti raportti'
                      name={`${area}.construction_eligibility.contamination.matti_report`}
                      type="text"
                    />
                  </Column>
                </Row>
                <FieldArray name={`${area}.construction_eligibility.contamination.comments`} component={renderComments}/>
              </GreenBoxEdit>

              <GreenBoxEdit>
                <h2>Rakennettavuusselvitys</h2>
                <Row>
                  <Column medium={3} large={2}>
                    <Field
                      component={FieldTypeSelect}
                      label='Selvitysaste'
                      name={`${area}.construction_eligibility.construction_investigation.research_state`}
                      options={researchStateOptions}
                    />
                  </Column>
                  <Column medium={3} large={2}>
                    <Field
                      component={FieldTypeSelect}
                      label='Selvitys'
                      name={`${area}.construction_eligibility.construction_investigation.report`}
                      options={constructionEligibilityReportOptions}
                    />
                  </Column>
                  <Column medium={3} large={2}>
                    <Field
                      component={FieldTypeDatePicker}
                      label='Allekirjoituspäivämäärä'
                      name={`${area}.construction_eligibility.construction_investigation.signing_date`}
                      type="text"
                    />
                  </Column>
                  <Column medium={3} large={2}>
                    <Field
                      component={FieldTypeText}
                      label='Allekirjoittaja'
                      name={`${area}.construction_eligibility.construction_investigation.report_author`}
                      type="text"
                    />
                  </Column>
                  <Column medium={3} large={2}>
                    <Field
                      component={FieldTypeText}
                      label='Geotekninen palvelun tiedosto'
                      name={`${area}.construction_eligibility.construction_investigation.geotechnical_number`}
                      type="text"
                    />
                  </Column>
                </Row>
                <FieldArray name={`${area}.construction_eligibility.construction_investigation.comments`} component={renderComments}/>
              </GreenBoxEdit>

              <GreenBoxEdit>
                <h2>Muut</h2>
                <Row>
                  <Column medium={3}>
                    <Field
                      component={FieldTypeSelect}
                      label='Selvitysaste'
                      name={`${area}.construction_eligibility.other.research_state`}
                      options={researchStateOptions}
                    />
                  </Column>
                </Row>
                <FieldArray name={`${area}.construction_eligibility.other.comments`} component={renderComments}/>
              </GreenBoxEdit>
            </Collapse>
          </div>
        );
      })}
    </div>
  );
};

type Props = {
  handleSubmit: Function,
  dispatch: Function,
  areas: Array<Object>,
}

class ConstructionEligibilityEdit extends Component {
  props: Props

  render () {
    const {handleSubmit, dispatch, areas} = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <FormSection>
          <FieldArray
            areas={areas}
            component={renderArea}
            dispatch={dispatch}
            name="areas" />
        </FormSection>
      </form>
    );
  }
}

const formName = 'eligibility-edit-form';
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state) => {
      return {
        areas: selector(state, 'areas'),
      };
    }
  ),
  reduxForm({
    form: formName,
  }),
)(ConstructionEligibilityEdit);
