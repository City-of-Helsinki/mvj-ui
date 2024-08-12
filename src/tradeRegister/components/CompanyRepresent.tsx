import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import flowRight from "lodash/flowRight";
import get from "lodash/get";
import BoxItem from "@/components/content/BoxItem";
import BoxItemContainer from "@/components/content/BoxItemContainer";
import Collapse from "@/components/collapse/Collapse";
import FormText from "@/components/form/FormText";
import FormTextTitle from "@/components/form/FormTextTitle";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import ShowMore from "@/components/showMore/ShowMore";
import SubTitle from "@/components/content/SubTitle";
import { receiveCollapseStates } from "@/tradeRegister/actions";
import { CollapseStatePaths, CompanyRepresentFieldPaths, CompanyRepresentFieldTitles } from "@/tradeRegister/enums";
import { formatDate } from "@/util/helpers";
import { getUiDataTradeRegisterCompanyRepresentKey } from "@/uiData/helpers";
import { getCollapseStateByKey, getCompanyRepresentById, getIsFetchingCompanyRepresentById } from "@/tradeRegister/selectors";
type JusristicPersonProps = {
  person: Record<string, any>;
};

const JuristicPerson = ({
  person
}: JusristicPersonProps) => {
  return <Row>
      <Column small={6} medium={4} large={2}>
        <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyRepresentKey(CompanyRepresentFieldPaths.BODY_VALUE_1_JURISTIC_PERSON_ROLE)}>
          {CompanyRepresentFieldTitles.BODY_VALUE_1_JURISTIC_PERSON_ROLE}
        </FormTextTitle>
        <FormText>{person.role || '-'}</FormText>
      </Column>
      <Column small={6} medium={4} large={2}>
        <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyRepresentKey(CompanyRepresentFieldPaths.BODY_VALUE_1_JURISTIC_PERSON_NAME)}>
          {CompanyRepresentFieldTitles.BODY_VALUE_1_JURISTIC_PERSON_NAME}
        </FormTextTitle>
        <FormText>{person.name || '-'}</FormText>
      </Column>
      <Column small={6} medium={4} large={2}>
        <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyRepresentKey(CompanyRepresentFieldPaths.BODY_VALUE_1_JURISTIC_PERSON_BUSINESS_ID)}>
          {CompanyRepresentFieldTitles.BODY_VALUE_1_JURISTIC_PERSON_BUSINESS_ID}
        </FormTextTitle>
        <FormText>{person.businessId || '-'}</FormText>
      </Column>
      <Column small={6} medium={4} large={2}>
        <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyRepresentKey(CompanyRepresentFieldPaths.BODY_VALUE_1_JURISTIC_PERSON_REGISTER)}>
          {CompanyRepresentFieldTitles.BODY_VALUE_1_JURISTIC_PERSON_REGISTER}
        </FormTextTitle>
        <FormText>{person.register || '-'}</FormText>
      </Column>
      <Column small={6} medium={4} large={2}>
        <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyRepresentKey(CompanyRepresentFieldPaths.BODY_VALUE_1_JURISTIC_PERSON_REGISTRATION_NUMBER)}>
          {CompanyRepresentFieldTitles.BODY_VALUE_1_JURISTIC_PERSON_REGISTRATION_NUMBER}
        </FormTextTitle>
        <FormText>{person.registrationNumber || '-'}</FormText>
      </Column>
    </Row>;
};

type NaturalPersonProps = {
  person: Record<string, any>;
};

const NaturalPerson = ({
  person
}: NaturalPersonProps) => {
  return <Row>
      <Column small={6} medium={4} large={2}>
        <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyRepresentKey(CompanyRepresentFieldPaths.BODY_VALUE_1_NATURAL_PERSON_ROLE)}>
          {CompanyRepresentFieldTitles.BODY_VALUE_1_NATURAL_PERSON_ROLE}
        </FormTextTitle>
        <FormText>{person.role || '-'}</FormText>
      </Column>
      <Column small={6} medium={4} large={2}>
        <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyRepresentKey(CompanyRepresentFieldPaths.BODY_VALUE_1_NATURAL_PERSON_FIRSTNAME)}>
          {CompanyRepresentFieldTitles.BODY_VALUE_1_NATURAL_PERSON_FIRSTNAME}
        </FormTextTitle>
        <FormText>{person.firstname || '-'}</FormText>
      </Column>
      <Column small={6} medium={4} large={2}>
        <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyRepresentKey(CompanyRepresentFieldPaths.BODY_VALUE_1_NATURAL_PERSON_SURNAME)}>
          {CompanyRepresentFieldTitles.BODY_VALUE_1_NATURAL_PERSON_SURNAME}
        </FormTextTitle>
        <FormText>{person.surname || '-'}</FormText>
      </Column>
      <Column small={6} medium={4} large={2}>
        <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyRepresentKey(CompanyRepresentFieldPaths.BODY_VALUE_1_NATURAL_PERSON_DATE_OF_BIRTH)}>
          {CompanyRepresentFieldTitles.BODY_VALUE_1_NATURAL_PERSON_DATE_OF_BIRTH}
        </FormTextTitle>
        <FormText>{formatDate(person.dateOfBirth) || '-'}</FormText>
      </Column>
    </Row>;
};

type Props = {
  businessId: string;
  companyRepresent: Record<string, any> | null | undefined;
  companyRepresentCollapseState: boolean | null | undefined;
  companyRepresentBodyCollapseState: boolean | null | undefined;
  companyRepresentLegalRepresentationCollapseState: boolean | null | undefined;
  companyRepresentRepresentationCollapseState: boolean | null | undefined;
  isFetchingCompanyRepresent: boolean;
  receiveCollapseStates: (...args: Array<any>) => any;
};

const CompanyRepresent = ({
  businessId,
  companyRepresent,
  companyRepresentCollapseState,
  companyRepresentBodyCollapseState,
  companyRepresentLegalRepresentationCollapseState,
  companyRepresentRepresentationCollapseState,
  isFetchingCompanyRepresent,
  receiveCollapseStates
}: Props) => {
  const handleCollapseToggleCompanyRepresent = (val: boolean) => {
    receiveCollapseStates({
      [`${CollapseStatePaths.COMPANY_REPRESENT}.${businessId}`]: val
    });
  };

  const handleCollapseToggleCompanyRepresentBody = (val: boolean) => {
    receiveCollapseStates({
      [`${CollapseStatePaths.COMPANY_REPRESENT}.${CompanyRepresentFieldPaths.BODY}.${businessId}`]: val
    });
  };

  const handleCollapseToggleCompanyRepresentLegalRepresentation = (val: boolean) => {
    receiveCollapseStates({
      [`${CollapseStatePaths.COMPANY_REPRESENT}.${CompanyRepresentFieldPaths.LEGAL_REPRESENTATION}.${businessId}`]: val
    });
  };

  const handleCollapseToggleCompanyRepresentRepresentation = (val: boolean) => {
    receiveCollapseStates({
      [`${CollapseStatePaths.COMPANY_REPRESENT}.${CompanyRepresentFieldPaths.REPRESENTATION}.${businessId}`]: val
    });
  };

  const body = get(companyRepresent, CompanyRepresentFieldPaths.BODY, []);
  const legalRepresentation = get(companyRepresent, CompanyRepresentFieldPaths.LEGAL_REPRESENTATION, []);
  const representation = get(companyRepresent, CompanyRepresentFieldPaths.REPRESENTATION, []);
  if (companyRepresent === undefined && !isFetchingCompanyRepresent) return null;
  return <Collapse defaultOpen={companyRepresentCollapseState !== undefined ? companyRepresentCollapseState : false} headerTitle={CompanyRepresentFieldTitles.REPRESENT_TITLE} onToggle={handleCollapseToggleCompanyRepresent} enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyRepresentKey(CompanyRepresentFieldPaths.REPRESENT_TITLE)}>
      {isFetchingCompanyRepresent && <LoaderWrapper>
          <Loader isLoading={isFetchingCompanyRepresent} />
        </LoaderWrapper>}
      {!isFetchingCompanyRepresent && <Fragment>
          {!companyRepresent && <FormText>Edustamistiedot ei saatavilla</FormText>}
          {!!companyRepresent && <Fragment>
              <Collapse className='collapse__secondary' defaultOpen={companyRepresentBodyCollapseState !== undefined ? companyRepresentBodyCollapseState : true} headerTitle={CompanyRepresentFieldTitles.BODY} onToggle={handleCollapseToggleCompanyRepresentBody} enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyRepresentKey(CompanyRepresentFieldPaths.BODY)}>
                {!body.length && <FormText>Ei päättäjätietoja</FormText>}

                {!!body.length && body.map((item, index) => {
            const persons = get(item, '_value_1', []);
            return <Fragment key={index}>
                      <SubTitle>{item.type}</SubTitle>
                      {!persons.length && <FormText>Tietoa ei saatavilla</FormText>}
                      {!!persons.length && <BoxItemContainer>
                          {persons.map((person, index) => {
                  const naturalPerson = person.naturalPerson;
                  const juristicPerson = person.juristicPerson;

                  if (naturalPerson) {
                    return <BoxItem key={index} className='no-border-on-first-child no-border-on-last-child'>
                                  <NaturalPerson person={naturalPerson} />
                                </BoxItem>;
                  } else if (juristicPerson) {
                    return <BoxItem key={index} className='no-border-on-first-child no-border-on-last-child'>
                                  <JuristicPerson person={juristicPerson} />
                                </BoxItem>;
                  }

                  return null;
                })}
                        </BoxItemContainer>}
                    </Fragment>;
          })}
              </Collapse>

              <Collapse className='collapse__secondary' defaultOpen={companyRepresentRepresentationCollapseState !== undefined ? companyRepresentRepresentationCollapseState : true} headerTitle={CompanyRepresentFieldTitles.REPRESENTATION} onToggle={handleCollapseToggleCompanyRepresentRepresentation} enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyRepresentKey(CompanyRepresentFieldPaths.REPRESENTATION)}>
                {!representation.length && <FormText>Ei edustamistietoja</FormText>}

                {!!representation.length && representation.map((item, index) => {
            const naturalPersons = get(item, 'group.naturalPerson', []);
            const juristicPersons = get(item, 'group.juristicPerson', []);
            const additionalGroup = item.additionalGroup;
            const additionalGroupNaturalPersons = get(additionalGroup, 'naturalPerson', []);
            const additionalGroupJuristicPersons = get(additionalGroup, 'juristicPerson', []);
            return <Fragment key={index}>
                      <SubTitle>{item.rule}</SubTitle>
                      <BoxItemContainer>
                        {!!naturalPersons.length && naturalPersons.map((person, index) => {
                  return <BoxItem key={index} className='no-border-on-first-child no-border-on-last-child'>
                              <NaturalPerson person={person} />
                            </BoxItem>;
                })}
                        {!!juristicPersons.length && juristicPersons.map((person, index) => {
                  return <BoxItem key={index} className='no-border-on-first-child no-border-on-last-child'>
                              <JuristicPerson person={person} />
                            </BoxItem>;
                })}
                      </BoxItemContainer>

                      {!!additionalGroup && <Fragment>
                          <SubTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyRepresentKey(CompanyRepresentFieldPaths.REPRESENTATION_ADDITIONAL_GROUP)}>
                            {CompanyRepresentFieldTitles.REPRESENTATION_ADDITIONAL_GROUP}
                          </SubTitle>
                          <BoxItemContainer>
                            {!!additionalGroupNaturalPersons.length && additionalGroupNaturalPersons.map((person, index) => {
                    return <BoxItem key={index} className='no-border-on-first-child no-border-on-last-child'>
                                  <NaturalPerson person={person} />
                                </BoxItem>;
                  })}
                            {!!additionalGroupJuristicPersons.length && additionalGroupJuristicPersons.map((person, index) => {
                    return <BoxItem key={index} className='no-border-on-first-child no-border-on-last-child'>
                                  <JuristicPerson person={person} />
                                </BoxItem>;
                  })}
                          </BoxItemContainer>
                        </Fragment>}
                    </Fragment>;
          })}
              </Collapse>

              <Collapse className='collapse__secondary' defaultOpen={companyRepresentLegalRepresentationCollapseState !== undefined ? companyRepresentLegalRepresentationCollapseState : true} headerTitle={CompanyRepresentFieldTitles.LEGAL_REPRESENTATION} onToggle={handleCollapseToggleCompanyRepresentLegalRepresentation} enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyRepresentKey(CompanyRepresentFieldPaths.REPRESENTATION)}>
                {!legalRepresentation.length && <FormText>Ei edustamislausekkeita</FormText>}
                {!!legalRepresentation.length && <BoxItemContainer>
                    {!!legalRepresentation.length && legalRepresentation.map((item, index) => {
              return <BoxItem key={index} className='no-border-on-first-child no-border-on-last-child'>
                          <Row>
                            <Column small={12} medium={4} large={2}>
                              <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyRepresentKey(CompanyRepresentFieldPaths.LEGAL_REPRESENTATION_HEADER)}>
                                {CompanyRepresentFieldTitles.LEGAL_REPRESENTATION_HEADER}
                              </FormTextTitle>
                              <FormText>{item.header || '-'}</FormText>
                            </Column>
                            <Column small={12} medium={8} large={4}>
                              <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyRepresentKey(CompanyRepresentFieldPaths.LEGAL_REPRESENTATION_TEXT)}>
                                {CompanyRepresentFieldTitles.LEGAL_REPRESENTATION_TEXT}
                              </FormTextTitle>
                              <ShowMore text={item.text || '-'} />
                            </Column>
                            <Column small={12} medium={4} large={2}>
                              <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyRepresentKey(CompanyRepresentFieldPaths.LEGAL_REPRESENTATION_SIGNING_CODE)}>
                                {CompanyRepresentFieldTitles.LEGAL_REPRESENTATION_SIGNING_CODE}
                              </FormTextTitle>
                              <FormText>{item.signingCode || '-'}</FormText>
                            </Column>
                            <Column small={12} medium={4} large={2}>
                              <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyRepresentKey(CompanyRepresentFieldPaths.LEGAL_REPRESENTATION_REGISTRATION_DATE)}>
                                {CompanyRepresentFieldTitles.LEGAL_REPRESENTATION_REGISTRATION_DATE}
                              </FormTextTitle>
                              <FormText>{formatDate(item.registrationDate) || '-'}</FormText>
                            </Column>
                            <Column small={12} medium={4} large={2}>
                              <FormTextTitle enableUiDataEdit uiDataKey={getUiDataTradeRegisterCompanyRepresentKey(CompanyRepresentFieldPaths.LEGAL_REPRESENTATION_EXPIRE_DATE)}>
                                {CompanyRepresentFieldTitles.LEGAL_REPRESENTATION_EXPIRE_DATE}
                              </FormTextTitle>
                              <FormText>{formatDate(item.expireDate) || '-'}</FormText>
                            </Column>
                          </Row>
                        </BoxItem>;
            })}
                  </BoxItemContainer>}
              </Collapse>
            </Fragment>}
        </Fragment>}
    </Collapse>;
};

export default flowRight(connect((state, props: Props) => {
  return {
    companyRepresent: getCompanyRepresentById(state, props.businessId),
    companyRepresentCollapseState: getCollapseStateByKey(state, `${CollapseStatePaths.COMPANY_REPRESENT}.${props.businessId}`),
    companyRepresentBodyCollapseState: getCollapseStateByKey(state, `${CollapseStatePaths.COMPANY_REPRESENT}.${CompanyRepresentFieldPaths.BODY}.${props.businessId}`),
    companyRepresentLegalRepresentationCollapseState: getCollapseStateByKey(state, `${CollapseStatePaths.COMPANY_REPRESENT}.${CompanyRepresentFieldPaths.LEGAL_REPRESENTATION}.${props.businessId}`),
    companyRepresentRepresentationCollapseState: getCollapseStateByKey(state, `${CollapseStatePaths.COMPANY_REPRESENT}.${CompanyRepresentFieldPaths.REPRESENTATION}.${props.businessId}`),
    isFetchingCompanyRepresent: getIsFetchingCompanyRepresentById(state, props.businessId)
  };
}, {
  receiveCollapseStates
}))(CompanyRepresent);