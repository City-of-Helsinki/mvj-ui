// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import classNames from 'classnames';
import get from 'lodash/get';

import Collapse from '$components/collapse/Collapse';
import Divider from '$components/content/Divider';
import FormFieldLabel from '$components/form/FormFieldLabel';
import LeaseArea from './LeaseArea';
import {receiveCollapseStates} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {FormNames} from '$src/leases/enums';
import {getFullAddress} from '$src/leases/helpers';
import {formatDate, formatNumber, getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';
import {getAttributes, getCollapseStateByKey} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

type Props = {
  area: Object,
  areaCollapseState: boolean,
  attributes: Attributes,
  decisionOptions: Array<Object>,
  isActive: boolean,
  planUnitsContractCollapseState: boolean,
  planUnitsCurrentCollapseState: boolean,
  plotsContractCollapseState: boolean,
  plotsCurrentCollapseState: boolean,
  receiveCollapseStates: Function,
}

const LeaseAreaWithArchiveInfo = ({
  area,
  areaCollapseState,
  attributes,
  decisionOptions,
  isActive,
  receiveCollapseStates,
}: Props) => {
  const handleAreaCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.LEASE_AREAS]: {
          [area.id]: {
            area: val,
          },
        },
      },
    });
  };

  const locationOptions = getAttributeFieldOptions(attributes, 'lease_areas.child.children.location');
  const typeOptions = getAttributeFieldOptions(attributes, 'lease_areas.child.children.type');

  return (
    <Collapse
      className={classNames({'not-active': !isActive})}
      defaultOpen={areaCollapseState !== undefined ? areaCollapseState : isActive}
      header={
        <div>
          <Column>
            <span className='collapse__header-subtitle'>
              {getLabelOfOption(typeOptions, area.type) || '-'}
            </span>
          </Column>
          <Column>
            <span className='collapse__header-subtitle'>
              {getFullAddress(get(area, 'addresses[0]')) || '-'}
            </span>
          </Column>
          <Column>
            <span className='collapse__header-subtitle'>
              {formatNumber(area.area) || '-'} m<sup>2</sup>
            </span>
          </Column>
          <Column>
            <span className='collapse__header-subtitle'>
              {getLabelOfOption(locationOptions, area.location) || '-'}
            </span>
          </Column>
        </div>
      }
      headerTitle={<h3 className='collapse__header-title'>{area.identifier || '-'}</h3>}
      onToggle={handleAreaCollapseToggle}
    >
      <LeaseArea
        area={area}
      />
      {!isActive && <Divider className='lease-area-divider'/>}
      {!isActive &&
        <Row>
          <Column small={6} medium={4} large={2}>
            <FormFieldLabel>Arkistoitu</FormFieldLabel>
            <p>{formatDate(area.archived_at) || '-'}</p>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormFieldLabel>Päätös</FormFieldLabel>
            <p>{getLabelOfOption(decisionOptions, area.archived_decision) || '-'}</p>
          </Column>
          <Column small={12} medium={4} large={8}>
            <FormFieldLabel>Huomautus</FormFieldLabel>
            <p>{area.archived_note || '-'}</p>
          </Column>
        </Row>
      }
    </Collapse>
  );
};

export default connect(
  (state, props) => {
    const id = get(props, 'area.id');

    return {
      areaCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.LEASE_AREAS}.${id}.area`),
      attributes: getAttributes(state),
    };
  },
  {
    receiveCollapseStates,
  }
)(LeaseAreaWithArchiveInfo);
