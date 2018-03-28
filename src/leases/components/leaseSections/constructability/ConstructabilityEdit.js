// @flow
import React, {Component} from 'react';
import {reduxForm, Field, FieldArray} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';

import {getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';
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

import type {Attributes} from '$src/leases/types';
import type {UserList} from '$src/users/types';

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
                    name={`${comment}.text`}
                  />
                </Column>
                <Column medium={3} large={2}>
                  <Field
                    className='no-margin'
                    component={FieldTypeText}
                    label='AHJO diaarinumero'
                    name={`${comment}.ahjo_reference_number`}
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
  areas: Array<Object>,
  attributes: Attributes,
  fields: any,
  users: UserList,
}

const renderAreas = ({
  areas,
  attributes,
  fields,
  users,
}: AreaProps) => {
  const getFullAddress = (item: Object) => {
    return `${item.address}, ${item.postal_code} ${item.city}`;
  };
  const getUserOptions = (users: UserList) => {
    if(!users || !users.length) {
      return [];
    }
    return users.map((user) => {
      return {
        value: user.id,
        label: `${user.first_name} ${user.last_name}`,
      };
    });
  };
  const stateOptions = getAttributeFieldOptions(attributes, 'lease_areas.child.children.preconstruction_state');
  const pollutedLandConditionStateOptions = getAttributeFieldOptions(attributes, 'lease_areas.child.children.polluted_land_rent_condition_state');
  const constructabilityReportStateOptions = getAttributeFieldOptions(attributes, 'lease_areas.child.children.constructability_report_investigation_state');
  const userOptions = getUserOptions(users);
  const locationOptions = getAttributeFieldOptions(attributes, 'lease_areas.child.children.location');
  const typeOptions = getAttributeFieldOptions(attributes, 'lease_areas.child.children.type');

  return (
    <div>
      {areas && !!areas.length &&fields && !!fields.length && fields.map((area, index) => {
        return (
          <div key={area.id ? area.id : `index_${index}`}>
            <Collapse
              defaultOpen={true}
              header={
                <Row>
                  <Column medium={4} className='collapse__header-title'>
                    <MapIcon />
                    <span>
                      <span>{areas[index].identifier}</span>
                      &nbsp;&nbsp;
                      <span className='collapse__header-subtitle'>
                        {getLabelOfOption(typeOptions, areas[index].type) || '-'}
                      </span>
                    </span>
                  </Column>
                  <Column medium={4} className='collapse__header-subtitle'>
                    <span>{getFullAddress(areas[index])}</span>
                  </Column>
                  <Column medium={4} className='collapse__header-subtitle'>
                    <span>{areas[index].area || '-'} m<sup>2</sup> / {getLabelOfOption(locationOptions, areas[index].location) || '-'}</span>}
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
                      name={`${area}.preconstruction_state`}
                      options={stateOptions}
                    />
                  </Column>
                </Row>
                <FieldArray
                  name={`${area}.descriptionsPreconstruction`}
                  component={renderComments}
                />
              </GreenBoxEdit>

              <GreenBoxEdit>
                <h2>Purku</h2>
                <Row>
                  <Column medium={3} large={2}>
                    <Field
                      component={FieldTypeSelect}
                      label='Selvitysaste'
                      name={`${area}.demolition_state`}
                      options={stateOptions}
                    />
                  </Column>
                </Row>
                <FieldArray
                  component={renderComments}
                  name={`${area}.descriptionsDemolition`}
                />
              </GreenBoxEdit>

              <GreenBoxEdit>
                <h2>Pima</h2>
                <Row>
                  <Column medium={3} large={2}>
                    <Field
                      component={FieldTypeSelect}
                      label='Selvitysaste'
                      name={`${area}.polluted_land_state`}
                      options={stateOptions}
                    />
                  </Column>
                  <Column medium={3} large={2}>
                    <Field
                      component={FieldTypeSelect}
                      label='Vuokraehdot'
                      name={`${area}.polluted_land_rent_condition_state`}
                      options={pollutedLandConditionStateOptions}
                    />
                  </Column>
                  <Column medium={3} large={2}>
                    <Field
                      component={FieldTypeDatePicker}
                      label='Päivämäärä'
                      name={`${area}.polluted_land_rent_condition_date`}
                      type="text"
                    />
                  </Column>
                  <Column medium={3} large={2}>
                    <Field
                      component={FieldTypeSelect}
                      label='PIMA valmistelija'
                      name={`${area}.polluted_land_planner`}
                      options={userOptions}
                    />
                  </Column>
                  <Column medium={3} large={2}>
                    <Field
                      component={FieldTypeText}
                      label='ProjectWise kohdenumero'
                      name={`${area}.polluted_land_projectwise_number`}
                      type="text"
                    />
                  </Column>
                  <Column medium={3} large={2}>
                    <Field
                      component={FieldTypeText}
                      label='Matti raportti'
                      name={`${area}.polluted_land_matti_report_number`}
                      type="text"
                    />
                  </Column>
                </Row>
                <FieldArray
                  component={renderComments}
                  name={`${area}.descriptionsPollutedLand`}
                />
              </GreenBoxEdit>

              <GreenBoxEdit>
                <h2>Rakennettavuusselvitys</h2>
                <Row>
                  <Column medium={3} large={2}>
                    <Field
                      component={FieldTypeSelect}
                      label='Selvitysaste'
                      name={`${area}.constructability_report_state`}
                      options={stateOptions}
                    />
                  </Column>
                  <Column medium={3} large={2}>
                    <Field
                      component={FieldTypeSelect}
                      label='Selvitys'
                      name={`${area}.constructability_report_investigation_state`}
                      options={constructabilityReportStateOptions}
                    />
                  </Column>
                  <Column medium={3} large={2}>
                    <Field
                      component={FieldTypeDatePicker}
                      label='Allekirjoituspäivämäärä'
                      name={`${area}.constructability_report_signing_date`}
                      type="text"
                    />
                  </Column>
                  <Column medium={3} large={2}>
                    <Field
                      component={FieldTypeText}
                      label='Allekirjoittaja'
                      name={`${area}.constructability_report_signer`}
                      type="text"
                    />
                  </Column>
                  <Column medium={3} large={2}>
                    <Field
                      component={FieldTypeText}
                      label='Geotekninen palvelun tiedosto'
                      name={`${area}.constructability_report_geotechnical_number`}
                      type="text"
                    />
                  </Column>
                </Row>
                <FieldArray
                  component={renderComments}
                  name={`${area}.descriptionsReport`}
                />
              </GreenBoxEdit>

              <GreenBoxEdit>
                <h2>Muut</h2>
                <Row>
                  <Column medium={3}>
                    <Field
                      component={FieldTypeSelect}
                      label='Selvitysaste'
                      name={`${area}.other_state`}
                      options={stateOptions}
                    />
                  </Column>
                </Row>
                <FieldArray
                  component={renderComments}
                  name={`${area}.descriptionsOther`}
                />
              </GreenBoxEdit>
            </Collapse>
          </div>
        );
      })}
    </div>
  );
};

type Props = {
  areas: Array<Object>,
  attributes: Attributes,
  handleSubmit: Function,
  users: UserList,
}

class ConstructabilityEdit extends Component {
  props: Props

  render () {
    const {areas, attributes, handleSubmit, users} = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <FormSection>
          <FieldArray
            areas={areas}
            attributes={attributes}
            component={renderAreas}
            name="lease_areas"
            users={users}
          />
        </FormSection>
      </form>
    );
  }
}

const formName = 'constructability-form';

export default flowRight(
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(ConstructabilityEdit);
