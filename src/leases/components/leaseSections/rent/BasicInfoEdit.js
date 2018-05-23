// @flow
import React from 'react';
import {connect} from 'react-redux';
import {FieldArray} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';
import type {Element} from 'react';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import FormField from '$components/form/FormField';
import RemoveButton from '$components/form/RemoveButton';
import {RentTypes, RentDueDateTypes} from '$src/leases/enums';
import {getAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

type DueDatesProps = {
  attributes: Attributes,
  fields: any,
}

const renderDueDates = ({attributes, fields}: DueDatesProps): Element<*> => {
  return (
    <div>
      <Row>
        <Column>
          <label className="mvj-form-field-label">Eräpäivät</label>
        </Column>
      </Row>
      {fields && !!fields.length && fields.map((due_date, index) => {
        return (
          <Row key={index}>
            <Column small={9}>
              <Row>
                <Column small={6}>
                  <FormField
                    fieldAttributes={get(attributes, 'rents.child.children.due_dates.child.children.day')}
                    name={`${due_date}.day`}
                    overrideValues={{
                      label: '',
                    }}
                  />
                </Column>
                <Column small={6}>
                  <FormField
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
                onClick={() => fields.remove(index)}
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
            onClick={() => fields.push('')}
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
}

const renderFixedInitialYearRents = ({attributes, fields}: FixedInitialYearRentsProps): Element<*> => {
  return (
    <div>
      <Row>
        <Column><p className="sub-title">Kiinteät alkuvuosivuokrat</p></Column>
      </Row>
      {fields && !!fields.length &&
        <Row>
          <Column small={3} medium={3} large={2}><label className="mvj-form-field-label">Käyttötarkoitus</label></Column>
          <Column small={3} medium={3} large={2}><label className="mvj-form-field-label">Vuokra</label></Column>
          <Column small={2} medium={2} large={1}><label className="mvj-form-field-label">Alkupvm</label></Column>
          <Column small={2} medium={2} large={1}><label className="mvj-form-field-label">Loppupvm</label></Column>
        </Row>
      }
      {fields && !!fields.length && fields.map((rent, index) => {
        return (
          <div key={index}>
            <Row>
              <Column small={3} medium={3} large={2}>
                <FormField
                  fieldAttributes={get(attributes, 'rents.child.children.fixed_initial_year_rents.child.children.intended_use')}
                  name={`${rent}.intended_use`}
                  overrideValues={{
                    label: '',
                  }}
                />
              </Column>
              <Column small={3} medium={3} large={2}>
                <FormField
                  fieldAttributes={get(attributes, 'rents.child.children.fixed_initial_year_rents.child.children.amount')}
                  name={`${rent}.amount`}
                  overrideValues={{
                    label: '',
                  }}
                />
              </Column>
              <Column small={2} medium={2} large={1}>
                <FormField
                  fieldAttributes={get(attributes, 'rents.child.children.fixed_initial_year_rents.child.children.start_date')}
                  name={`${rent}.start_date`}
                  overrideValues={{
                    label: '',
                  }}
                />
              </Column>
              <Column small={2} medium={2} large={1}>
                <FormField
                  className='with-dash'
                  fieldAttributes={get(attributes, 'rents.child.children.fixed_initial_year_rents.child.children.end_date')}
                  name={`${rent}.end_date`}
                  overrideValues={{
                    label: '',
                  }}
                />
              </Column>
              <Column>
                <RemoveButton
                  onClick={() => fields.remove(index)}
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
            onClick={() => fields.push({})}
            title='Lisää kiinteä alkuvuosivuokra'
          />
        </Column>
      </Row>
    </div>
  );
};

type Props = {
  attributes: Attributes,
  rent: Object,
  rentType: ?string,
}

const BasicInfoEmpty = ({attributes}: Props) => {
  return (
    <div>
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormField
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
  isIndex: boolean,
  rent: Object,
}

const BasicInfoIndex = ({attributes, isIndex, rent}: BasicInfoIndexProps) => {
  return (
    <div>
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormField
            fieldAttributes={get(attributes, 'rents.child.children.type')}
            name='type'
            overrideValues={{
              label: 'Vuokralaji',
            }}
          />
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormField
            fieldAttributes={get(attributes, 'rents.child.children.start_date')}
            name='start_date'
            overrideValues={{
              label: 'Alkupvm',
            }}
          />
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormField
            className='with-dash'
            fieldAttributes={get(attributes, 'rents.child.children.end_date')}
            name='end_date'
            overrideValues={{
              label: 'Loppupvm',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            fieldAttributes={get(attributes, 'rents.child.children.cycle')}
            name='cycle'
            overrideValues={{
              label: 'Vuokrakausi',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            fieldAttributes={get(attributes, 'rents.child.children.index_type')}
            name='index_type'
            overrideValues={{
              label: 'Indeksin tunnusnumero',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            fieldAttributes={get(attributes, 'rents.child.children.due_dates_type')}
            name='due_dates_type'
            overrideValues={{
              label: 'Laskutusjako',
            }}
          />
        </Column>
        {rent.due_dates_type === RentDueDateTypes.CUSTOM &&
          <Column small={6} medium={4} large={2}>
            <FieldArray
              attributes={attributes}
              component={renderDueDates}
              name="due_dates"
            />
          </Column>
        }
        {rent.due_dates_type === RentDueDateTypes.FIXED &&
          <Column small={6} medium={4} large={2}>
            <FormField
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
                  fieldAttributes={get(attributes, 'rents.child.children.elementary_index')}
                  name='elementary_index'
                  overrideValues={{
                    label: 'Perusindeksi',
                  }}
                />
              </Column>
              <Column small={6}>
                <FormField
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
              fieldAttributes={get(attributes, 'rents.child.children.x_value')}
              name='x_value'
              overrideValues={{
                label: 'X-luku',
              }}
            />
          </Column>
          <Column small={4} medium={2} large={1}>
            <FormField
              fieldAttributes={get(attributes, 'rents.child.children.y_value')}
              name='y_value'
              overrideValues={{
                label: 'Y-luku',
              }}
            />
          </Column>
          <Column small={4} medium={2} large={1}>
            <FormField
              fieldAttributes={get(attributes, 'rents.child.children.y_value_start')}
              name='y_value_start'
              overrideValues={{
                label: 'Y-alkaen',
              }}
            />
          </Column>
          <Column small={12} medium={4} large={2}>
            <label>Tasaus pvm</label>
            <Row>
              <Column small={6}>
                <FormField
                  fieldAttributes={get(attributes, 'rents.child.children.equalization_start_date')}
                  name='equalization_start_date'
                  overrideValues={{
                    label: '',
                  }}
                />
              </Column>
              <Column small={6}>
                <FormField
                  className='with-dash'
                  fieldAttributes={get(attributes, 'rents.child.children.equalization_end_date')}
                  name='equalization_end_date'
                  overrideValues={{
                    label: '',
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
            name="fixed_initial_year_rents"
          />
        </Column>
      </Row>
      <Row>
        <Column>
          <FormField
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

const BasicInfoOneTime = ({attributes}: Props) => {
  return (
    <div>
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormField
            fieldAttributes={get(attributes, 'rents.child.children.type')}
            name='type'
            overrideValues={{
              label: 'Vuokralaji',
            }}
          />
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormField
            fieldAttributes={get(attributes, 'rents.child.children.start_date')}
            name='start_date'
            overrideValues={{
              label: 'Alkupvm',
            }}
          />
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormField
            className='with-dash'
            fieldAttributes={get(attributes, 'rents.child.children.end_date')}
            name='end_date'
            overrideValues={{
              label: 'Loppupvm',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            fieldAttributes={get(attributes, 'rents.child.children.amount')}
            name='amount'
            overrideValues={{
              label: 'Kertakaikkinen vuokra',
            }}
          />
        </Column>
      </Row>
      <Row>
        <Column>
          <FormField
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

const BasicInfoFixed = ({attributes, rent}: Props) => {
  return (
    <div>
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormField
            fieldAttributes={get(attributes, 'rents.child.children.type')}
            name='type'
            overrideValues={{
              label: 'Vuokralaji',
            }}
          />
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormField
            fieldAttributes={get(attributes, 'rents.child.children.start_date')}
            name='start_date'
            overrideValues={{
              label: 'Alkupvm',
            }}
          />
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormField
            className='with-dash'
            fieldAttributes={get(attributes, 'rents.child.children.end_date')}
            name='end_date'
            overrideValues={{
              label: 'Loppupvm',
            }}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            fieldAttributes={get(attributes, 'rents.child.children.due_dates_type')}
            name='due_dates_type'
            overrideValues={{
              label: 'Laskutusjako',
            }}
          />
        </Column>
        {rent.due_dates_type === RentDueDateTypes.CUSTOM &&
          <Column small={6} medium={4} large={2}>
            <FieldArray
              attributes={attributes}
              component={renderDueDates}
              name="due_dates"
            />
          </Column>
        }
        {rent.due_dates_type === RentDueDateTypes.FIXED &&
          <Column small={6} medium={4} large={2}>
            <FormField
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

const BasicInfoFree = ({attributes}: Props) => {
  return (
    <div>
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormField
            fieldAttributes={get(attributes, 'rents.child.children.type')}
            name='type'
            overrideValues={{
              label: 'Vuokralaji',
            }}
          />
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormField
            fieldAttributes={get(attributes, 'rents.child.children.start_date')}
            name='start_date'
            overrideValues={{
              label: 'Alkupvm',
            }}
          />
        </Column>
        <Column small={3} medium={2} large={1}>
          <FormField
            className='with-dash'
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

const BasicInfoEdit = ({attributes, rent, rentType}: Props) => {
  return (
    <div>
      {!rentType &&
        <BasicInfoEmpty
          attributes={attributes}
          rent={rent}
          rentType={rentType}
        />
      }
      {rentType === RentTypes.INDEX &&
        <BasicInfoIndex
          attributes={attributes}
          isIndex={true}
          rent={rent}
          rentType={rentType}
        />
      }
      {rentType === RentTypes.ONE_TIME &&
        <BasicInfoOneTime
          attributes={attributes}
          rent={rent}
          rentType={rentType}
        />
      }
      {rentType === RentTypes.FIXED &&
        <BasicInfoFixed
          attributes={attributes}
          rent={rent}
          rentType={rentType}
        />
      }
      {rentType === RentTypes.FREE &&
        <BasicInfoFree
          attributes={attributes}
          rent={rent}
          rentType={rentType}
        />
      }
      {rentType === RentTypes.MANUAL &&
        <BasicInfoIndex
          attributes={attributes}
          isIndex={false}
          rent={rent}
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
