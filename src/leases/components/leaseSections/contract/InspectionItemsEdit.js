// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import FormField from '$components/form/FormField';
import GreenBoxEdit from '$components/content/GreenBoxEdit';
import RemoveButton from '$components/form/RemoveButton';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  fields: any,
}

const InspectionItemsEdit = ({
  attributes,
  fields,
}: Props) =>
  <GreenBoxEdit>
    <BoxItemContainer>
      {fields && !!fields.length && fields.map((inspection, index) =>
        <BoxItem
          className='no-border-on-first-child'
          key={inspection.id ? inspection.id : `index_${index}`}>
          <BoxContentWrapper>
            <RemoveButton
              className='position-topright-no-padding'
              onClick={() => fields.remove(index)}
              title="Poista tarkastus"
            />
            <Row>
              <Column small={6} medium={4} large={2}>
                <FormField
                  fieldAttributes={get(attributes, 'inspections.child.children.inspector')}
                  name={`${inspection}.inspector`}
                  overrideValues={{
                    label: 'Tarkastaja',
                  }}
                />
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormField
                  fieldAttributes={get(attributes, 'inspections.child.children.supervision_date')}
                  name={`${inspection}.supervision_date`}
                  overrideValues={{
                    label: 'Valvontapvm',
                  }}
                />
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormField
                  fieldAttributes={get(attributes, 'inspections.child.children.supervised_date')}
                  name={`${inspection}.supervised_date`}
                  overrideValues={{
                    label: 'Valvottu pvm',
                  }}
                />
              </Column>
              <Column small={6} medium={12} large={6}>
                <FormField
                  fieldAttributes={get(attributes, 'inspections.child.children.description')}
                  name={`${inspection}.description`}
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
          label='Lisää tarkastus'
          onClick={() => fields.push({})}
          title='Lisää tarkastus'
        />
      </Column>
    </Row>
  </GreenBoxEdit>;

export default InspectionItemsEdit;
