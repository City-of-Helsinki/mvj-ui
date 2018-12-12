// @flow
import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import get from 'lodash/get';
import {Column} from 'react-foundation';
import classNames from 'classnames';

import Collapse from '$components/collapse/Collapse';
import CollapseHeaderSubtitle from '$components/collapse/CollapseHeaderSubtitle';
import CollapseHeaderTitle from '$components/collapse/CollapseHeaderTitle';
import LitigantBillingPerson from './LitigantBillingPerson';
import LitigantItem from './LitigantItem';
import {receiveCollapseStates} from '$src/landUseContract/actions';
import {FormNames} from '$src/landUseContract/enums';
import {ViewModes} from '$src/enums';
import {getContactFullName} from '$src/contacts/helpers';
import {isLitigantActive} from '$src/landUseContract/helpers';
import {formatDateRange} from '$util/helpers';
import {getCollapseStateByKey} from '$src/landUseContract/selectors';

type Props = {
  collapseState: boolean,
  litigant: Object,
  receiveCollapseStates: Function,
}

const Litigant = ({
  collapseState,
  litigant,
  receiveCollapseStates,
}: Props) => {
  const handleCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.LITIGANTS]: {
          litigants: {
            [litigant.id]: val,
          },
        },
      },
    });
  };

  const contact = get(litigant, 'litigant.contact');
  const isActive = isLitigantActive(get(litigant, 'litigant'));

  return (
    <Collapse
      className={classNames({'not-active': !isActive})}
      defaultOpen={collapseState !== undefined ? collapseState : isActive}
      headerSubtitles={
        <Fragment>
          <Column>
            <CollapseHeaderSubtitle><span>Osuus murtolukuna:</span> {get(litigant, 'share_numerator', '')} / {get(litigant, 'share_denominator', '')}</CollapseHeaderSubtitle>
          </Column>
          <Column>
            <CollapseHeaderSubtitle><span>Välillä:</span> {formatDateRange(get(litigant, 'litigant.start_date'), get(litigant, 'litigant.end_date')) || '-'}</CollapseHeaderSubtitle>
          </Column>
        </Fragment>
      }
      headerTitle={<CollapseHeaderTitle>{getContactFullName(contact)}</CollapseHeaderTitle>}
      onToggle={handleCollapseToggle}
    >
      <div>
        <LitigantItem
          contact={contact}
          litigant={litigant}
        />
        {litigant.litigantcontact_set && !!litigant.litigantcontact_set.length &&
          litigant.litigantcontact_set.map((person) => {
            return (
              <LitigantBillingPerson
                key={person.id}
                billingPerson={person}
              />
            );
          })
        }
      </div>
    </Collapse>
  );
};

export default connect(
  (state, props) => {
    const id = props.litigant.id;
    return {
      collapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.LITIGANTS}.litigants.${id}`),
    };
  },
  {
    receiveCollapseStates,
  }
)(Litigant);
