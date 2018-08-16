// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import FormField from '$components/form/FormField';
import GreenBoxEdit from '$components/content/GreenBoxEdit';
import RemoveButton from '$components/form/RemoveButton';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  fields: any,
  isSaveClicked: boolean,
}

const InspectionItemsEdit = ({
  attributes,
  fields,
  isSaveClicked,
}: Props) => {
  const handleAdd = () => fields.push({});

  return (
    <GreenBoxEdit>
      {fields && !!fields.length &&
        <BoxItemContainer>
          {fields.map((inspection, index) => {
            const handleRemove = () => fields.remove(index);

            return (
              <BoxItem key={index}>
                <RemoveButton
                  className='position-topright'
                  onClick={handleRemove}
                  title="Poista tarkastus"
                />
                <Row>
                  <Column small={6} medium={4} large={2}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'inspections.child.children.inspector')}
                      name={`${inspection}.inspector`}
                      overrideValues={{
                        label: 'Tarkastaja',
                      }}
                    />
                  </Column>
                  <Column small={6} medium={4} large={2}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'inspections.child.children.supervision_date')}
                      name={`${inspection}.supervision_date`}
                      overrideValues={{
                        label: 'Valvontapvm',
                      }}
                    />
                  </Column>
                  <Column small={6} medium={4} large={2}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'inspections.child.children.supervised_date')}
                      name={`${inspection}.supervised_date`}
                      overrideValues={{
                        label: 'Valvottu pvm',
                      }}
                    />
                  </Column>
                  <Column small={6} medium={12} large={6}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'inspections.child.children.description')}
                      name={`${inspection}.description`}
                      overrideValues={{
                        label: 'Huomautus',
                      }}
                    />
                  </Column>
                </Row>
              </BoxItem>
            );
          })}
        </BoxItemContainer>
      }
      <Row>
        <Column>
          <AddButtonSecondary
            label='Lisää tarkastus'
            onClick={handleAdd}
            title='Lisää tarkastus'
          />
        </Column>
      </Row>
    </GreenBoxEdit>
  );
};

export default InspectionItemsEdit;
