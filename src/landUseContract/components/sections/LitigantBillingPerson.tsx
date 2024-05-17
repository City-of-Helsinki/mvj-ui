import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import Collapse from "src/components/collapse/Collapse";
import CollapseHeaderSubtitle from "src/components/collapse/CollapseHeaderSubtitle";
import ContactTemplate from "src/contacts/components/templates/ContactTemplate";
import ExternalLink from "src/components/links/ExternalLink";
import FormTitleAndText from "src/components/form/FormTitleAndText";
import FormWrapper from "src/components/form/FormWrapper";
import FormWrapperLeft from "src/components/form/FormWrapperLeft";
import FormWrapperRight from "src/components/form/FormWrapperRight";
import SubTitle from "src/components/content/SubTitle";
import { receiveCollapseStates } from "src/landUseContract/actions";
import { FormNames, ViewModes } from "src/enums";
import { getContactFullName } from "src/contacts/helpers";
import { formatDate, formatDateRange, isActive, isArchived } from "src/util/helpers";
import { getRouteById, Routes } from "src/root/routes";
import { getCollapseStateByKey } from "src/landUseContract/selectors";
type Props = {
  billingPerson: Record<string, any>;
  collapseState: boolean;
  receiveCollapseStates: (...args: Array<any>) => any;
};

const LitigantBillingPerson = ({
  billingPerson,
  collapseState,
  receiveCollapseStates
}: Props) => {
  const handleCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.LAND_USE_CONTRACT_LITIGANTS]: {
          billing_persons: {
            [billingPerson.id]: val
          }
        }
      }
    });
  };

  const contact = billingPerson.contact;
  const active = isActive(billingPerson);
  const archived = isArchived(billingPerson);
  const collapseDefault = collapseState !== undefined ? collapseState : active;
  return <Collapse archived={archived} className={'collapse__secondary'} defaultOpen={collapseDefault} headerSubtitles={<Fragment>
          <Column></Column>
          <Column>
            <CollapseHeaderSubtitle><span>Välillä:</span> {formatDateRange(billingPerson.start_date, billingPerson.end_date) || '-'}</CollapseHeaderSubtitle>
          </Column>
        </Fragment>} headerTitle='Laskunsaaja' onToggle={handleCollapseToggle}>
      <FormWrapper>
        <FormWrapperLeft>
          <Row>
            <Column small={12}>
              <FormTitleAndText title='Asiakas' text={contact ? <ExternalLink className='no-margin' href={`${getRouteById(Routes.CONTACTS)}/${contact.id}`} text={getContactFullName(contact)} /> : '-'} />
            </Column>
          </Row>
        </FormWrapperLeft>
        <FormWrapperRight>
          <Row>
            <Column small={12} medium={6} large={4}>
              <Row>
                <Column>
                  <FormTitleAndText title='Alkupvm' text={formatDate(billingPerson.start_date) || '-'} />
                </Column>
                <Column>
                  <FormTitleAndText title='Loppupvm' text={formatDate(billingPerson.end_date) || '-'} />
                </Column>
              </Row>
            </Column>
          </Row>
        </FormWrapperRight>
      </FormWrapper>

      <SubTitle>Asiakkaan tiedot</SubTitle>
      <ContactTemplate contact={contact} />
    </Collapse>;
};

export default connect((state, props) => {
  const id = props.billingPerson.id;
  return {
    collapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.LAND_USE_CONTRACT_LITIGANTS}.billing_persons.${id}`)
  };
}, {
  receiveCollapseStates
})(LitigantBillingPerson);