// @flow
import React, {Fragment} from 'react';
import {connect} from 'react-redux';

import Authorization from '$components/authorization/Authorization';
import Contracts from './Contracts';
import Decisions from './Decisions';
import Divider from '$components/content/Divider';
import Inspections from './Inspections';
import {
  LeaseContractsFieldPaths,
  LeaseContractsFieldTitles,
  LeaseDecisionsFieldPaths,
  LeaseDecisionsFieldTitles,
  LeaseInspectionsFieldPaths,
  LeaseInspectionsFieldTitles,
} from '$src/leases/enums';
import {isFieldAllowedToRead} from '$util/helpers';
import {getAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/types';
type Props = {
  attributes: Attributes,
}
const DecisionsMain = ({attributes}: Props) => {
  return (
    <Fragment>
      <Authorization allow={isFieldAllowedToRead(attributes, LeaseDecisionsFieldPaths.DECISIONS)}>
        <h2>{LeaseDecisionsFieldTitles.DECISIONS}</h2>
        <Divider />
        <Decisions />
      </Authorization>

      <Authorization allow={isFieldAllowedToRead(attributes, LeaseContractsFieldPaths.CONTRACTS)}>
        <h2>{LeaseContractsFieldTitles.CONTRACTS}</h2>
        <Divider />
        <Contracts/>
      </Authorization>

      <Authorization allow={isFieldAllowedToRead(attributes, LeaseInspectionsFieldPaths.INSPECTIONS)}>
        <h2>{LeaseInspectionsFieldTitles.INSPECTIONS}</h2>
        <Divider />
        <Inspections/>
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
)(DecisionsMain);
