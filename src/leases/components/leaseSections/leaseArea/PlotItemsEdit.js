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
  buttonTitle: string,
  fields: any,
  title: string,
}

const PlotItemsEdit = ({attributes, buttonTitle, fields, title}: Props) => {
  return (
    <div>
      <Collapse
        className='collapse__secondary'
        defaultOpen={true}
        headerTitle={
          <h4 className='collapse__header-title'>{title}</h4>
        }
      >
        <BoxItemContainer>
          {fields.map((plot, index) =>
            <BoxItem className='no-border-on-first-child'  key={plot.id ? plot.id : `index_${index}`}>
              <BoxContentWrapper>
                <RemoveButton
                  className='position-topright'
                  onClick={() => fields.remove(index)}
                  title="Poista kiinteistö / määräala"
                />
                <Row>
                  <Column small={12} medium={6} large={6}>
                    <FormField
                      fieldAttributes={get(attributes, 'lease_areas.child.children.plots.child.children.identifier')}
                      name={`${plot}.identifier`}
                      overrideValues={{
                        label: 'Tunnus',
                      }}
                    />
                  </Column>
                  <Column small={12} medium={6} large={3}>
                    <FormField
                      fieldAttributes={get(attributes, 'lease_areas.child.children.plots.child.children.type')}
                      name={`${plot}.type`}
                      overrideValues={{
                        label: 'Määritelmä',
                      }}
                    />
                  </Column>
                </Row>
                <Row>
                  <Column small={12} medium={12} large={6}>
                    <FormField
                      fieldAttributes={get(attributes, 'lease_areas.child.children.plots.child.children.address')}
                      name={`${plot}.address`}
                      overrideValues={{
                        label: 'Osoite',
                      }}
                    />
                  </Column>
                  <Column small={12} medium={6} large={3}>
                    <FormField
                      fieldAttributes={get(attributes, 'lease_areas.child.children.plots.child.children.postal_code')}
                      name={`${plot}.postal_code`}
                      overrideValues={{
                        label: 'Postinumero',
                      }}
                    />
                  </Column>
                  <Column small={12} medium={6} large={3}>
                    <FormField
                      fieldAttributes={get(attributes, 'lease_areas.child.children.plots.child.children.city')}
                      name={`${plot}.city`}
                      overrideValues={{
                        label: 'Kaupunki',
                      }}
                    />
                  </Column>
                </Row>
                <Row>
                  <Column small={12} medium={6} large={3}>
                    <FormField
                      fieldAttributes={get(attributes, 'lease_areas.child.children.plots.child.children.area')}
                      name={`${plot}.area`}
                      overrideValues={{
                        label: 'Kokonaisala',
                      }}
                    />
                  </Column>
                  <Column small={12} medium={6} large={3}>
                    <FormField
                      fieldAttributes={get(attributes, 'lease_areas.child.children.plots.child.children.section_area')}
                      name={`${plot}.section_area`}
                      overrideValues={{
                        label: 'Leikkausala',
                      }}
                    />
                  </Column>
                  <Column small={12} medium={6} large={3}>
                    <FormField
                      fieldAttributes={get(attributes, 'lease_areas.child.children.plots.child.children.registration_date')}
                      name={`${plot}.registration_date`}
                      overrideValues={{
                        label: 'Rekisteröintipäivä',
                      }}
                    />
                  </Column>
                  <Column small={12} medium={6} large={3}>
                  </Column>
                </Row>
              </BoxContentWrapper>
            </BoxItem>
          )}
        </BoxItemContainer>
        <Row>
          <Column>
            <AddButtonSecondary
              label={buttonTitle}
              onClick={() => fields.push({})}
              title={buttonTitle}
            />
          </Column>
        </Row>
      </Collapse>
    </div>
  );
};

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
    };
  }
)(PlotItemsEdit);
