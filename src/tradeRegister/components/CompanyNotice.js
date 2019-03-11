// @flow
import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import Collapse from '$components/collapse/Collapse';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import ListItem from '$components/content/ListItem';
import ListItems from '$components/content/ListItems';
import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import {receiveCollapseStates} from '$src/tradeRegister/actions';
import {
  CollapseStatePaths,
  CompanyNoticeFieldPaths,
  CompanyNoticeFieldTitles,
} from '$src/tradeRegister/enums';
import {formatDate} from '$util/helpers';
import {getUiDataTradeRegisterCompanyNoticeKey} from '$src/uiData/helpers';
import {
  getCollapseStateByKey,
  getCompanyNoticeById,
  getIsFetchingCompanyNoticeById,
} from '$src/tradeRegister/selectors';
import {withWindowResize} from '$components/resize/WindowResizeHandler';

type Props = {
  businessId: string,
  companyNotice: ?Object,
  companyNoticeCollapseState: ?boolean,
  isFetchingCompanyNotice: boolean,
  largeScreen: boolean,
  receiveCollapseStates: Function,
}

const CompanyNotice = ({
  businessId,
  companyNotice,
  companyNoticeCollapseState,
  isFetchingCompanyNotice,
  largeScreen,
  receiveCollapseStates,
}: Props) => {
  const handleCollapseToggleCompanyNotice = (val: boolean) => {
    receiveCollapseStates({
      [`${CollapseStatePaths.COMPANY_NOTICE}.${businessId}`]: val,
    });
  };

  const notices = get(companyNotice, CompanyNoticeFieldPaths.NOTICE, []);

  if(companyNotice === undefined && !isFetchingCompanyNotice) return null;

  return (
    <Collapse
      defaultOpen={companyNoticeCollapseState !== undefined ? companyNoticeCollapseState : false}
      headerTitle={CompanyNoticeFieldTitles.NOTICE}
      onToggle={handleCollapseToggleCompanyNotice}
      enableUiDataEdit
      uiDataKey={getUiDataTradeRegisterCompanyNoticeKey(CompanyNoticeFieldPaths.NOTICE)}
    >
      {isFetchingCompanyNotice &&
        <LoaderWrapper>
          <Loader isLoading={isFetchingCompanyNotice} />
        </LoaderWrapper>
      }
      {!isFetchingCompanyNotice &&
        <Fragment>
          {!companyNotice &&
            <FormText>Vireillä olevat ilmoitukset ei saatavilla</FormText>
          }
          {!!companyNotice &&
            <Fragment>
              {!notices.length && <FormText>Ei vireillä olevia ilmoituksia</FormText>}

              {!!notices.length &&
                <Fragment>
                  {largeScreen &&
                    <Fragment>
                      <Row>
                        <Column large={2}>
                          <FormTextTitle enableUiDataEdit uiDataKey={CompanyNoticeFieldPaths.NOTICE_TYPE}>
                            {CompanyNoticeFieldTitles.NOTICE_TYPE}
                          </FormTextTitle>
                        </Column>
                        <Column large={2}>
                          <FormTextTitle enableUiDataEdit uiDataKey={CompanyNoticeFieldPaths.NOTICE_RECORD_NUMBER}>
                            {CompanyNoticeFieldTitles.NOTICE_RECORD_NUMBER}
                          </FormTextTitle>
                        </Column>
                        <Column large={2}>
                          <FormTextTitle enableUiDataEdit uiDataKey={CompanyNoticeFieldPaths.NOTICE_ARRIVAL_DATE}>
                            {CompanyNoticeFieldTitles.NOTICE_ARRIVAL_DATE}
                          </FormTextTitle>
                        </Column>
                        <Column large={2}>
                          <FormTextTitle enableUiDataEdit uiDataKey={CompanyNoticeFieldPaths.NOTICE_LATEST_PHASE_ARRIVAL_DATE}>
                            {CompanyNoticeFieldTitles.NOTICE_LATEST_PHASE_ARRIVAL_DATE}
                          </FormTextTitle>
                        </Column>
                        <Column large={2}>
                          <FormTextTitle enableUiDataEdit uiDataKey={CompanyNoticeFieldPaths.NOTICE_LATEST_PHASE_NAME}>
                            {CompanyNoticeFieldTitles.NOTICE_LATEST_PHASE_NAME}
                          </FormTextTitle>
                        </Column>
                      </Row>

                      <ListItems>
                        {notices.map((notice, index) => {
                          return (
                            <Row key={index}>
                              <Column large={2}>
                                <ListItem>{notice.type || '-'}</ListItem>
                              </Column>
                              <Column large={2}>
                                <ListItem>{notice.recordNumber || '-'}</ListItem>
                              </Column>
                              <Column large={2}>
                                <ListItem>{formatDate(notice.arrivalDate) || '-'}</ListItem>
                              </Column>
                              <Column large={2}>
                                <ListItem>{formatDate(notice.latestPhaseArrivalDate) || '-'}</ListItem>
                              </Column>
                              <Column large={2}>
                                <ListItem>{notice.latestPhaseName || '-'}</ListItem>
                              </Column>
                            </Row>
                          );
                        })}
                      </ListItems>
                    </Fragment>
                  }
                  {!largeScreen &&
                    <BoxItemContainer>
                      {notices.map((notice, index) => {
                        return(
                          <BoxItem key={index} className='no-border-on-first-child no-border-on-last-child'>
                            <Row>
                              <Column small={12} medium={4}>
                                <FormTextTitle enableUiDataEdit uiDataKey={CompanyNoticeFieldPaths.NOTICE_TYPE}>
                                  {CompanyNoticeFieldTitles.NOTICE_TYPE}
                                </FormTextTitle>
                                <FormText>{notice.type || '-'}</FormText>
                              </Column>
                              <Column small={12} medium={4}>
                                <FormTextTitle enableUiDataEdit uiDataKey={CompanyNoticeFieldPaths.NOTICE_RECORD_NUMBER}>
                                  {CompanyNoticeFieldTitles.NOTICE_RECORD_NUMBER}
                                </FormTextTitle>
                                <FormText>{notice.recordNumber || '-'}</FormText>
                              </Column>
                              <Column small={12} medium={4}>
                                <FormTextTitle enableUiDataEdit uiDataKey={CompanyNoticeFieldPaths.NOTICE_ARRIVAL_DATE}>
                                  {CompanyNoticeFieldTitles.NOTICE_ARRIVAL_DATE}
                                </FormTextTitle>
                                <FormText>{formatDate(notice.arrivalDate) || '-'}</FormText>
                              </Column>
                              <Column small={12} medium={4}>
                                <FormTextTitle enableUiDataEdit uiDataKey={CompanyNoticeFieldPaths.NOTICE_LATEST_PHASE_ARRIVAL_DATE}>
                                  {CompanyNoticeFieldTitles.NOTICE_LATEST_PHASE_ARRIVAL_DATE}
                                </FormTextTitle>
                                <FormText>{formatDate(notice.latestPhaseArrivalDate) || '-'}</FormText>
                              </Column>
                              <Column small={12} medium={4}>
                                <FormTextTitle enableUiDataEdit uiDataKey={CompanyNoticeFieldPaths.NOTICE_LATEST_PHASE_NAME}>
                                  {CompanyNoticeFieldTitles.NOTICE_LATEST_PHASE_NAME}
                                </FormTextTitle>
                                <FormText>{notice.latestPhaseName || '-'}</FormText>
                              </Column>
                            </Row>
                          </BoxItem>
                        );
                      })}

                    </BoxItemContainer>
                  }
                </Fragment>
              }
            </Fragment>
          }
        </Fragment>
      }
    </Collapse>
  );
};

export default flowRight(
  withWindowResize,
  connect(
    (state, props: Props) => {
      return {
        companyNotice: getCompanyNoticeById(state, props.businessId),
        companyNoticeCollapseState: getCollapseStateByKey(state, `${CollapseStatePaths.COMPANY_NOTICE}.${props.businessId}`),
        isFetchingCompanyNotice: getIsFetchingCompanyNoticeById(state, props.businessId),
      };
    },
    {
      receiveCollapseStates,
    }
  ),
)(CompanyNotice);
