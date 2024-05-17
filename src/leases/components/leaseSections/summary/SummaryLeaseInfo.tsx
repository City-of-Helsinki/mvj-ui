import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import classNames from "classnames";
import flowRight from "lodash/flowRight";
import get from "lodash/get";
import AmountWithVat from "src/components/vat/AmountWithVat";
import Authorization from "src/components/authorization/Authorization";
import BoxItem from "src/components/content/BoxItem";
import BoxItemContainer from "src/components/content/BoxItemContainer";
import Comments from "../constructability/Comments";
import ErrorBlock from "src/components/form/ErrorBlock";
import ExternalLink from "src/components/links/ExternalLink";
import FormText from "src/components/form/FormText";
import FormTextTitle from "src/components/form/FormTextTitle";
import ListItem from "src/components/content/ListItem";
import ListItems from "src/components/content/ListItems";
import SubTitle from "src/components/content/SubTitle";
import { Methods } from "src/enums";
import { AreaNoteFieldTitles } from "src/areaNote/enums";
import { InvoiceFieldPaths, InvoiceFieldTitles } from "src/invoices/enums";
import { ConstructabilityStatus, LeaseAreaAddressesFieldPaths, LeaseAreasFieldPaths } from "src/leases/enums";
import { UsersPermissions } from "src/usersPermissions/enums";
import { getContactFullName } from "src/contacts/helpers";
import { getContentOverdueInvoices } from "src/invoices/helpers";
import { getContentLeaseSummary, getFullAddress, getTenantShareWarnings } from "src/leases/helpers";
import { getUserFullName } from "src/users/helpers";
import { formatDate, formatDateRange, getFieldOptions, getLabelOfOption, hasPermissions, isFieldAllowedToRead, isMethodAllowed } from "src/util/helpers";
import { getRouteById, Routes } from "src/root/routes";
import { getAttributes as getInvoiceAttributes, getInvoicesByLease, getMethods as getInvoiceMethods } from "src/invoices/selectors";
import { getAttributes, getCurrentLease } from "src/leases/selectors";
import { getUsersPermissions } from "src/usersPermissions/selectors";
import { withWindowResize } from "src/components/resize/WindowResizeHandler";
import type { Attributes, Methods as MethodsType } from "src/types";
import type { Lease } from "src/leases/types";
import type { UsersPermissions as UsersPermissionsType } from "src/usersPermissions/types";
type StatusIndicatorProps = {
  researchState: string;
  stateOptions: Array<Record<string, any>>;
};

const StatusIndicator = ({
  researchState,
  stateOptions
}: StatusIndicatorProps) => <p className={classNames({
  'summary__status-indicator summary__status-indicator--neutral': !researchState || researchState === ConstructabilityStatus.UNVERIFIED
}, {
  'summary__status-indicator summary__status-indicator--alert': researchState === ConstructabilityStatus.REQUIRES_MEASURES
}, {
  'summary__status-indicator summary__status-indicator--success': researchState === ConstructabilityStatus.COMPLETE
}, {
  'summary__status-indicator summary__status-indicator--enquiry-sent': researchState === ConstructabilityStatus.ENQUIRY_SENT
})}>
    {getLabelOfOption(stateOptions, researchState || ConstructabilityStatus.UNVERIFIED)}
  </p>;

type TenantsProps = {
  largeScreen: boolean;
  tenants: Array<Record<string, any>>;
  tenantWarnings: Array<Record<string, any>>;
};

const Tenants = ({
  largeScreen,
  tenants,
  tenantWarnings
}: TenantsProps) => {
  if (largeScreen) {
    return <Fragment>
        {!!tenants.length && <Fragment>
            <Row>
              <Column large={4}>
                <FormTextTitle title='Vuokralainen' />
              </Column>
              <Column large={4}>
                <FormTextTitle title='Hallintaosuus' />
              </Column>
              <Column large={4}>
                <FormTextTitle title='Ajalla' />
              </Column>
            </Row>
            <ListItems>
              {tenants.map((contact, index) => {
            return <Row key={index}>
                    <Column large={4}>
                      <ListItem>
                        <ExternalLink className='no-margin' href={`${getRouteById(Routes.CONTACTS)}/${get(contact, 'tenant.contact.id')}`} text={getContactFullName(get(contact, 'tenant.contact')) || '-'} />
                      </ListItem>
                    </Column>
                    <Column large={4}><ListItem>{contact.share_numerator} / {contact.share_denominator}</ListItem></Column>
                    <Column large={4}><ListItem>{formatDateRange(contact.tenant.start_date, contact.tenant.end_date) || '-'}</ListItem></Column>
                  </Row>;
          })}
              {!!tenantWarnings.length && tenantWarnings.map((error, index) => <Row key={index}>
                  <Column large={4}></Column>
                  <Column large={4}>
                    <ErrorBlock error={error} />
                  </Column>
                </Row>)}
            </ListItems>
          </Fragment>}
      </Fragment>;
  } else {
    return <BoxItemContainer>
        {tenants.map((contact, index) => {
        return <BoxItem key={index} className='no-border-on-first-child no-border-on-last-child'>
              <Row key={index}>
                <Column small={6}>
                  <FormTextTitle title='Vuokralainen' />
                  <FormText>
                    <ExternalLink className='no-margin' href={`${getRouteById(Routes.CONTACTS)}/${get(contact, 'tenant.contact.id')}`} text={getContactFullName(get(contact, 'tenant.contact')) || '-'} />
                  </FormText>
                </Column>
                <Column small={6}>
                  <FormTextTitle title='Hallintaosuus' />
                  <FormText>{contact.share_numerator} / {contact.share_denominator}</FormText>
                </Column>
                <Column small={6}>
                  <FormTextTitle title='Ajalla' />
                  <FormText>{formatDateRange(contact.tenant.start_date, contact.tenant.end_date) || '-'}</FormText>
                </Column>
              </Row>
            </BoxItem>;
      })}
        {!!tenantWarnings.length && tenantWarnings.map((error, index) => <Row key={index}>
            <Column small={12}>
              <ErrorBlock error={error} />
            </Column>
          </Row>)}
      </BoxItemContainer>;
  }
};

type Props = {
  attributes: Attributes;
  currentLease: Lease;
  invoiceAttributes: Attributes;
  invoiceMethods: MethodsType;
  invoices: Array<Record<string, any>>;
  largeScreen: boolean;
  usersPermissions: UsersPermissionsType;
};

const SummaryLeaseInfo = ({
  attributes,
  currentLease,
  invoiceAttributes,
  invoiceMethods,
  invoices,
  largeScreen,
  usersPermissions
}: Props) => {
  const constructabilityStateOptions = getFieldOptions(attributes, LeaseAreasFieldPaths.PRECONSTRUCTION_STATE),
        summary = getContentLeaseSummary(currentLease),
        tenants = summary.tenants,
        tenantWarnings = getTenantShareWarnings(summary.tenants),
        leaseAreas = summary.lease_areas,
        constructabilityAreas = get(summary, 'constructability_areas', []);
  const overdueInvoices = getContentOverdueInvoices(invoices);
  return <Fragment>
      <SubTitle>Vuokralaiset</SubTitle>
      {!tenants.length && <FormText>Ei vuokralaisia</FormText>}
      <Tenants largeScreen={largeScreen} tenants={tenants} tenantWarnings={tenantWarnings} />

      <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.LEASE_AREAS)}>
        <SubTitle>Vuokrakohteet</SubTitle>
        {!leaseAreas.length && <FormText>Ei vuokrakohteita</FormText>}
        {!!leaseAreas.length && <Fragment>
            <Row>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.IDENTIFIER)}>
                <Column small={6} large={4}>
                  <FormTextTitle title='Kohteen tunnus' />
                </Column>
              </Authorization>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaAddressesFieldPaths.ADDRESSES)}>
                <Column small={6} large={8}>
                  <FormTextTitle title='Kohteen osoite' />
                </Column>
              </Authorization>
            </Row>
            {leaseAreas.map((area, index) => {
          return <ListItems key={index}>
                  <Row>
                    <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.IDENTIFIER)}>
                      <Column small={6} large={4}>
                        <ListItem>{area.identifier || '-'}</ListItem>
                      </Column>
                    </Authorization>
                    <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaAddressesFieldPaths.ADDRESSES)}>
                      <Column small={6} large={8}>
                        {!area.addresses || !area.addresses.length && <ListItem>-</ListItem>}

                        {!!area.addresses && !!area.addresses.length && area.addresses.map((address, index) => {
                    return <ListItem key={index}>{getFullAddress(address)}</ListItem>;
                  })}
                      </Column>
                    </Authorization>
                  </Row>
                </ListItems>;
        })}
          </Fragment>}
      </Authorization>

      <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.LEASE_AREAS)}>
        <SubTitle>Rakentamiskelpoisuus</SubTitle>
        {!constructabilityAreas.length && <FormText>Ei vuokrakohteita</FormText>}
        {!!constructabilityAreas.length && constructabilityAreas.map((area, index) => {
        const descriptionsDemolition = area.descriptionsDemolition.filter(item => item.is_static);
        const descriptionsOther = area.descriptionsOther.filter(item => item.is_static);
        const descriptionsPollutedLand = area.descriptionsPollutedLand.filter(item => item.is_static);
        const descriptionsPreconstruction = area.descriptionsPreconstruction.filter(item => item.is_static);
        const descriptionsReport = area.descriptionsReport.filter(item => item.is_static);
        return <ListItems key={index}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.IDENTIFIER)}>
                <Row>
                  <Column><ListItem><strong>{area.identifier || '-'}</strong></ListItem></Column>
                </Row>
              </Authorization>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.PRECONSTRUCTION_STATE)}>
                <Row>
                  <Column small={6} large={4}>
                    <ListItem>Esirakentaminen, johtosiirrot, kunnallistekniikka</ListItem>
                  </Column>
                  <Column small={6} large={4}>
                    <StatusIndicator researchState={area.preconstruction_state} stateOptions={constructabilityStateOptions} />
                  </Column>
                  <Column small={12} large={4}>
                    <Comments commentClassName='no-border-on-first-child' comments={descriptionsPreconstruction} showNoDataText={false} showTitle={false} />
                  </Column>
                </Row>
              </Authorization>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.DEMOLITION_STATE)}>
                <Row>
                  <Column small={6} large={4}>
                    <ListItem>Purku</ListItem>
                  </Column>
                  <Column small={6} large={4}>
                    <StatusIndicator researchState={area.demolition_state} stateOptions={constructabilityStateOptions} />
                  </Column>
                  <Column small={12} large={4}>
                    <Comments commentClassName='no-border-on-first-child' comments={descriptionsDemolition} showNoDataText={false} showTitle={false} />
                  </Column>
                </Row>
              </Authorization>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.POLLUTED_LAND_STATE)}>
                <Row>
                  <Column small={6} large={4}>
                    <ListItem>Pima ja jäte</ListItem>
                  </Column>
                  <Column small={6} large={4}>
                    <StatusIndicator researchState={area.polluted_land_state} stateOptions={constructabilityStateOptions} />
                  </Column>
                  <Column small={12} large={4}>
                    <Comments commentClassName='no-border-on-first-child' comments={descriptionsPollutedLand} showNoDataText={false} showTitle={false} />
                  </Column>
                </Row>
              </Authorization>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.CONSTRUCTABILITY_REPORT_STATE)}>
                <Row>
                  <Column small={6} large={4}>
                    <ListItem>Rakennettavuusselvitys</ListItem>
                  </Column>
                  <Column small={6} large={4}>
                    <StatusIndicator researchState={area.constructability_report_state} stateOptions={constructabilityStateOptions} />
                  </Column>
                  <Column small={12} large={4}>
                    <Comments commentClassName='no-border-on-first-child' comments={descriptionsReport} showNoDataText={false} showTitle={false} />
                  </Column>
                </Row>
              </Authorization>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.OTHER_STATE)}>
                <Row>
                  <Column small={6} large={4}>
                    <ListItem>Muut</ListItem>
                  </Column>
                  <Column small={6} large={4}>
                    <StatusIndicator researchState={area.other_state} stateOptions={constructabilityStateOptions} />
                  </Column>
                  <Column small={12} large={4}>
                    <Comments commentClassName='no-border-on-first-child' comments={descriptionsOther} showNoDataText={false} showTitle={false} />
                  </Column>
                </Row>
              </Authorization>
            </ListItems>;
      })}
      </Authorization>

      <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.VIEW_LEASE_LEASE_AREAS) || hasPermissions(usersPermissions, UsersPermissions.CHANGE_LEASE_LEASE_AREAS)}>
        {!!summary.area_notes.length && <Fragment>
            <SubTitle>{AreaNoteFieldTitles.AREA_NOTES}</SubTitle>
            <Row>
              <Column small={4}>
                <FormTextTitle>{AreaNoteFieldTitles.MODIFIED_AT}</FormTextTitle>
              </Column>
              <Column small={4}>
                <FormTextTitle>{AreaNoteFieldTitles.USER}</FormTextTitle>
              </Column>
              <Column small={4}>
                <FormTextTitle>{AreaNoteFieldTitles.NOTE}</FormTextTitle>
              </Column>
            </Row>
            <ListItems>
              {summary.area_notes.map((areaNote, index) => {
            return <Row key={index}>
                    <Column small={4}>
                      <ListItem>{formatDate(areaNote.modified_at) || '-'}</ListItem>
                    </Column>
                    <Column small={4}>
                      <ListItem>{getUserFullName(areaNote.user) || '-'}</ListItem>
                    </Column>
                    <Column small={4} style={{
                lineHeight: 1
              }}>
                      <ExternalLink className='no-margin' href={`${getRouteById(Routes.AREA_NOTES)}/?area_note=${areaNote.id}`} text={areaNote.note || '-'} />
                    </Column>
                  </Row>;
          })}
            </ListItems>
          </Fragment>}
      </Authorization>

      <Authorization allow={isMethodAllowed(invoiceMethods, Methods.GET)}>
        {!!overdueInvoices.length && <Fragment>
            <SubTitle>Erääntyneet laskut</SubTitle>
            {largeScreen && <Fragment>
                <Row>
                  <Column large={4}>
                    <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.RECIPIENT)}>
                      <FormTextTitle>{InvoiceFieldTitles.RECIPIENT}</FormTextTitle>
                    </Authorization>
                  </Column>
                  <Column large={2}>
                    <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.DUE_DATE)}>
                      <FormTextTitle>{InvoiceFieldTitles.DUE_DATE}</FormTextTitle>
                    </Authorization>
                  </Column>
                  <Column large={2}>
                    <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.NUMBER)}>
                      <FormTextTitle>{InvoiceFieldTitles.NUMBER}</FormTextTitle>
                    </Authorization>
                  </Column>
                  <Column large={2}>
                    <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.BILLING_PERIOD_START_DATE) || isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.BILLING_PERIOD_END_DATE)}>
                      <FormTextTitle>{InvoiceFieldTitles.BILLING_PERIOD}</FormTextTitle>
                    </Authorization>
                  </Column>
                  <Column large={2}>
                    <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.OUTSTANDING_AMOUNT)}>
                      <FormTextTitle>{InvoiceFieldTitles.OUTSTANDING_AMOUNT}</FormTextTitle>
                    </Authorization>
                  </Column>
                </Row>
                <ListItems>
                  {overdueInvoices.map((invoice, index) => {
              return <Row key={index}>
                        <Column large={4}>
                          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.RECIPIENT)}>
                            <ListItem>{getContactFullName(invoice.recipientFull) || '-'}</ListItem>
                          </Authorization>
                        </Column>
                        <Column large={2}>
                          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.DUE_DATE)}>
                            <ListItem>{formatDate(invoice.due_date) || '-'}</ListItem>
                          </Authorization>
                        </Column>
                        <Column large={2}>
                          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.NUMBER)}>
                            <ListItem>{invoice.number || '-'}</ListItem>
                          </Authorization>
                        </Column>
                        <Column large={2}>
                          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.BILLING_PERIOD_START_DATE) || isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.BILLING_PERIOD_END_DATE)}>
                            <ListItem>{formatDateRange(invoice.billing_period_start_date, invoice.billing_period_end_date) || '-'}</ListItem>
                          </Authorization>
                        </Column>
                        <Column large={2}>
                          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.OUTSTANDING_AMOUNT)}>
                            <ListItem><AmountWithVat amount={invoice.outstanding_amount || 0} date={invoice.due_date} /></ListItem>
                          </Authorization>
                        </Column>
                      </Row>;
            })}
                </ListItems>
              </Fragment>}

            {!largeScreen && <BoxItemContainer>
                {overdueInvoices.map((invoice, index) => {
            return <BoxItem key={index} className='no-border-on-first-child no-border-on-last-child'>
                      <Row>
                        <Column small={6}>
                          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.RECIPIENT)}>
                            <FormTextTitle>{InvoiceFieldTitles.RECIPIENT}</FormTextTitle>
                            <FormText>{getContactFullName(invoice.recipientFull) || '-'}</FormText>
                          </Authorization>
                        </Column>
                        <Column small={6}>
                          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.DUE_DATE)}>
                            <FormTextTitle>{InvoiceFieldTitles.DUE_DATE}</FormTextTitle>
                            <FormText>{formatDate(invoice.due_date) || '-'}</FormText>
                          </Authorization>
                        </Column>
                        <Column small={6}>
                          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.NUMBER)}>
                            <FormTextTitle>{InvoiceFieldTitles.NUMBER}</FormTextTitle>
                            <FormText>{invoice.number || '-'}</FormText>
                          </Authorization>
                        </Column>
                        <Column small={6}>
                          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.BILLING_PERIOD_START_DATE) || isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.BILLING_PERIOD_END_DATE)}>
                            <FormTextTitle>{InvoiceFieldTitles.BILLING_PERIOD}</FormTextTitle>
                            <FormText>{formatDateRange(invoice.billing_period_start_date, invoice.billing_period_end_date) || '-'}</FormText>
                          </Authorization>
                        </Column>
                        <Column small={6}>
                          <Authorization allow={isFieldAllowedToRead(invoiceAttributes, InvoiceFieldPaths.OUTSTANDING_AMOUNT)}>
                            <FormTextTitle>{InvoiceFieldTitles.OUTSTANDING_AMOUNT}</FormTextTitle>
                            <FormText><AmountWithVat amount={invoice.outstanding_amount || 0} date={invoice.due_date} /></FormText>
                          </Authorization>
                        </Column>
                      </Row>
                    </BoxItem>;
          })}
              </BoxItemContainer>}

          </Fragment>}
      </Authorization>
    </Fragment>;
};

export default flowRight(withWindowResize, connect(state => {
  const currentLease = getCurrentLease(state);
  return {
    attributes: getAttributes(state),
    currentLease: currentLease,
    invoiceAttributes: getInvoiceAttributes(state),
    invoiceMethods: getInvoiceMethods(state),
    invoices: getInvoicesByLease(state, currentLease.id),
    usersPermissions: getUsersPermissions(state)
  };
}))(SummaryLeaseInfo);