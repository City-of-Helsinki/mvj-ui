import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import get from "lodash/get";
import Collapse from "/src/components/collapse/Collapse";
import ExternalLink from "/src/components/links/ExternalLink";
import FormText from "/src/components/form/FormText";
import FormTextTitle from "/src/components/form/FormTextTitle";
import ListItem from "/src/components/content/ListItem";
import ListItems from "/src/components/content/ListItems";
import Loader from "/src/components/loader/Loader";
import LoaderWrapper from "/src/components/loader/LoaderWrapper";
import ShowMore from "/src/components/showMore/ShowMore";
import SubTitle from "/src/components/content/SubTitle";
import { receiveCollapseStates } from "/src/tradeRegister/actions";
import { CollapseStatePaths, CompanyStates, CompanyExtendedFieldPaths, CompanyExtendedFieldTitles } from "/src/tradeRegister/enums";
import { getUiDataTradeRegisterCompanyExtendedKey } from "/src/uiData/helpers";
import { formatDate, formatNumber, formatNumberWithThousandSeparator } from "util/helpers";
import { getCollapseStateByKey, getCompanyExtendedById, getIsFetchingCompanyExtendedById } from "/src/tradeRegister/selectors";
type Props = {
  businessId: string;
  companyExtended: Record<string, any> | null | undefined;
  companyExtendedCollapseState: boolean | null | undefined;
  companyNameCollapseState: boolean | null | undefined;
  contactInformationCollapseState: boolean | null | undefined;
  isFetchingCompanyExtended: boolean;
  receiveCollapseStates: (...args: Array<any>) => any;
};

const CompanyExtended = ({
  businessId,
  companyExtended,
  companyExtendedCollapseState,
  companyNameCollapseState,
  contactInformationCollapseState,
  isFetchingCompanyExtended,
  receiveCollapseStates
}: Props) => {
  const handleCollapseToggleCompanyExtended = (val: boolean) => {
    receiveCollapseStates({
      [`${CollapseStatePaths.COMPANY_EXTENDED}.${businessId}`]: val
    });
  };

  const handleCollapseToggleCompanyName = (val: boolean) => {
    receiveCollapseStates({
      [`${CollapseStatePaths.COMPANY_EXTENDED}.${CompanyExtendedFieldPaths.COMPANY_NAME}.${businessId}`]: val
    });
  };

  const handleCollapseToggleContactInformation = (val: boolean) => {
    receiveCollapseStates({
      [`${CollapseStatePaths.COMPANY_EXTENDED}.${CompanyExtendedFieldPaths.CONTACT_INFORMATION}.${businessId}`]: val
    });
  };

  const auxiliaryCompanyNames = get(companyExtended, CompanyExtendedFieldPaths.AUXILIARY_COMPANY_NAMES, []);
  const parallelCompanyNames = get(companyExtended, CompanyExtendedFieldPaths.PARALLEL_COMPANY_NAMES, []);
  const historicalNames = get(companyExtended, CompanyExtendedFieldPaths.HISTORICAL_NAMES, []);
  if (companyExtended === undefined && !isFetchingCompanyExtended) return null;
  return <Collapse defaultOpen={companyExtendedCollapseState !== undefined ? companyExtendedCollapseState : true} headerTitle={CompanyExtendedFieldTitles.COMPANY_EXTENDED} onToggle={handleCollapseToggleCompanyExtended} enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.COMPANY_EXTENDED)}>
      {isFetchingCompanyExtended && <LoaderWrapper>
          <Loader isLoading={isFetchingCompanyExtended} />
        </LoaderWrapper>}
      {!isFetchingCompanyExtended && <Fragment>
          {!companyExtended && <FormText>Laajennetut perustiedot ei saatavilla</FormText>}
          {!!companyExtended && <Fragment>
              <Row>
                <Column small={12} medium={4} large={2}>
                  <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.COMPANY_NAME_NAME)}>
                    {CompanyExtendedFieldTitles.COMPANY_NAME_NAME}
                  </FormTextTitle>
                  <FormText>{get(companyExtended, CompanyExtendedFieldPaths.COMPANY_NAME_NAME) || '-'}</FormText>
                </Column>
                <Column small={12} medium={8} large={6}>
                  <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.LINE_OF_BUSINESS)}>
                    {CompanyExtendedFieldTitles.LINE_OF_BUSINESS}
                  </FormTextTitle>
                  <ShowMore className='no-margin' text={get(companyExtended, CompanyExtendedFieldPaths.LINE_OF_BUSINESS) || '-'} />
                </Column>
                <Column small={12} medium={4} large={2}>
                  <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.COMPANY_NAME_REGISTRATION_DATE)}>
                    {CompanyExtendedFieldTitles.COMPANY_NAME_REGISTRATION_DATE}
                  </FormTextTitle>
                  <FormText>{formatDate(get(companyExtended, CompanyExtendedFieldPaths.COMPANY_NAME_REGISTRATION_DATE)) || '-'}</FormText>
                </Column>
                <Column small={12} medium={4} large={2}>
                  <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.COMPANY_NAME_EXPIRATION_DATE)}>
                    {CompanyExtendedFieldTitles.COMPANY_NAME_EXPIRATION_DATE}
                  </FormTextTitle>
                  <FormText>{formatDate(get(companyExtended, CompanyExtendedFieldPaths.COMPANY_NAME_EXPIRATION_DATE)) || '-'}</FormText>
                </Column>
              </Row>

              <Row>
                <Column small={12} medium={4} large={2}>
                  <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.BUSINESS_ID)}>
                    {CompanyExtendedFieldTitles.BUSINESS_ID}
                  </FormTextTitle>
                  <FormText>{get(companyExtended, CompanyExtendedFieldPaths.BUSINESS_ID) || '-'}</FormText>
                </Column>
                <Column small={12} medium={4} large={2}>
                  <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.REGISTRATION_NUMBER)}>
                    {CompanyExtendedFieldTitles.REGISTRATION_NUMBER}
                  </FormTextTitle>
                  <FormText>{get(companyExtended, CompanyExtendedFieldPaths.REGISTRATION_NUMBER) || '-'}</FormText>
                </Column>
                <Column small={12} medium={4} large={2}>
                  <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.REGISTRATION_DATE)}>
                    {CompanyExtendedFieldTitles.REGISTRATION_DATE}
                  </FormTextTitle>
                  <FormText>{formatDate(get(companyExtended, CompanyExtendedFieldPaths.REGISTRATION_DATE)) || '-'}</FormText>
                </Column>
                <Column small={12} medium={4} large={2}>
                  <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.DISSOLUTION_DATE)}>
                    {CompanyExtendedFieldTitles.DISSOLUTION_DATE}
                  </FormTextTitle>
                  <FormText>{formatDate(get(companyExtended, CompanyExtendedFieldPaths.DISSOLUTION_DATE)) || '-'}</FormText>
                </Column>
              </Row>

              <Row>
                <Column small={12} medium={4} large={2}>
                  <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.FORM_TYPE)}>
                    {CompanyExtendedFieldTitles.FORM_TYPE}
                  </FormTextTitle>
                  <FormText>{get(companyExtended, CompanyExtendedFieldPaths.FORM_TYPE) || '-'}</FormText>
                </Column>
                <Column small={12} medium={4} large={2}>
                  <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.FORM_REGISTRATION_DATE)}>
                    {CompanyExtendedFieldTitles.FORM_REGISTRATION_DATE}
                  </FormTextTitle>
                  <FormText>{formatDate(get(companyExtended, CompanyExtendedFieldPaths.FORM_REGISTRATION_DATE)) || '-'}</FormText>
                </Column>
                <Column small={12} medium={4} large={2}>
                  <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.FORM_EXPIRATION_DATE)}>
                    {CompanyExtendedFieldTitles.FORM_EXPIRATION_DATE}
                  </FormTextTitle>
                  <FormText>{formatDate(get(companyExtended, CompanyExtendedFieldPaths.FORM_EXPIRATION_DATE)) || '-'}</FormText>
                </Column>
              </Row>

              <Row>
                <Column small={12} medium={4} large={2}>
                  <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.STATE_TYPE)}>
                    {CompanyExtendedFieldTitles.STATE_TYPE}
                  </FormTextTitle>
                  <FormText>{CompanyStates[get(companyExtended, CompanyExtendedFieldPaths.STATE_TYPE)] || get(companyExtended, CompanyExtendedFieldPaths.STATE_TYPE) || '-'}</FormText>
                </Column>
                <Column small={12} medium={4} large={2}>
                  <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.STATE_REGISTRATION_DATE)}>
                    {CompanyExtendedFieldTitles.STATE_REGISTRATION_DATE}
                  </FormTextTitle>
                  <FormText>{formatDate(get(companyExtended, CompanyExtendedFieldPaths.STATE_REGISTRATION_DATE)) || '-'}</FormText>
                </Column>
                <Column small={12} medium={4} large={2}>
                  <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.STATE_EXPIRATION_DATE)}>
                    {CompanyExtendedFieldTitles.STATE_EXPIRATION_DATE}
                  </FormTextTitle>
                  <FormText>{formatDate(get(companyExtended, CompanyExtendedFieldPaths.STATE_EXPIRATION_DATE)) || '-'}</FormText>
                </Column>
              </Row>

              <Row>
                <Column small={12} medium={4} large={2}>
                  <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.DOMICILE_CODE)}>
                    {CompanyExtendedFieldTitles.DOMICILE_CODE}
                  </FormTextTitle>
                  <FormText>{get(companyExtended, CompanyExtendedFieldPaths.DOMICILE_CODE) || '-'}</FormText>
                </Column>
                <Column small={12} medium={4} large={2}>
                  <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.DOMICILE_REGISTRATION_DATE)}>
                    {CompanyExtendedFieldTitles.DOMICILE_REGISTRATION_DATE}
                  </FormTextTitle>
                  <FormText>{formatDate(get(companyExtended, CompanyExtendedFieldPaths.DOMICILE_REGISTRATION_DATE)) || '-'}</FormText>
                </Column>
                <Column small={12} medium={4} large={2}>
                  <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.DOMICILE_EXPIRATION_DATE)}>
                    {CompanyExtendedFieldTitles.DOMICILE_EXPIRATION_DATE}
                  </FormTextTitle>
                  <FormText>{formatDate(get(companyExtended, CompanyExtendedFieldPaths.DOMICILE_EXPIRATION_DATE)) || '-'}</FormText>
                </Column>
              </Row>

              <Row>
                <Column small={12} medium={8} large={4}>
                  <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.DELIVERY_DATE_OF_LAST_FINANCIAL_STATEMENT)}>
                    {CompanyExtendedFieldTitles.DELIVERY_DATE_OF_LAST_FINANCIAL_STATEMENT}
                  </FormTextTitle>
                  <FormText>{formatDate(get(companyExtended, CompanyExtendedFieldPaths.DELIVERY_DATE_OF_LAST_FINANCIAL_STATEMENT)) || '-'}</FormText>
                </Column>
              </Row>

              <SubTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.SHARE_CAPITAL)}>
                {CompanyExtendedFieldTitles.SHARE_CAPITAL}
              </SubTitle>

              <Row>
                <Column small={12} medium={4} large={2}>
                  <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.SHARE_CAPITAL_AMOUNT_OF_SHARES)}>
                    {CompanyExtendedFieldTitles.SHARE_CAPITAL_AMOUNT_OF_SHARES}
                  </FormTextTitle>
                  <FormText>{formatNumberWithThousandSeparator(get(companyExtended, CompanyExtendedFieldPaths.SHARE_CAPITAL_AMOUNT_OF_SHARES)) || '-'}</FormText>
                </Column>
                <Column small={12} medium={4} large={2}>
                  <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.SHARE_CAPITAL_CURRENCY)}>
                    {CompanyExtendedFieldTitles.SHARE_CAPITAL_CURRENCY}
                  </FormTextTitle>
                  <FormText>{get(companyExtended, CompanyExtendedFieldPaths.SHARE_CAPITAL_CURRENCY) || '-'}</FormText>
                </Column>
                <Column small={12} medium={4} large={2}>
                  <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.SHARE_CAPITAL_VALUE)}>
                    {CompanyExtendedFieldTitles.SHARE_CAPITAL_VALUE}
                  </FormTextTitle>
                  <FormText>{formatNumber(get(companyExtended, CompanyExtendedFieldPaths.SHARE_CAPITAL_VALUE)) || '-'}</FormText>
                </Column>
                <Column small={12} medium={4} large={2}>
                  <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.SHARE_CAPITAL_PAID_VALUE)}>
                    {CompanyExtendedFieldTitles.SHARE_CAPITAL_PAID_VALUE}
                  </FormTextTitle>
                  <FormText>{formatNumber(get(companyExtended, CompanyExtendedFieldPaths.SHARE_CAPITAL_PAID_VALUE)) || '-'}</FormText>
                </Column>
                <Column small={12} medium={4} large={2}>
                  <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.SHARE_CAPITAL_NOMINAL_VALUE)}>
                    {CompanyExtendedFieldTitles.SHARE_CAPITAL_NOMINAL_VALUE}
                  </FormTextTitle>
                  <FormText>{formatNumber(get(companyExtended, CompanyExtendedFieldPaths.SHARE_CAPITAL_NOMINAL_VALUE)) || '-'}</FormText>
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={4} large={2}>
                  <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.SHARE_CAPITAL_REGISTARATION_DATE)}>
                    {CompanyExtendedFieldTitles.SHARE_CAPITAL_REGISTARATION_DATE}
                  </FormTextTitle>
                  <FormText>{formatDate(get(companyExtended, CompanyExtendedFieldPaths.SHARE_CAPITAL_REGISTARATION_DATE)) || '-'}</FormText>
                </Column>
                <Column small={12} medium={4} large={2}>
                  <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.SHARE_CAPITAL_EXPIRATION_DATE)}>
                    {CompanyExtendedFieldTitles.SHARE_CAPITAL_EXPIRATION_DATE}
                  </FormTextTitle>
                  <FormText>{formatDate(get(companyExtended, CompanyExtendedFieldPaths.SHARE_CAPITAL_EXPIRATION_DATE)) || '-'}</FormText>
                </Column>
              </Row>

              <Collapse className='collapse__secondary' defaultOpen={companyNameCollapseState !== undefined ? companyNameCollapseState : false} headerTitle={CompanyExtendedFieldTitles.COMPANY_NAME} onToggle={handleCollapseToggleCompanyName} enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.COMPANY_NAME)}>
                <SubTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.PARALLEL_COMPANY_NAMES)}>
                  {CompanyExtendedFieldTitles.PARALLEL_COMPANY_NAMES}
                </SubTitle>
                {!parallelCompanyNames.length && <FormText>Ei rinnakkaistoiminimiä</FormText>}
                {!!parallelCompanyNames.length && <Fragment>
                    <Row>
                      <Column small={4} large={2}>
                        <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.PARALLEL_COMPANY_NAMES_NAME)}>
                          {CompanyExtendedFieldTitles.PARALLEL_COMPANY_NAMES_NAME}
                        </FormTextTitle>
                      </Column>
                      <Column small={4} large={2}>
                        <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.PARALLEL_COMPANY_NAMES_REGISTRATION_DATE)}>
                          {CompanyExtendedFieldTitles.PARALLEL_COMPANY_NAMES_REGISTRATION_DATE}
                        </FormTextTitle>
                      </Column>
                      <Column small={4} large={2}>
                        <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.PARALLEL_COMPANY_NAMES_EXPIRATION_DATE)}>
                          {CompanyExtendedFieldTitles.PARALLEL_COMPANY_NAMES_EXPIRATION_DATE}
                        </FormTextTitle>
                      </Column>
                    </Row>
                    <ListItems>
                      {parallelCompanyNames.map((name, index) => {
                return <Row key={index}>
                            <Column small={4} large={2}>
                              <ListItem>{name.name || '-'}</ListItem>
                            </Column>
                            <Column small={4} large={2}>
                              <ListItem>{formatDate(name.registrationDate) || '-'}</ListItem>
                            </Column>
                            <Column small={4} large={2}>
                              <ListItem>{formatDate(name.expidationDate) || '-'}</ListItem>
                            </Column>
                          </Row>;
              })}
                    </ListItems>
                  </Fragment>}

                <SubTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.AUXILIARY_COMPANY_NAMES)}>
                  {CompanyExtendedFieldTitles.AUXILIARY_COMPANY_NAMES}
                </SubTitle>
                {!auxiliaryCompanyNames.length && <FormText>Ei aputoiminimiä</FormText>}
                {!!auxiliaryCompanyNames.length && <Fragment>
                    <Row>
                      <Column small={3} large={2}>
                        <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.AUXILIARY_COMPANY_NAMES_NAME)}>
                          {CompanyExtendedFieldTitles.AUXILIARY_COMPANY_NAMES_NAME}
                        </FormTextTitle>
                      </Column>
                      <Column small={3} large={6}>
                        <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.AUXILIARY_COMPANY_NAMES_LINE_OF_BUSINESS)}>
                          {CompanyExtendedFieldTitles.AUXILIARY_COMPANY_NAMES_LINE_OF_BUSINESS}
                        </FormTextTitle>
                      </Column>
                      <Column small={3} large={2}>
                        <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.AUXILIARY_COMPANY_NAMES_REGISTRATION_DATE)}>
                          {CompanyExtendedFieldTitles.AUXILIARY_COMPANY_NAMES_REGISTRATION_DATE}
                        </FormTextTitle>
                      </Column>
                      <Column small={3} large={2}>
                        <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.AUXILIARY_COMPANY_NAMES_EXPIRATION_DATE)}>
                          {CompanyExtendedFieldTitles.AUXILIARY_COMPANY_NAMES_EXPIRATION_DATE}
                        </FormTextTitle>
                      </Column>
                    </Row>
                    <ListItems>
                      {auxiliaryCompanyNames.map((name, index) => {
                return <Row key={index}>
                            <Column small={3} large={2}>
                              <ListItem>{name.name || '-'}</ListItem>
                            </Column>
                            <Column small={3} large={6}>
                              <ShowMore className='no-margin' text={name.lineOfBusiness || '-'} />
                            </Column>
                            <Column small={3} large={2}>
                              <ListItem>{formatDate(name.registrationDate) || '-'}</ListItem>
                            </Column>
                            <Column small={3} large={2}>
                              <ListItem>{formatDate(name.expidationDate) || '-'}</ListItem>
                            </Column>
                          </Row>;
              })}
                    </ListItems>
                  </Fragment>}

                <SubTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.HISTORICAL_NAMES)}>
                  {CompanyExtendedFieldTitles.HISTORICAL_NAMES}
                </SubTitle>
                {!historicalNames.length && <FormText>Ei entisiä nimiä</FormText>}
                {!!historicalNames.length && <Fragment>
                    <Row>
                      <Column small={4} large={2}>
                        <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.HISTORICAL_NAMES_NAME)}>
                          {CompanyExtendedFieldTitles.HISTORICAL_NAMES_NAME}
                        </FormTextTitle>
                      </Column>
                      <Column small={4} large={2}>
                        <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.HISTORICAL_NAMES_REGISTRATION_DATE)}>
                          {CompanyExtendedFieldTitles.HISTORICAL_NAMES_REGISTRATION_DATE}
                        </FormTextTitle>
                      </Column>
                      <Column small={4} large={2}>
                        <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.HISTORICAL_NAMES_EXPIRATION_DATE)}>
                          {CompanyExtendedFieldTitles.HISTORICAL_NAMES_EXPIRATION_DATE}
                        </FormTextTitle>
                      </Column>
                    </Row>
                    <ListItems>
                      {historicalNames.map((name, index) => {
                return <Row key={index}>
                            <Column small={4} large={2}>
                              <ListItem>{name.name || '-'}</ListItem>
                            </Column>
                            <Column small={4} large={2}>
                              <ListItem>{formatDate(name.registrationDate) || '-'}</ListItem>
                            </Column>
                            <Column small={4} large={2}>
                              <ListItem>{formatDate(name.expidationDate) || '-'}</ListItem>
                            </Column>
                          </Row>;
              })}
                    </ListItems>
                  </Fragment>}
              </Collapse>

              <Collapse className='collapse__secondary' defaultOpen={contactInformationCollapseState !== undefined ? contactInformationCollapseState : false} headerTitle={CompanyExtendedFieldTitles.CONTACT_INFORMATION} onToggle={handleCollapseToggleContactInformation} enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.CONTACT_INFORMATION)}>
                <Row>
                  <Column small={12} medium={4} large={4}>
                    <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.CONTACT_INFORMATION_HOMEPAGE)}>
                      {CompanyExtendedFieldTitles.CONTACT_INFORMATION_HOMEPAGE}
                    </FormTextTitle>
                    {get(companyExtended, CompanyExtendedFieldPaths.CONTACT_INFORMATION_HOMEPAGE) ? <ExternalLink href={get(companyExtended, CompanyExtendedFieldPaths.CONTACT_INFORMATION_HOMEPAGE)} text={get(companyExtended, CompanyExtendedFieldPaths.CONTACT_INFORMATION_HOMEPAGE)} /> : <FormText>-</FormText>}
                  </Column>
                  <Column small={12} medium={4} large={4}>
                    <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.CONTACT_INFORMATION_EMAIL)}>
                      {CompanyExtendedFieldTitles.CONTACT_INFORMATION_EMAIL}
                    </FormTextTitle>
                    <FormText>{get(companyExtended, CompanyExtendedFieldPaths.CONTACT_INFORMATION_EMAIL) || '-'}</FormText>
                  </Column>
                  <Column small={12} medium={4} large={2}>
                    <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.CONTACT_INFORMATION_PHONE)}>
                      {CompanyExtendedFieldTitles.CONTACT_INFORMATION_PHONE}
                    </FormTextTitle>
                    <FormText>{get(companyExtended, CompanyExtendedFieldPaths.CONTACT_INFORMATION_PHONE, []).join(', ') || '-'}</FormText>
                  </Column>
                  <Column small={12} medium={4} large={2}>
                    <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.CONTACT_INFORMATION_FAX)}>
                      {CompanyExtendedFieldTitles.CONTACT_INFORMATION_FAX}
                    </FormTextTitle>
                    <FormText>{get(companyExtended, CompanyExtendedFieldPaths.CONTACT_INFORMATION_FAX, []).join(', ') || '-'}</FormText>
                  </Column>
                </Row>

                <SubTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.CONTACT_INFORMATION_POSTAL)}>
                  {CompanyExtendedFieldTitles.CONTACT_INFORMATION_POSTAL}
                </SubTitle>

                <Row>
                  <Column small={12} medium={4} large={2}>
                    <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.CONTACT_INFORMATION_POSTAL_CO)}>
                      {CompanyExtendedFieldTitles.CONTACT_INFORMATION_POSTAL_CO}
                    </FormTextTitle>
                    <FormText>{get(companyExtended, CompanyExtendedFieldPaths.CONTACT_INFORMATION_POSTAL_CO) || '-'}</FormText>
                  </Column>
                  <Column small={12} medium={4} large={2}>
                    <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.CONTACT_INFORMATION_POSTAL_STREET_ADDRESS)}>
                      {CompanyExtendedFieldTitles.CONTACT_INFORMATION_POSTAL_STREET_ADDRESS}
                    </FormTextTitle>
                    <FormText>{get(companyExtended, CompanyExtendedFieldPaths.CONTACT_INFORMATION_POSTAL_STREET_ADDRESS) || '-'}</FormText>
                  </Column>
                  <Column small={12} medium={4} large={2}>
                    <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.CONTACT_INFORMATION_POSTAL_ZIP_CODE)}>
                      {CompanyExtendedFieldTitles.CONTACT_INFORMATION_POSTAL_ZIP_CODE}
                    </FormTextTitle>
                    <FormText>{get(companyExtended, CompanyExtendedFieldPaths.CONTACT_INFORMATION_POSTAL_ZIP_CODE) || '-'}</FormText>
                  </Column>
                  <Column small={12} medium={4} large={2}>
                    <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.CONTACT_INFORMATION_POSTAL_CITY)}>
                      {CompanyExtendedFieldTitles.CONTACT_INFORMATION_POSTAL_CITY}
                    </FormTextTitle>
                    <FormText>{get(companyExtended, CompanyExtendedFieldPaths.CONTACT_INFORMATION_POSTAL_CITY) || '-'}</FormText>
                  </Column>
                  <Column small={12} medium={4} large={2}>
                    <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.CONTACT_INFORMATION_POSTAL_COUNTRY)}>
                      {CompanyExtendedFieldTitles.CONTACT_INFORMATION_POSTAL_COUNTRY}
                    </FormTextTitle>
                    <FormText>{get(companyExtended, CompanyExtendedFieldPaths.CONTACT_INFORMATION_POSTAL_COUNTRY) || '-'}</FormText>
                  </Column>
                </Row>

                <SubTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.CONTACT_INFORMATION_VISITATION)}>
                  {CompanyExtendedFieldTitles.CONTACT_INFORMATION_VISITATION}
                </SubTitle>

                <Row>
                  <Column small={12} medium={4} large={2}>
                    <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.CONTACT_INFORMATION_VISITATION_CO)}>
                      {CompanyExtendedFieldTitles.CONTACT_INFORMATION_VISITATION_CO}
                    </FormTextTitle>
                    <FormText>{get(companyExtended, CompanyExtendedFieldPaths.CONTACT_INFORMATION_VISITATION_CO) || '-'}</FormText>
                  </Column>
                  <Column small={12} medium={4} large={2}>
                    <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.CONTACT_INFORMATION_VISITATION_STREET_ADDRESS)}>
                      {CompanyExtendedFieldTitles.CONTACT_INFORMATION_VISITATION_STREET_ADDRESS}
                    </FormTextTitle>
                    <FormText>{get(companyExtended, CompanyExtendedFieldPaths.CONTACT_INFORMATION_VISITATION_STREET_ADDRESS) || '-'}</FormText>
                  </Column>
                  <Column small={12} medium={4} large={2}>
                    <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.CONTACT_INFORMATION_VISITATION_ZIP_CODE)}>
                      {CompanyExtendedFieldTitles.CONTACT_INFORMATION_VISITATION_ZIP_CODE}
                    </FormTextTitle>
                    <FormText>{get(companyExtended, CompanyExtendedFieldPaths.CONTACT_INFORMATION_VISITATION_ZIP_CODE) || '-'}</FormText>
                  </Column>
                  <Column small={12} medium={4} large={2}>
                    <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.CONTACT_INFORMATION_VISITATION_CITY)}>
                      {CompanyExtendedFieldTitles.CONTACT_INFORMATION_VISITATION_CITY}
                    </FormTextTitle>
                    <FormText>{get(companyExtended, CompanyExtendedFieldPaths.CONTACT_INFORMATION_VISITATION_CITY) || '-'}</FormText>
                  </Column>
                  <Column small={12} medium={4} large={2}>
                    <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyExtendedKey(CompanyExtendedFieldPaths.CONTACT_INFORMATION_VISITATION_COUNTRY)}>
                      {CompanyExtendedFieldTitles.CONTACT_INFORMATION_VISITATION_COUNTRY}
                    </FormTextTitle>
                    <FormText>{get(companyExtended, CompanyExtendedFieldPaths.CONTACT_INFORMATION_VISITATION_COUNTRY) || '-'}</FormText>
                  </Column>
                </Row>
              </Collapse>
            </Fragment>}
        </Fragment>}
    </Collapse>;
};

export default connect((state, props: Props) => {
  return {
    companyExtended: getCompanyExtendedById(state, props.businessId),
    companyExtendedCollapseState: getCollapseStateByKey(state, `${CollapseStatePaths.COMPANY_EXTENDED}.${props.businessId}`),
    companyNameCollapseState: getCollapseStateByKey(state, `${CollapseStatePaths.COMPANY_EXTENDED}.${CompanyExtendedFieldTitles.COMPANY_NAME}.${props.businessId}`),
    contactInformationCollapseState: getCollapseStateByKey(state, `${CollapseStatePaths.COMPANY_EXTENDED}.${CompanyExtendedFieldTitles.CONTACT_INFORMATION}.${props.businessId}`),
    isFetchingCompanyExtended: getIsFetchingCompanyExtendedById(state, props.businessId)
  };
}, {
  receiveCollapseStates
})(CompanyExtended);