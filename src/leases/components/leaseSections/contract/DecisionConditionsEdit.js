// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import Collapse from '$components/collapse/Collapse';
import FormField from '$components/form/FormField';
import RemoveButton from '$components/form/RemoveButton';
import {getAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  fields: any,
}

const DecisionConditionsEdit = ({
  attributes,
  fields,
}: Props) => {
  return(
    <Collapse
      className='collapse__secondary'
      defaultOpen={true}
      headerTitle={
        <h4 className='collapse__header-title'>Ehdot</h4>
      }
    >
      <BoxItemContainer>
        {fields && !!fields.length && fields.map((condition, index) =>
          <BoxItem
            key={condition.id ? condition.id : `index_${index}`}
            className='no-border-on-first-child'
          >
            <BoxContentWrapper>
              <RemoveButton
                className='position-topright-no-padding'
                onClick={() => fields.remove(index)}
                title="Poista ehto"
              />
              <Row>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    fieldAttributes={get(attributes, 'decisions.child.children.conditions.child.children.type')}
                    name={`${condition}.type`}
                    overrideValues={{
                      label: 'Käyttötarkoitusehto',
                    }}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormField
                    fieldAttributes={get(attributes, 'decisions.child.children.conditions.child.children.supervision_date')}
                    name={`${condition}.supervision_date`}
                    overrideValues={{
                      label: 'Valvonta päivämäärä',
                    }}
                  />
                </Column>
                <Column small={12} medium={4} large={2}>
                  <FormField
                    fieldAttributes={get(attributes, 'decisions.child.children.conditions.child.children.supervised_date')}
                    name={`${condition}.supervised_date`}
                    overrideValues={{
                      label: 'Valvottu päivämäärä',
                    }}
                  />
                </Column>
                <Column small={12} medium={12} large={6}>
                  <FormField
                    fieldAttributes={get(attributes, 'decisions.child.children.conditions.child.children.description')}
                    name={`${condition}.description`}
                    overrideValues={{
                      label: 'Huomautus',
                    }}
                  />
                </Column>
              </Row>
            </BoxContentWrapper>
          </BoxItem>
        )}
      </BoxItemContainer>
      <Row>
        <Column>
          <AddButtonSecondary
            label='Lisää ehto'
            onClick={() => fields.push({})}
            title='Lisää ehto'
          />
        </Column>
      </Row>
    </Collapse>
  );
};

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
    };
  }
)(DecisionConditionsEdit);
