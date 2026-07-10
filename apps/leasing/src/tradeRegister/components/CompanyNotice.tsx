import React, { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Column } from "@/components/grid/Grid";
import { get } from "lodash-es";
import BoxItem from "@/components/content/BoxItem";
import BoxItemContainer from "@/components/content/BoxItemContainer";
import Collapse from "@/components/collapse/Collapse";
import FormText from "@/components/form/FormText";
import FormTextTitle from "@/components/form/FormTextTitle";
import ListItem from "@/components/content/ListItem";
import ListItems from "@/components/content/ListItems";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import { receiveCollapseStates } from "@/tradeRegister/actions";
import {
  CollapseStatePaths,
  CompanyNoticeFieldPaths,
  CompanyNoticeFieldTitles,
} from "@/tradeRegister/enums";
import { formatDate } from "@/util/helpers";
import { getUiDataTradeRegisterCompanyNoticeKey } from "@/uiData/helpers";
import {
  getCollapseStateByKey,
  getCompanyNoticeById,
  getIsFetchingCompanyNoticeById,
} from "@/tradeRegister/selectors";
import { useWindowResize } from "@/components/resize/WindowResizeHandler";
import type { RootState } from "@/root/types";

type Props = {
  businessId: string;
};

const CompanyNotice = ({ businessId }: Props) => {
  const dispatch = useDispatch();
  const largeScreen = useWindowResize();

  const companyNotice = useSelector((state: RootState) =>
    getCompanyNoticeById(state, businessId),
  );
  const companyNoticeCollapseState = useSelector((state: RootState) =>
    getCollapseStateByKey(
      state,
      `${CollapseStatePaths.COMPANY_NOTICE}.${businessId}`,
    ),
  );
  const isFetchingCompanyNotice = useSelector((state: RootState) =>
    getIsFetchingCompanyNoticeById(state, businessId),
  );

  const handleCollapseToggleCompanyNotice = (val: boolean) => {
    dispatch(
      receiveCollapseStates({
        [`${CollapseStatePaths.COMPANY_NOTICE}.${businessId}`]: val,
      }),
    );
  };

  const notices = get(companyNotice, CompanyNoticeFieldPaths.NOTICE, []);
  if (companyNotice === undefined && !isFetchingCompanyNotice) return null;
  return (
    <Collapse
      defaultOpen={
        companyNoticeCollapseState !== undefined
          ? companyNoticeCollapseState
          : false
      }
      headerTitle={CompanyNoticeFieldTitles.NOTICE}
      onToggle={handleCollapseToggleCompanyNotice}
      enableUiDataEdit
      uiDataKey={getUiDataTradeRegisterCompanyNoticeKey(
        CompanyNoticeFieldPaths.NOTICE,
      )}
    >
      {isFetchingCompanyNotice && (
        <LoaderWrapper>
          <Loader isLoading={isFetchingCompanyNotice} />
        </LoaderWrapper>
      )}
      {!isFetchingCompanyNotice && (
        <>
          {!companyNotice && (
            <FormText>Vireillä olevat ilmoitukset ei saatavilla</FormText>
          )}
          {!!companyNotice && (
            <>
              {!notices.length && (
                <FormText>Ei vireillä olevia ilmoituksia</FormText>
              )}

              {!!notices.length && (
                <>
                  {largeScreen && (
                    <>
                      <Row>
                        <Column large={2}>
                          <FormTextTitle
                            enableUiDataEdit
                            uiDataKey={CompanyNoticeFieldPaths.NOTICE_TYPE}
                          >
                            {CompanyNoticeFieldTitles.NOTICE_TYPE}
                          </FormTextTitle>
                        </Column>
                        <Column large={2}>
                          <FormTextTitle
                            enableUiDataEdit
                            uiDataKey={
                              CompanyNoticeFieldPaths.NOTICE_RECORD_NUMBER
                            }
                          >
                            {CompanyNoticeFieldTitles.NOTICE_RECORD_NUMBER}
                          </FormTextTitle>
                        </Column>
                        <Column large={2}>
                          <FormTextTitle
                            enableUiDataEdit
                            uiDataKey={
                              CompanyNoticeFieldPaths.NOTICE_ARRIVAL_DATE
                            }
                          >
                            {CompanyNoticeFieldTitles.NOTICE_ARRIVAL_DATE}
                          </FormTextTitle>
                        </Column>
                        <Column large={2}>
                          <FormTextTitle
                            enableUiDataEdit
                            uiDataKey={
                              CompanyNoticeFieldPaths.NOTICE_LATEST_PHASE_ARRIVAL_DATE
                            }
                          >
                            {
                              CompanyNoticeFieldTitles.NOTICE_LATEST_PHASE_ARRIVAL_DATE
                            }
                          </FormTextTitle>
                        </Column>
                        <Column large={2}>
                          <FormTextTitle
                            enableUiDataEdit
                            uiDataKey={
                              CompanyNoticeFieldPaths.NOTICE_LATEST_PHASE_NAME
                            }
                          >
                            {CompanyNoticeFieldTitles.NOTICE_LATEST_PHASE_NAME}
                          </FormTextTitle>
                        </Column>
                      </Row>

                      <ListItems>
                        {notices.map((notice, index) => {
                          return (
                            <Row key={index}>
                              <Column large={2}>
                                <ListItem>{notice.type || "-"}</ListItem>
                              </Column>
                              <Column large={2}>
                                <ListItem>
                                  {notice.recordNumber || "-"}
                                </ListItem>
                              </Column>
                              <Column large={2}>
                                <ListItem>
                                  {formatDate(notice.arrivalDate) || "-"}
                                </ListItem>
                              </Column>
                              <Column large={2}>
                                <ListItem>
                                  {formatDate(notice.latestPhaseArrivalDate) ||
                                    "-"}
                                </ListItem>
                              </Column>
                              <Column large={2}>
                                <ListItem>
                                  {notice.latestPhaseName || "-"}
                                </ListItem>
                              </Column>
                            </Row>
                          );
                        })}
                      </ListItems>
                    </>
                  )}
                  {!largeScreen && (
                    <BoxItemContainer>
                      {notices.map((notice, index) => {
                        return (
                          <BoxItem
                            key={index}
                            className="no-border-on-first-child no-border-on-last-child"
                          >
                            <Row>
                              <Column small={12} medium={4}>
                                <FormTextTitle
                                  enableUiDataEdit
                                  uiDataKey={
                                    CompanyNoticeFieldPaths.NOTICE_TYPE
                                  }
                                >
                                  {CompanyNoticeFieldTitles.NOTICE_TYPE}
                                </FormTextTitle>
                                <FormText>{notice.type || "-"}</FormText>
                              </Column>
                              <Column small={12} medium={4}>
                                <FormTextTitle
                                  enableUiDataEdit
                                  uiDataKey={
                                    CompanyNoticeFieldPaths.NOTICE_RECORD_NUMBER
                                  }
                                >
                                  {
                                    CompanyNoticeFieldTitles.NOTICE_RECORD_NUMBER
                                  }
                                </FormTextTitle>
                                <FormText>
                                  {notice.recordNumber || "-"}
                                </FormText>
                              </Column>
                              <Column small={12} medium={4}>
                                <FormTextTitle
                                  enableUiDataEdit
                                  uiDataKey={
                                    CompanyNoticeFieldPaths.NOTICE_ARRIVAL_DATE
                                  }
                                >
                                  {CompanyNoticeFieldTitles.NOTICE_ARRIVAL_DATE}
                                </FormTextTitle>
                                <FormText>
                                  {formatDate(notice.arrivalDate) || "-"}
                                </FormText>
                              </Column>
                              <Column small={12} medium={4}>
                                <FormTextTitle
                                  enableUiDataEdit
                                  uiDataKey={
                                    CompanyNoticeFieldPaths.NOTICE_LATEST_PHASE_ARRIVAL_DATE
                                  }
                                >
                                  {
                                    CompanyNoticeFieldTitles.NOTICE_LATEST_PHASE_ARRIVAL_DATE
                                  }
                                </FormTextTitle>
                                <FormText>
                                  {formatDate(notice.latestPhaseArrivalDate) ||
                                    "-"}
                                </FormText>
                              </Column>
                              <Column small={12} medium={4}>
                                <FormTextTitle
                                  enableUiDataEdit
                                  uiDataKey={
                                    CompanyNoticeFieldPaths.NOTICE_LATEST_PHASE_NAME
                                  }
                                >
                                  {
                                    CompanyNoticeFieldTitles.NOTICE_LATEST_PHASE_NAME
                                  }
                                </FormTextTitle>
                                <FormText>
                                  {notice.latestPhaseName || "-"}
                                </FormText>
                              </Column>
                            </Row>
                          </BoxItem>
                        );
                      })}
                    </BoxItemContainer>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </Collapse>
  );
};

export default memo(CompanyNotice);
