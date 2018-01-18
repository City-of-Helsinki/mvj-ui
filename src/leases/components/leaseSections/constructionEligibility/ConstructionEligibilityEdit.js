// @flow
import React, {Component} from 'react';
import flowRight from 'lodash/flowRight';
import {connect} from 'react-redux';
import {formValueSelector, reduxForm, Field, FieldArray} from 'redux-form';
import {capitalize} from 'lodash';
import Collapse from '../../../../components/Collapse';
import {Row, Column} from 'react-foundation';

import trashIcon from '../../../../../assets/icons/trash.svg';
import FieldTypeText from '../../../../components/form/FieldTypeText';
import FieldTypeSelect from '../../../../components/form/FieldTypeSelect';

type CommentProps = {
  fields: any,
}

const renderComments = ({fields}: CommentProps) => {
  return (
    <div>
      {fields && fields.length > 0 && fields.map((comment, index) => {
        return (
          <div key={index} className='green-box-item'>
            <button
              className='remove-button'
              type="button"
              title="Poista kommentti"
              onClick={() => fields.remove(index)}>
              <img src={trashIcon} alt='Poista' />
            </button>
            <Row>
              <Column medium={10}>
                <Field
                  label='Selitys'
                  name={`${comment}.comment`}
                  type="text"
                  component={FieldTypeText}/>
              </Column>
              <Column medium={2}>
                <Field
                  label='AHJO diaarinumero'
                  name={`${comment}.AHJO_number`}
                  type="text"
                  component={FieldTypeText}/>
              </Column>
            </Row>
          </div>
        );
      })}
      <Row>
        <Column>
          <a onClick={() => fields.push({})} className='add-button-secondary'><i /><span>Lisää selitys</span></a>
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
                    <svg className='map-icon' viewBox="0 0 30 30">
                      <path d="M28.5 2.06v21.52l-.7.28-7.88 3.37-.42.22-.42-.15-8.58-3.23-7.45 3.16-1.55.71V6.42l.7-.28 7.88-3.37.42-.22.42.15 8.58 3.23L27 2.77zM9.38 5.44L3.75 7.83v16.73l5.63-2.39zm2.24-.07V22.1l6.76 2.53V7.9zm14.63.07l-5.63 2.39v16.73l5.63-2.39z"/>
                    </svg>
                    {areas && areas.length > index && <span><span>{`${areas[index].municipality}-${areas[index].district}-${areas[index].group_number}-${areas[index].unit_number}`}</span>&nbsp;&nbsp;<span className='collapse__header-subtitle'>{`(${areas[index].explanation})`}</span></span>
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
              <div className='green-box'>
                <Row>
                  <Column>
                    <h2>ESIRAKENTAMINEN, JOHTOSIIRROT JA KUNNALLISTEKNIIKKA</h2>
                  </Column>
                </Row>
                <Row>
                  <Column medium={3}>
                    <Field
                      name={`${area}.construction_eligibility.preconstruction.research_state`}
                      component={FieldTypeSelect}
                      label='Selvitysaste'
                      options={[
                        {value: 'tarkistamatta', label: 'Tarkistamatta'},
                        {value: 'vaati_toimenpiteita', label: 'Vaati toimenpiteitä'},
                        {value: 'valmis', label: 'Valmis'},
                      ]}
                    />
                  </Column>
                </Row>
                <FieldArray name={`${area}.construction_eligibility.preconstruction.comments`} component={renderComments}/>
              </div>
              <div className='green-box'>
                <Row>
                  <Column>
                    <h2>Purku</h2>
                  </Column>
                </Row>
                <Row>
                  <Column medium={3}>
                    <Field
                      name={`${area}.construction_eligibility.demolition.research_state`}
                      component={FieldTypeSelect}
                      label='Selvitysaste'
                      options={[
                        {value: 'tarkistamatta', label: 'Tarkistamatta'},
                        {value: 'vaati_toimenpiteita', label: 'Vaati toimenpiteitä'},
                        {value: 'valmis', label: 'Valmis'},
                      ]}
                    />
                  </Column>
                </Row>
                <FieldArray name={`${area}.construction_eligibility.demolition.comments`} component={renderComments}/>
              </div>
              <div className='green-box'>
                <Row>
                  <Column>
                    <h2>Pima</h2>
                  </Column>
                </Row>
                <Row>
                  <Column medium={3}>
                    <Field
                      name={`${area}.construction_eligibility.contamination.research_state`}
                      component={FieldTypeSelect}
                      label='Selvitysaste'
                      options={[
                        {value: 'tarkistamatta', label: 'Tarkistamatta'},
                        {value: 'vaati_toimenpiteita', label: 'Vaati toimenpiteitä'},
                        {value: 'valmis', label: 'Valmis'},
                      ]}
                    />
                  </Column>
                  <Column medium={3}>
                    <Field
                      label='PrjectWise kohdenumero'
                      name={`${area}.construction_eligibility.contamination.projectwise_number`}
                      type="text"
                      component={FieldTypeText}/>
                  </Column>
                  <Column medium={3}>
                    <Field
                      label='Matti raportti'
                      name={`${area}.construction_eligibility.contamination.matti_report`}
                      type="text"
                      component={FieldTypeText}/>
                  </Column>
                </Row>
                <Row>
                  <Column medium={3}>
                    <Field
                      name={`${area}.construction_eligibility.contamination.rent_conditions`}
                      component={FieldTypeSelect}
                      label='Vuokraehdot'
                      options={[
                        {value: 'kysytty', label: 'Kysytty'},
                        {value: 'valmis', label: 'Valmis'},
                      ]}
                    />
                  </Column>
                  <Column medium={3}>
                    <Field
                      label='Päivämäärä'
                      name={`${area}.construction_eligibility.contamination.rent_condition_date`}
                      type="text"
                      component={FieldTypeText}/>
                  </Column>
                  <Column medium={3}>
                    <Field
                      label='PIMA valmistelija'
                      name={`${area}.construction_eligibility.contamination.contamination_author`}
                      type="text"
                      component={FieldTypeText}/>
                  </Column>
                </Row>
                <FieldArray name={`${area}.construction_eligibility.contamination.comments`} component={renderComments}/>
              </div>
              <div className='green-box'>
                <Row>
                  <Column>
                    <h2>Rakennettavuusselvitys</h2>
                  </Column>
                </Row>
                <Row>
                  <Column medium={3}>
                    <Field
                      name={`${area}.construction_eligibility.construction_investigation.research_state`}
                      component={FieldTypeSelect}
                      label='Selvitysaste'
                      options={[
                        {value: 'tarkistamatta', label: 'Tarkistamatta'},
                        {value: 'vaati_toimenpiteita', label: 'Vaati toimenpiteitä'},
                        {value: 'valmis', label: 'Valmis'},
                      ]}
                    />
                  </Column>
                  <Column medium={3}>
                    <Field
                      label='Geotekninen palvelun tiedosto'
                      name={`${area}.construction_eligibility.construction_investigation.geotechnical_number`}
                      type="text"
                      component={FieldTypeText}/>
                  </Column>
                </Row>
                <Row>
                  <Column medium={3}>
                    <Field
                      name={`${area}.construction_eligibility.construction_investigation.report`}
                      component={FieldTypeSelect}
                      label='Selvitys'
                      options={[
                        {value: 'not-needed', label: 'Ei tarvita'},
                        {value: 'in-progress', label: 'Tekeillä'},
                        {value: 'done', label: 'Valmis'},
                      ]}
                    />
                  </Column>
                  <Column medium={3}>
                    <Field
                      label='Allekirjoituspäivämäärä'
                      name={`${area}.construction_eligibility.construction_investigation.signing_date`}
                      type="text"
                      component={FieldTypeText}/>
                  </Column>
                  <Column medium={3}>
                    <Field
                      label='Allekirjoittaja'
                      name={`${area}.construction_eligibility.construction_investigation.report_author`}
                      type="text"
                      component={FieldTypeText}/>
                  </Column>
                </Row>
                <FieldArray name={`${area}.construction_eligibility.construction_investigation.comments`} component={renderComments}/>
              </div>
              <div className='green-box'>
                <Row>
                  <Column>
                    <h2>Muut</h2>
                  </Column>
                </Row>
                <Row>
                  <Column medium={3}>
                    <Field
                      name={`${area}.construction_eligibility.other.research_state`}
                      component={FieldTypeSelect}
                      label='Selvitysaste'
                      options={[
                        {value: 'tarkistamatta', label: 'Tarkistamatta'},
                        {value: 'vaati_toimenpiteita', label: 'Vaati toimenpiteitä'},
                        {value: 'valmis', label: 'Valmis'},
                      ]}
                    />
                  </Column>
                </Row>
                <FieldArray name={`${area}.construction_eligibility.other.comments`} component={renderComments}/>
              </div>
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
      <form onSubmit={handleSubmit} className='lease-section-edit'>
        <FieldArray areas={areas} name="areas" dispatch={dispatch} component={renderArea}/>
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
