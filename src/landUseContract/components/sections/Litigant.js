// @flow
import React from 'react';
import {connect} from 'react-redux';
import get from 'lodash/get';
import {Column} from 'react-foundation';
import classNames from 'classnames';

import Collapse from '$components/collapse/Collapse';
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
      header={
        <div>
          <Column>
            <span className={'collapse__header-subtitle'}>
              <label>Osuus murtolukuna:</label>
              {get(litigant, 'share_numerator', '')} / {get(litigant, 'share_denominator', '')}
            </span>
          </Column>
          <Column>
            <span className={'collapse__header-subtitle'}>
              <label>Välillä:</label>
              {formatDateRange(get(litigant, 'litigant.start_date'), get(litigant, 'litigant.end_date')) || '-'}
            </span>
          </Column>
        </div>
      }
      headerTitle={<h3 className='collapse__header-title'>{getContactFullName(contact)}</h3>}
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
