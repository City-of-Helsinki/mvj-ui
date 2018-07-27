// @flow
import React from 'react';
import {connect} from 'react-redux';
import {FieldArray} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';
import type {Element} from 'react';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import FormField from '$components/form/FormField';
import FormFieldLabel from '$components/form/FormFieldLabel';
import RemoveButton from '$components/form/RemoveButton';
import SubTitle from '$components/content/SubTitle';
import {RentTypes, RentDueDateTypes} from '$src/leases/enums';
import {getAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

type DueDatesProps = {
  attributes: Attributes,
  fields: any,
  isSaveClicked: boolean,
}

const renderDueDates = ({attributes, fields, isSaveClicked}: DueDatesProps): Element<*> => {
  const handleAdd = () => {
    fields.push('');
  };

  return (
    <div>
      <Row>
        <Column>
          <FormFieldLabel>Eräpäivät</FormFieldLabel>
        </Column>
      </Row>
      {fields && !!fields.length && fields.map((due_date, index) => {
        const handleRemove = () => {
          fields.remove(index);
        };

        return (
          <Row key={index}>
            <Column small={9}>
              <Row>
                <Column small={6}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'rents.child.children.due_dates.child.children.day')}
                    name={`${due_date}.day`}
                    overrideValues={{
                      label: '',
                    }}
                  />
                </Column>
                <Column small={6}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'rents.child.children.due_dates.child.children.month')}
                    name={`${due_date}.month`}
                    overrideValues={{
                      label: '',
                    }}
                  />
                </Column>
              </Row>
            </Column>
            <Column small={3}>
              <RemoveButton
                onClick={handleRemove}
                title="Poista eräpäivä"
              />
            </Column>
          </Row>
        );
      })}
      <Row>
        <Column>
          <AddButtonSecondary
            label='Lisää eräpäivä'
            onClick={handleAdd}
            title='Lisää eräpäivä'
          />
        </Column>
      </Row>
    </div>
  );
};

type FixedInitialYearRentsProps = {
  attributes: Attributes,
  fields: any,
  isSaveClicked: boolean,
}

const renderFixedInitialYearRents = ({attributes, fields, isSaveClicked}: FixedInitialYearRentsProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <div>
      <Row>
        <Column><SubTitle>Kiinteät alkuvuosivuokrat</SubTitle></Column>
      </Row>
      {fields && !!fields.length &&
        <Row>
          <Column small={3} medium={3} large={2}><FormFieldLabel>Käyttötarkoitus</FormFieldLabel></Column>
          <Column small={3} medium={3} large={2}><FormFieldLabel>Kiinteä alkuvuosivuokra</FormFieldLabel></Column>
          <Column small={2} medium={2} large={1}><FormFieldLabel>Alkupvm</FormFieldLabel></Column>
          <Column small={2} medium={2} large={1}><FormFieldLabel>Loppupvm</FormFieldLabel></Column>
        </Row>
      }
      {fields && !!fields.length && fields.map((rent, index) => {
        const handleRemove = () => {
          fields.remove(index);
        };

        return (
          <div key={index}>
            <Row>
              <Column small={3} medium={3} large={2}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'rents.child.children.fixed_initial_year_rents.child.children.intended_use')}
                  name={`${rent}.intended_use`}
                  overrideValues={{
                    label: '',
                  }}
                />
              </Column>
              <Column small={3} medium={3} large={2}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'rents.child.children.fixed_initial_year_rents.child.children.amount')}
                  name={`${rent}.amount`}
                  unit='€'
                  overrideValues={{
                    label: '',
                  }}
                />
              </Column>
              <Column small={2} medium={2} large={1}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'rents.child.children.fixed_initial_year_rents.child.children.start_date')}
                  name={`${rent}.start_date`}
                  overrideValues={{
                    label: '',
                  }}
                />
              </Column>
              <Column small={2} medium={2} large={1}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'rents.child.children.fixed_initial_year_rents.child.children.end_date')}
                  name={`${rent}.end_date`}
                  overrideValues={{
                    label: '',
                  }}
                />
              </Column>
              <Column>
                <RemoveButton
                  onClick={handleRemove}
                  title="Poista alennus/korotus"
                />
              </Column>
            </Row>
          </div>
        );
      })}
      <Row>
        <Column>
          <AddButtonSecondary
            label='Lisää kiinteä alkuvuosivuokra'
            onClick={handleAdd}
            title='Lisää kiinteä alkuvuosivuokra'
          />
        </Column>
      </Row>
    </div>
  );
};

type Props = {
  attributes: Attributes,
  dueDatesType: ?string,
  isSaveClicked: boolean,
  rentType: ?string,
}

const BasicInfoEmpty = ({attributes, isSaveClicked}: Props) => {
  return (
    <div>
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'rents.child.children.type')}
            name='type'
            overrideValues={{
              label: 'Vuokralaji',
            }}
          />
        </Column>
      </Row>
    </div>
  );
};

type BasicInfoIndexProps = {
  attributes: Attributes,
  dueDatesType: ?string,
  isIndex: boolean,
  isSaveClicked: boolean,
}

const BasicInfoIndex = ({attributes, dueDatesType, isIndex, isSaveClicked}: BasicInfoIndexProps) => {
  return (
    <div>
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'rents.child.children.type')}
            name='type'
            overrideValues={{
              label: 'Vuokralaji',
            }}
          />
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'rents.child.children.start_date')}
            name='start_date'
            overrideValues={{
              label: 'Alkupvm',
            }}
          />
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'rents.child.children.end_date')}
            name='end_date'
            overrideValues={{
              label: 'Loppupvm',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'rents.child.children.cycle')}
            name='cycle'
            overrideValues={{
              label: 'Vuokrakausi',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'rents.child.children.index_type')}
            name='index_type'
            overrideValues={{
              label: 'Indeksin tunnusnumero',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'rents.child.children.due_dates_type')}
            name='due_dates_type'
            overrideValues={{
              label: 'Laskutusjako',
            }}
          />
        </Column>
        {dueDatesType === RentDueDateTypes.CUSTOM &&
          <Column small={6} medium={4} large={2}>
            <FieldArray
              attributes={attributes}
              component={renderDueDates}
              isSaveClicked={isSaveClicked}
              name="due_dates"
            />
          </Column>
        }
        {dueDatesType === RentDueDateTypes.FIXED &&
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'rents.child.children.due_dates_per_year')}
              name='due_dates_per_year'
              overrideValues={{
                label: 'Laskut kpl/vuodessa',
              }}
            />
          </Column>
        }
      </Row>

      {!isIndex &&
        <Row>
          <Column small={12} medium={4} large={2}>
            <Row>
              <Column small={6}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'rents.child.children.elementary_index')}
                  name='elementary_index'
                  overrideValues={{
                    label: 'Perusindeksi',
                  }}
                />
              </Column>
              <Column small={6}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'rents.child.children.index_rounding')}
                  name='index_rounding'
                  overrideValues={{
                    label: 'Pyöristys',
                  }}
                />
              </Column>
            </Row>
          </Column>
          <Column small={4} medium={2} large={1}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'rents.child.children.x_value')}
              name='x_value'
              overrideValues={{
                label: 'X-luku',
              }}
            />
          </Column>
          <Column small={4} medium={2} large={1}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'rents.child.children.y_value')}
              name='y_value'
              overrideValues={{
                label: 'Y-luku',
              }}
            />
          </Column>
          <Column small={4} medium={2} large={1}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'rents.child.children.y_value_start')}
              name='y_value_start'
              overrideValues={{
                label: 'Y-alkaen',
              }}
            />
          </Column>
          <Column small={12} medium={4} large={2}>
            <Row>
              <Column small={6}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'rents.child.children.equalization_start_date')}
                  name='equalization_start_date'
                  overrideValues={{
                    label: 'Tasaus alkupvm',
                  }}
                />
              </Column>
              <Column small={6}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'rents.child.children.equalization_end_date')}
                  name='equalization_end_date'
                  overrideValues={{
                    label: 'Tasaus loppupvm',
                  }}
                />
              </Column>
            </Row>
          </Column>
        </Row>
      }

      <Row>
        <Column small={12}>
          <FieldArray
            attributes={attributes}
            component={renderFixedInitialYearRents}
            isSaveClicked={isSaveClicked}
            name="fixed_initial_year_rents"
          />
        </Column>
      </Row>
      <Row>
        <Column>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'rents.child.children.note')}
            name='note'
            overrideValues={{
              label: 'Huomautus',
            }}
          />
        </Column>
      </Row>
    </div>
  );
};

const BasicInfoOneTime = ({attributes, isSaveClicked}: Props) => {
  return (
    <div>
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'rents.child.children.type')}
            name='type'
            overrideValues={{
              label: 'Vuokralaji',
            }}
          />
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'rents.child.children.start_date')}
            name='start_date'
            overrideValues={{
              label: 'Alkupvm',
            }}
          />
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'rents.child.children.end_date')}
            name='end_date'
            overrideValues={{
              label: 'Loppupvm',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'rents.child.children.amount')}
            name='amount'
            unit='€'
            overrideValues={{
              label: 'Kertakaikkinen vuokra',
            }}
          />
        </Column>
      </Row>
      <Row>
        <Column>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'rents.child.children.note')}
            name='note'
            overrideValues={{
              label: 'Huomautus',
            }}
          />
        </Column>
      </Row>
    </div>
  );
};

const BasicInfoFixed = ({attributes, dueDatesType, isSaveClicked}: Props) => {
  return (
    <div>
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'rents.child.children.type')}
            name='type'
            overrideValues={{
              label: 'Vuokralaji',
            }}
          />
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'rents.child.children.start_date')}
            name='start_date'
            overrideValues={{
              label: 'Alkupvm',
            }}
          />
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'rents.child.children.end_date')}
            name='end_date'
            overrideValues={{
              label: 'Loppupvm',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'rents.child.children.due_dates_type')}
            name='due_dates_type'
            overrideValues={{
              label: 'Laskutusjako',
            }}
          />
        </Column>
        {dueDatesType === RentDueDateTypes.CUSTOM &&
          <Column small={6} medium={4} large={2}>
            <FieldArray
              attributes={attributes}
              component={renderDueDates}
              isSaveClicked={isSaveClicked}
              name="due_dates"
            />
          </Column>
        }
        {dueDatesType === RentDueDateTypes.FIXED &&
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'rents.child.children.due_dates_per_year')}
              name='due_dates_per_year'
              overrideValues={{
                label: 'Laskut kpl/vuodessa',
              }}
            />
          </Column>
        }
      </Row>
      <Row>
        <Column>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'rents.child.children.note')}
            name='note'
            overrideValues={{
              label: 'Huomautus',
            }}
          />
        </Column>
      </Row>
    </div>
  );
};

const BasicInfoFree = ({attributes, isSaveClicked}: Props) => {
  return (
    <div>
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'rents.child.children.type')}
            name='type'
            overrideValues={{
              label: 'Vuokralaji',
            }}
          />
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'rents.child.children.start_date')}
            name='start_date'
            overrideValues={{
              label: 'Alkupvm',
            }}
          />
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'rents.child.children.end_date')}
            name='end_date'
            overrideValues={{
              label: 'Loppupvm',
            }}
          />
        </Column>
      </Row>
      <Row>
        <Column>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'rents.child.children.note')}
            name='note'
            overrideValues={{
              label: 'Huomautus',
            }}
          />
        </Column>
      </Row>
    </div>
  );
};

const BasicInfoEdit = ({attributes, dueDatesType, isSaveClicked, rentType}: Props) => {
  return (
    <div>
      {!rentType &&
        <BasicInfoEmpty
          attributes={attributes}
          dueDatesType={dueDatesType}
          isSaveClicked={isSaveClicked}
          rentType={rentType}
        />
      }
      {rentType === RentTypes.INDEX &&
        <BasicInfoIndex
          attributes={attributes}
          dueDatesType={dueDatesType}
          isIndex={true}
          isSaveClicked={isSaveClicked}
          rentType={rentType}
        />
      }
      {rentType === RentTypes.ONE_TIME &&
        <BasicInfoOneTime
          attributes={attributes}
          dueDatesType={dueDatesType}
          isSaveClicked={isSaveClicked}
          rentType={rentType}
        />
      }
      {rentType === RentTypes.FIXED &&
        <BasicInfoFixed
          attributes={attributes}
          dueDatesType={dueDatesType}
          isSaveClicked={isSaveClicked}
          rentType={rentType}
        />
      }
      {rentType === RentTypes.FREE &&
        <BasicInfoFree
          attributes={attributes}
          dueDatesType={dueDatesType}
          isSaveClicked={isSaveClicked}
          rentType={rentType}
        />
      }
      {rentType === RentTypes.MANUAL &&
        <BasicInfoIndex
          attributes={attributes}
          dueDatesType={dueDatesType}
          isIndex={false}
          isSaveClicked={isSaveClicked}
          rentType={rentType}
        />
      }
    </div>
  );
};

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
    };
  },
)(BasicInfoEdit);
