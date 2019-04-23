// @flow
import React, {Fragment} from 'react';
import {connect} from 'react-redux';

import Authorization from '$components/authorization/Authorization';
import ContractsEdit from './ContractsEdit';
import DecisionsEdit from './DecisionsEdit';
import Divider from '$components/content/Divider';
import InspectionsEdit from './InspectionsEdit';
import Title from '$components/content/Title';
import {
  LeaseContractsFieldPaths,
  LeaseContractsFieldTitles,
  LeaseDecisionsFieldPaths,
  LeaseDecisionsFieldTitles,
  LeaseInspectionsFieldPaths,
  LeaseInspectionsFieldTitles,
} from '$src/leases/enums';
import {getUiDataLeaseKey} from '$src/uiData/helpers';
import {isFieldAllowedToRead} from '$util/helpers';
import {getAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/types';

type Props = {
  attributes: Attributes,
}
const DecisionsMainEdit = ({attributes}: Props) => {
  return(
    <Fragment>
      <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionsFieldPaths.DECISIONS)}>
        <Title enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseDecisionsFieldPaths.DECISIONS)}>
          {LeaseDecisionsFieldTitles.DECISIONS}
        </Title>
        <Divider />
        <DecisionsEdit />
      </Authorization>

      <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.CONTRACTS)}>
        <Title enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseContractsFieldPaths.CONTRACTS)}>
          {LeaseContractsFieldTitles.CONTRACTS}
        </Title>
        <Divider />
        <ContractsEdit/>
      </Authorization>

      <Authorization allow={isFieldAllowedToRead(attributes, LeaseInspectionsFieldPaths.INSPECTIONS)}>
        <Title enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseInspectionsFieldPaths.INSPECTIONS)}>
          {LeaseInspectionsFieldTitles.INSPECTIONS}
        </Title>
        <Divider />
        <InspectionsEdit />
      </Authorization>
    </Fragment>
  );
};

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
    };
  }
)(DecisionsMainEdit);
