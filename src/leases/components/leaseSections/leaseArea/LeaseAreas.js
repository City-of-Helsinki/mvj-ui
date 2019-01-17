// @flow
import React from 'react';
import {connect} from 'react-redux';

import Authorization from '$components/authorization/Authorization';
import Divider from '$components/content/Divider';
import FormText from '$components/form/FormText';
import LeaseAreaWithArchiceInfo from './LeaseAreaWithArchiceInfo';
import RightSubtitle from '$components/content/RightSubtitle';
import {LeaseAreasFieldPaths} from '$src/leases/enums';
import {getAreasSum, getContentLeaseAreas, getDecisionOptions} from '$src/leases/helpers';
import {formatNumber, isFieldAllowedToRead}  from '$util/helpers';
import {getAttributes, getCurrentLease} from '$src/leases/selectors';

import type {Attributes} from '$src/types';
import type {Lease} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  currentLease: Lease,
}

const LeaseAreas = ({attributes, currentLease}: Props) => {
  const areas = getContentLeaseAreas(currentLease);
  const activeAreas = areas.filter((area) => !area.archived_at);
  const archivedAreas = areas.filter((area) => area.archived_at);
  const areasSum = getAreasSum(activeAreas);
  const decisionOptions = getDecisionOptions(currentLease);

  return (
    <div>
      <h2>Vuokra-alue</h2>
      <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.AREA)}>
        <RightSubtitle text={<span>Kokonaispinta-ala {formatNumber(areasSum) || '-'} m<sup>2</sup></span>} />
      </Authorization>
      <Divider />

      {!activeAreas || !activeAreas.length && <FormText className='no-margin'>Ei vuokra-alueita</FormText>}
      {activeAreas && !!activeAreas.length && activeAreas.map((area, index) =>
        <LeaseAreaWithArchiceInfo
          key={index}
          area={area}
          decisionOptions={decisionOptions}
          isActive={true}
        />
      )}

      {archivedAreas && !!archivedAreas.length &&
        <h3 style={{marginTop: 10, marginBottom: 5}}>Arkisto</h3>
      }
      {archivedAreas && !!archivedAreas.length && archivedAreas.map((area, index) =>
        <LeaseAreaWithArchiceInfo
          key={index}
          area={area}
          decisionOptions={decisionOptions}
          isActive={false}
        />
      )}
    </div>
  );
};

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
      currentLease: getCurrentLease(state),
    };
  }
)(LeaseAreas);
