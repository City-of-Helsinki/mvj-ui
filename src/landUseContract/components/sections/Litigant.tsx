import React, { Fragment } from "react";
import { connect } from "react-redux";
import get from "lodash/get";
import { Column } from "react-foundation";
import Collapse from "/src/components/collapse/Collapse";
import CollapseHeaderSubtitle from "/src/components/collapse/CollapseHeaderSubtitle";
import LitigantBillingPerson from "./LitigantBillingPerson";
import LitigantItem from "./LitigantItem";
import { receiveCollapseStates } from "/src/landUseContract/actions";
import { FormNames, ViewModes } from "enums";
import { getContactFullName } from "/src/contacts/helpers";
import { formatDateRange, isActive, isArchived } from "util/helpers";
import { getCollapseStateByKey } from "/src/landUseContract/selectors";
type Props = {
  collapseState: boolean;
  litigant: Record<string, any>;
  receiveCollapseStates: (...args: Array<any>) => any;
};

const Litigant = ({
  collapseState,
  litigant,
  receiveCollapseStates
}: Props) => {
  const handleCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.LAND_USE_CONTRACT_LITIGANTS]: {
          litigants: {
            [litigant.id]: val
          }
        }
      }
    });
  };

  const contact = get(litigant, 'litigant.contact');
  const active = isActive(litigant.litigant);
  const archived = isArchived(litigant.litigant);
  return <Collapse archived={archived} defaultOpen={collapseState !== undefined ? collapseState : active} headerSubtitles={<Fragment>
          <Column>
            <CollapseHeaderSubtitle><span>Hallintaosuus:</span> {get(litigant, 'share_numerator', '')} / {get(litigant, 'share_denominator', '')}</CollapseHeaderSubtitle>
          </Column>
          <Column>
            <CollapseHeaderSubtitle><span>Välillä:</span> {formatDateRange(get(litigant, 'litigant.start_date'), get(litigant, 'litigant.end_date')) || '-'}</CollapseHeaderSubtitle>
          </Column>
        </Fragment>} headerTitle={getContactFullName(contact)} onToggle={handleCollapseToggle}>
      <LitigantItem contact={contact} litigant={litigant} />
      {litigant.landuseagreementlitigantcontact_set && !!litigant.landuseagreementlitigantcontact_set.length && litigant.landuseagreementlitigantcontact_set.map(person => {
      return <LitigantBillingPerson key={person.id} billingPerson={person} />;
    })}
    </Collapse>;
};

export default connect((state, props) => {
  const id = props.litigant.id;
  return {
    collapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.LAND_USE_CONTRACT_LITIGANTS}.litigants.${id}`)
  };
}, {
  receiveCollapseStates
})(Litigant);