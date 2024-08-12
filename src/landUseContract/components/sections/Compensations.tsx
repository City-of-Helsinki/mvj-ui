import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import get from "lodash/get";
import Authorization from "@/components/authorization/Authorization";
import Divider from "@/components/content/Divider";
import FormText from "@/components/form/FormText";
import FormTextTitle from "@/components/form/FormTextTitle";
import GreenBox from "@/components/content/GreenBox";
import SubTitle from "@/components/content/SubTitle";
import WhiteBox from "@/components/content/WhiteBox";
import { getContentCompensations } from "@/landUseContract/helpers";
import { formatNumber } from "@/util/helpers";
import { getUserFullName } from "@/users/helpers";
import { getCurrentLandUseContract } from "@/landUseContract/selectors";
import { LandUseAgreementAttachmentFieldPaths } from "@/landUseAgreementAttachment/enums";
import type { LandUseContract } from "@/landUseContract/types";
import { getUiDataLandUseAgreementAttachmentKey } from "@/uiData/helpers";
import { getAttributes as getLandUseAgreementAttachmentAttributes } from "@/landUseAgreementAttachment/selectors";
import { formatDate, isFieldAllowedToRead } from "@/util/helpers";
import type { Attributes } from "types";
import FileDownloadLink from "@/components/file/FileDownloadLink";
import { getUsedPrice, getSum } from "@/landUseContract/helpers";
type Props = {
  currentLandUseContract: LandUseContract;
  landUseAgreementAttachmentAttributes: Attributes;
};

const Compensations = ({
  currentLandUseContract,
  landUseAgreementAttachmentAttributes
}: Props) => {
  const getTotal = (compensations: Record<string, any>) => {
    const cash = Number(get(compensations, 'cash_compensation'));
    const land = Number(get(compensations, 'land_compensation'));
    const other = Number(get(compensations, 'other_compensation'));
    const increase = Number(get(compensations, 'first_installment_increase'));
    return cash + land + other + increase;
  };

  const compensations = getContentCompensations(currentLandUseContract);
  const total = getTotal(compensations);
  const attachments = get(currentLandUseContract, 'attachments', []).filter(file => file.type === 'compensation_calculation');
  return <Fragment>
      <GreenBox>
        <Row>
          <Column small={12} large={6}>
            <SubTitle>Maankäyttökorvaus</SubTitle>
            <WhiteBox>
              <Row>
                <Column small={6} medium={3} large={4}>
                  <FormTextTitle title='Maankäyttökorvaus' />
                </Column>
                <Column small={6} medium={3} large={4}>
                  <FormTextTitle title='Korvauksen määrä' />
                </Column>
              </Row>
              <Row>
                <Column small={6} medium={3} large={4}>
                  <FormText>Rahakorvaus</FormText>
                </Column>
                <Column small={6} medium={3} large={4}>
                  <FormText>{compensations.cash_compensation ? `${formatNumber(compensations.cash_compensation)} €` : '-'}</FormText>
                </Column>
              </Row>
              <Row>
                <Column small={6} medium={3} large={4}>
                  <FormText>Maakorvaus</FormText>
                </Column>
                <Column small={6} medium={3} large={4}>
                  <FormText>{compensations.land_compensation ? `${formatNumber(compensations.land_compensation)} €` : '-'}</FormText>
                </Column>
              </Row>
              <Row>
                <Column small={6} medium={3} large={4}>
                  <FormText>Muu</FormText>
                </Column>
                <Column small={6} medium={3} large={4}>
                  <FormText>{compensations.other_compensation ? `${formatNumber(compensations.other_compensation)} €` : '-'}</FormText>
                </Column>
              </Row>
              <Row>
                <Column small={6} medium={3} large={4}>
                  <FormText className='no-margin'>1. maksuerän korotus</FormText>
                </Column>
                <Column small={6} medium={3} large={4}>
                  <FormText className='no-margin'>{compensations.first_installment_increase ? `${formatNumber(compensations.first_installment_increase)} €` : '-'}</FormText>
                </Column>
              </Row>
              <Divider />
              <Row>
                <Column small={6} medium={3} large={4}>
                  <FormText className='semibold'>Yhteensä</FormText>
                </Column>
                <Column small={6} medium={3} large={4}>
                  <FormText>{`${formatNumber(total)} €`}</FormText>
                </Column>
              </Row>
            </WhiteBox>
          </Column>
        </Row>
      </GreenBox>
      <GreenBox className={'with-top-margin'}>
        <Row>
          <Column small={12} large={6}>
            <SubTitle>Korvauksetta luovutettavat yleiset alueet</SubTitle>
            <WhiteBox>
              <Row>
                <Column small={6} medium={3} large={4}>
                  <FormTextTitle title='Kaavayksikön käyttötarkoitus' />
                </Column>
                <Column small={6} medium={3} large={4}>
                  <FormTextTitle title='Hankinta-arvo €' />
                </Column>
                <Column small={6} medium={3} large={4}>
                  <FormTextTitle title='m²' />
                </Column>
              </Row>
              <Row>
                <Column small={6} medium={3} large={4}>
                  <FormText>Katu (9901)</FormText>
                </Column>
                <Column small={6} medium={3} large={4}>
                  <FormText>{compensations.street_acquisition_value ? `${formatNumber(compensations.street_acquisition_value)} €` : '-'}</FormText>
                </Column>
                <Column small={6} medium={3} large={4}>
                  <FormText>{compensations.street_area ? `${formatNumber(compensations.street_area)} m²` : '-'}</FormText>
                </Column>
              </Row>
              <Row>
                <Column small={6} medium={3} large={4}>
                  <FormText>Puisto (9903)</FormText>
                </Column>
                <Column small={6} medium={3} large={4}>
                  <FormText>{compensations.park_acquisition_value ? `${formatNumber(compensations.park_acquisition_value)} €` : '-'}</FormText>
                </Column>
                <Column small={6} medium={3} large={4}>
                  <FormText>{compensations.park_area ? `${formatNumber(compensations.park_area)} m²` : '-'}</FormText>
                </Column>
              </Row>
              <Row>
                <Column small={6} medium={3} large={4}>
                  <FormText>Muut</FormText>
                </Column>
                <Column small={6} medium={3} large={4}>
                  <FormText>{compensations.other_acquisition_value ? `${formatNumber(compensations.other_acquisition_value)} €` : '-'}</FormText>
                </Column>
                <Column small={6} medium={3} large={4}>
                  <FormText>{compensations.other_area ? `${formatNumber(compensations.other_area)} m²` : '-'}</FormText>
                </Column>
              </Row>
            </WhiteBox>
          </Column>
        </Row>
      </GreenBox>
      <GreenBox className={'with-top-margin'}>
        <Row>
          <Column small={12} large={6}>
            <SubTitle>Maankäyttökorvaus laskelma</SubTitle>

            {!attachments.length && <FormText>Ei liitetiedostoja</FormText>}
            {!!attachments.length && <Fragment>
                <Row>
                  <Column small={3} large={4}>
                    <Authorization allow={isFieldAllowedToRead(landUseAgreementAttachmentAttributes, LandUseAgreementAttachmentFieldPaths.FILE)}>
                      <FormTextTitle uiDataKey={getUiDataLandUseAgreementAttachmentKey(LandUseAgreementAttachmentFieldPaths.FILE)}>
                        {'Tiedoston nimi'}
                      </FormTextTitle>
                    </Authorization>
                  </Column>
                  <Column small={3} large={2}>
                    <Authorization allow={isFieldAllowedToRead(landUseAgreementAttachmentAttributes, LandUseAgreementAttachmentFieldPaths.UPLOADED_AT)}>
                      <FormTextTitle uiDataKey={getUiDataLandUseAgreementAttachmentKey(LandUseAgreementAttachmentFieldPaths.UPLOADED_AT)}>
                        {'Ladattu'}
                      </FormTextTitle>
                    </Authorization>
                  </Column>
                  <Column small={3} large={2}>
                    <FormTextTitle uiDataKey={getUiDataLandUseAgreementAttachmentKey(LandUseAgreementAttachmentFieldPaths.UPLOADER)}>
                      {'Lataaja'}
                    </FormTextTitle>
                  </Column>
                </Row>

                {attachments.map((file, index) => {
              return <Row key={index}>
                      <Column small={3} large={4}>
                        <Authorization allow={isFieldAllowedToRead(landUseAgreementAttachmentAttributes, LandUseAgreementAttachmentFieldPaths.FILE)}>
                          <FileDownloadLink fileUrl={file.file} label={file.filename} />
                        </Authorization>
                      </Column>
                      <Column small={3} large={2}>
                        <Authorization allow={isFieldAllowedToRead(landUseAgreementAttachmentAttributes, LandUseAgreementAttachmentFieldPaths.UPLOADED_AT)}>
                          <FormText>{formatDate(file.uploaded_at) || '-'}</FormText>
                        </Authorization>
                      </Column>
                      <Column small={3} large={2}>
                        <FormText>{getUserFullName(file.uploader) || '-'}</FormText>
                      </Column>
                    </Row>;
            })}
              </Fragment>}
          </Column>
        </Row>
      </GreenBox>
      <GreenBox className={'with-top-margin'}>
        <Row>
          <Column small={12}>
            <SubTitle>Laskelmassa käytetyt yksikköhinnat</SubTitle>
            <WhiteBox>
              <Row>
                <Column large={2}>
                  <FormTextTitle title='Kaavayksikön käyttötarkoitus' />
                </Column>
                <Column large={2}>
                  <FormTextTitle title='Hallintamuoto' />
                </Column>
                <Column large={1}>
                  <FormTextTitle title='Suojeltu' />
                </Column>
                <Column large={1}>
                  <FormTextTitle title='k-m²' />
                </Column>
                <Column large={1}>
                  <FormTextTitle title='Yksikköhinta €' />
                </Column>
                <Column large={1}>
                  <FormTextTitle title='Alennus %' />
                </Column>
                <Column large={1}>
                  <FormTextTitle title='Käytetty hinta' />
                </Column>
                <Column large={1}>
                  <FormTextTitle title='Summa' />
                </Column>
              </Row>
              {compensations.unit_prices_used_in_calculation && compensations.unit_prices_used_in_calculation.map((calculation, index) => {
              const sum = getSum(calculation.area, getUsedPrice(calculation.unit_value, calculation.discount));
              return <Row key={index}>
                      <Column large={2}>
                        <FormText>{calculation.usage ? calculation.usage : '-'}</FormText>
                      </Column>
                      <Column large={2}>
                        <FormText>{calculation.management ? calculation.management : '-'}</FormText>
                      </Column>
                      <Column large={1}>
                        <FormText>{calculation.protected ? calculation.protected : '-'}</FormText>
                      </Column>
                      <Column large={1}>
                        <FormText>{calculation.area ? `${formatNumber(calculation.area)} m²` : '-'}</FormText>
                      </Column>
                      <Column large={1}>
                        <FormText>{calculation.unit_value ? `${formatNumber(calculation.unit_value)} €` : '-'}</FormText>
                      </Column>
                      <Column large={1}>
                        <FormText>{calculation.discount ? `${formatNumber(calculation.discount)} €` : '-'}</FormText>
                      </Column>
                      <Column large={1}>
                        <FormText>{calculation.used_price ? `${formatNumber(calculation.used_price)} €` : '-'}</FormText>
                      </Column>
                      <Column large={1}>
                        <FormText>{sum ? `${formatNumber(sum)} €` : '-'}</FormText>
                      </Column>
                    </Row>;
            })}
            </WhiteBox>
          </Column>
        </Row>
      </GreenBox>
    </Fragment>;
};

export default connect(state => {
  return {
    currentLandUseContract: getCurrentLandUseContract(state),
    landUseAgreementAttachmentAttributes: getLandUseAgreementAttachmentAttributes(state)
  };
})(Compensations);