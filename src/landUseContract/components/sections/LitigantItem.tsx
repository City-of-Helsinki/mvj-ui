import React, { Fragment } from "react";
import { Row, Column } from "react-foundation";
import get from "lodash/get";
import ContactTemplate from "@/contacts/components/templates/ContactTemplate";
import ExternalLink from "@/components/links/ExternalLink";
import FormTitleAndText from "@/components/form/FormTitleAndText";
import FormWrapper from "@/components/form/FormWrapper";
import FormWrapperLeft from "@/components/form/FormWrapperLeft";
import FormWrapperRight from "@/components/form/FormWrapperRight";
import SubTitle from "@/components/content/SubTitle";
import { getContactFullName } from "@/contacts/helpers";
import { formatDate } from "@/util/helpers";
import { getRouteById, Routes } from "@/root/routes";
type Props = {
  contact: Record<string, any> | null | undefined;
  litigant: Record<string, any>;
};

const LitigantItem = ({ contact, litigant }: Props) => {
  if (!contact) {
    return null;
  }

  return (
    <Fragment>
      <FormWrapper>
        <FormWrapperLeft>
          <Row>
            <Column>
              <FormTitleAndText
                title="Asiakas"
                text={
                  contact ? (
                    <ExternalLink
                      className="no-margin"
                      href={`${getRouteById(Routes.CONTACTS)}/${contact.id}`}
                      text={getContactFullName(contact)}
                    />
                  ) : (
                    "-"
                  )
                }
              />
            </Column>
          </Row>
        </FormWrapperLeft>
        <FormWrapperRight>
          <Row>
            <Column small={12} medium={6} large={4}>
              <Row>
                <Column>
                  <FormTitleAndText
                    title="Alkupvm"
                    text={formatDate(get(litigant, "litigant.start_date"))}
                  />
                </Column>
                <Column>
                  <FormTitleAndText
                    title="Loppupvm"
                    text={formatDate(get(litigant, "litigant.end_date"))}
                  />
                </Column>
              </Row>
            </Column>
          </Row>
        </FormWrapperRight>

        <FormWrapperLeft>
          <Row>
            <Column>
              <FormTitleAndText
                title="Viite"
                text={litigant.reference || "-"}
              />
            </Column>
          </Row>
        </FormWrapperLeft>
      </FormWrapper>

      <SubTitle>Asiakkaan tiedot</SubTitle>
      <ContactTemplate contact={contact} />
    </Fragment>
  );
};

export default LitigantItem;
