import React, { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Column } from "@/components/grid/Grid";
import { get, isEmpty } from "lodash-es";
import Authorization from "@/components/authorization/Authorization";
import Collapse from "@/components/collapse/Collapse";
import ExternalLink from "@/components/links/ExternalLink";
import FileDownloadLink from "@/components/file/FileDownloadLink";
import FormText from "@/components/form/FormText";
import FormTextTitle from "@/components/form/FormTextTitle";
import LeaseInfo from "./LeaseInfo";
import ListItem from "@/components/content/ListItem";
import ListItems from "@/components/content/ListItems";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import SubTitle from "@/components/content/SubTitle";
import { receiveCollapseStates } from "@/infillDevelopment/actions";
import { fetchLeaseById } from "@/leases/actions";
import { FormNames, Methods, ViewModes } from "@/enums";
import {
  InfillDevelopmentCompensationLeasesFieldPaths,
  InfillDevelopmentCompensationLeasesFieldTitles,
  InfillDevelopmentCompensationLeaseDecisionsFieldPaths,
  InfillDevelopmentCompensationLeaseDecisionsFieldTitles,
  InfillDevelopmentCompensationLeaseIntendedUsesFieldPaths,
  InfillDevelopmentCompensationLeaseIntendedUsesFieldTitles,
} from "@/infillDevelopment/enums";
import {
  InfillDevelopmentCompensationAttachmentFieldPaths,
  InfillDevelopmentCompensationAttachmentFieldTitles,
} from "@/infillDevelopmentAttachment/enums";
import { LeaseFieldPaths } from "@/leases/enums";
import {
  getContentLeaseAreas,
  getContentLeaseIdentifier,
  getContentTenants,
} from "@/leases/helpers";
import {
  getUiDataInfillDevelopmentKey,
  getUiDataInfillDevelopmentAttachmentKey,
} from "@/uiData/helpers";
import { getUserFullName } from "@/users/helpers";
import {
  formatDate,
  formatNumber,
  getFieldOptions,
  getLabelOfOption,
  getReferenceNumberLink,
  isActive,
  isEmptyValue,
  isFieldAllowedToRead,
  isMethodAllowed,
} from "@/util/helpers";
import {
  getAttributes as getInfillDevelopmentAttributes,
  getCollapseStateByKey,
} from "@/infillDevelopment/selectors";
import {
  getAttributes as getInfillDevelopmentAttachmentAttributes,
  getMethods as getInfillDevelopmentAttachmentMethods,
} from "@/infillDevelopmentAttachment/selectors";
import {
  getAttributes as getLeaseAttributes,
  getIsFetchingById,
  getLeaseById,
} from "@/leases/selectors";
import type { Attributes, Methods as MethodsType } from "types";
import type { Lease, LeaseId } from "@/leases/types";
import type { RootState } from "@/root/types";
type Props = {
  id: number;
  leaseId: LeaseId;
  leaseData: Record<string, any>;
};
const LeaseItem = ({ id, leaseData, leaseId }: Props) => {
  const dispatch = useDispatch();

  const collapseState = useSelector((state: RootState) =>
    getCollapseStateByKey(
      state,
      `${ViewModes.READONLY}.${FormNames.INFILL_DEVELOPMENT}.${id}`,
    ),
  );
  const infillDevelopmentAttachmentAttributes: Attributes = useSelector(
    getInfillDevelopmentAttachmentAttributes,
  );
  const infillDevelopmentAttachmentMethods: MethodsType = useSelector(
    getInfillDevelopmentAttachmentMethods,
  );
  const infillDevelopmentAttributes: Attributes = useSelector(
    getInfillDevelopmentAttributes,
  );
  const isFetching = useSelector((state: RootState) =>
    getIsFetchingById(state, leaseId),
  );
  const lease: Lease = useSelector((state: RootState) =>
    getLeaseById(state, leaseId),
  );
  const leaseAttributes: Attributes = useSelector(getLeaseAttributes);

  useEffect(() => {
    if (isEmpty(lease)) {
      dispatch(fetchLeaseById(leaseId));
    }
  }, [dispatch, lease, leaseId]);

  const decisionMakerOptions = useMemo(
    () =>
      getFieldOptions(
        infillDevelopmentAttributes,
        InfillDevelopmentCompensationLeaseDecisionsFieldPaths.DECISION_MAKER,
      ),
    [infillDevelopmentAttributes],
  );

  const intendedUseOptions = useMemo(
    () =>
      getFieldOptions(
        infillDevelopmentAttributes,
        InfillDevelopmentCompensationLeaseIntendedUsesFieldPaths.INTENDED_USE,
      ),
    [infillDevelopmentAttributes],
  );

  const identifier = useMemo(() => getContentLeaseIdentifier(lease), [lease]);

  const planUnits = useMemo(() => {
    const leaseAreas = getContentLeaseAreas(lease).filter(
      (area) => !area.archived_at,
    );
    const nextPlanUnits: Array<Record<string, any>> = [];

    leaseAreas.forEach((area) => {
      nextPlanUnits.push(...get(area, "plan_units_current", []));
    });

    return nextPlanUnits;
  }, [lease]);

  const plots = useMemo(() => {
    const leaseAreas = getContentLeaseAreas(lease).filter(
      (area) => !area.archived_at,
    );
    const nextPlots: Array<Record<string, any>> = [];

    leaseAreas.forEach((area) => {
      nextPlots.push(...get(area, "plots_current", []));
    });

    return nextPlots;
  }, [lease]);

  const tenants = useMemo(
    () =>
      getContentTenants(lease).filter((tenant) =>
        isActive(get(tenant, "tenant")),
      ),
    [lease],
  );

  const handleCollapseToggle = useCallback(
    (val: boolean) => {
      dispatch(
        receiveCollapseStates({
          [ViewModes.READONLY]: {
            [FormNames.INFILL_DEVELOPMENT]: {
              [id]: val,
            },
          },
        }),
      );
    },
    [dispatch, id],
  );

  const intendedUses = get(leaseData, "intended_uses", []);
  const decisions = get(leaseData, "decisions", []);
  const attachments = get(leaseData, "attachments", []);
  const totalCompensation =
    Number(get(leaseData, "monetary_compensation_amount")) +
    Number(get(leaseData, "compensation_investment_amount"));

  return (
    <Collapse
      className="collapse__secondary"
      defaultOpen={collapseState !== undefined ? collapseState : true}
      headerTitle={
        <Authorization
          allow={isFieldAllowedToRead(
            leaseAttributes,
            LeaseFieldPaths.IDENTIFIER,
          )}
        >
          {identifier || "-"}
        </Authorization>
      }
      onToggle={handleCollapseToggle}
    >
      {isFetching ? (
        <LoaderWrapper>
          <Loader isLoading={isFetching} />
        </LoaderWrapper>
      ) : (
        <LeaseInfo
          identifier={identifier}
          leaseId={leaseId}
          planUnits={planUnits}
          plots={plots}
          tenants={tenants}
        />
      )}

      <Authorization
        allow={isFieldAllowedToRead(
          infillDevelopmentAttributes,
          InfillDevelopmentCompensationLeaseDecisionsFieldPaths.DECISIONS,
        )}
      >
        <>
          <SubTitle
            uiDataKey={getUiDataInfillDevelopmentKey(
              InfillDevelopmentCompensationLeaseDecisionsFieldPaths.DECISIONS,
            )}
          >
            {InfillDevelopmentCompensationLeaseDecisionsFieldTitles.DECISIONS}
          </SubTitle>

          {!decisions.length && <FormText>Ei päätöksiä</FormText>}
          {!!decisions.length && (
            <ListItems>
              <Row>
                <Column small={3} large={2}>
                  <Authorization
                    allow={isFieldAllowedToRead(
                      infillDevelopmentAttributes,
                      InfillDevelopmentCompensationLeaseDecisionsFieldPaths.DECISION_MAKER,
                    )}
                  >
                    <FormTextTitle
                      uiDataKey={getUiDataInfillDevelopmentKey(
                        InfillDevelopmentCompensationLeaseDecisionsFieldPaths.DECISION_MAKER,
                      )}
                    >
                      {
                        InfillDevelopmentCompensationLeaseDecisionsFieldTitles.DECISION_MAKER
                      }
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column small={3} large={2}>
                  <Authorization
                    allow={isFieldAllowedToRead(
                      infillDevelopmentAttributes,
                      InfillDevelopmentCompensationLeaseDecisionsFieldPaths.DECISION_DATE,
                    )}
                  >
                    <FormTextTitle
                      uiDataKey={getUiDataInfillDevelopmentKey(
                        InfillDevelopmentCompensationLeaseDecisionsFieldPaths.DECISION_DATE,
                      )}
                    >
                      {
                        InfillDevelopmentCompensationLeaseDecisionsFieldTitles.DECISION_DATE
                      }
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column small={3} large={2}>
                  <Authorization
                    allow={isFieldAllowedToRead(
                      infillDevelopmentAttributes,
                      InfillDevelopmentCompensationLeaseDecisionsFieldPaths.SECTION,
                    )}
                  >
                    <FormTextTitle
                      uiDataKey={getUiDataInfillDevelopmentKey(
                        InfillDevelopmentCompensationLeaseDecisionsFieldPaths.SECTION,
                      )}
                    >
                      {
                        InfillDevelopmentCompensationLeaseDecisionsFieldTitles.SECTION
                      }
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column small={3} large={2}>
                  <Authorization
                    allow={isFieldAllowedToRead(
                      infillDevelopmentAttributes,
                      InfillDevelopmentCompensationLeaseDecisionsFieldPaths.REFERENCE_NUMBER,
                    )}
                  >
                    <FormTextTitle
                      uiDataKey={getUiDataInfillDevelopmentKey(
                        InfillDevelopmentCompensationLeaseDecisionsFieldPaths.REFERENCE_NUMBER,
                      )}
                    >
                      {
                        InfillDevelopmentCompensationLeaseDecisionsFieldTitles.REFERENCE_NUMBER
                      }
                    </FormTextTitle>
                  </Authorization>
                </Column>
              </Row>
              {decisions.map((decision, index) => (
                <Row key={index}>
                  <Column small={3} large={2}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        infillDevelopmentAttributes,
                        InfillDevelopmentCompensationLeaseDecisionsFieldPaths.DECISION_MAKER,
                      )}
                    >
                      <ListItem>
                        {getLabelOfOption(
                          decisionMakerOptions,
                          decision.decision_maker,
                        ) || "-"}
                      </ListItem>
                    </Authorization>
                  </Column>
                  <Column small={3} large={2}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        infillDevelopmentAttributes,
                        InfillDevelopmentCompensationLeaseDecisionsFieldPaths.DECISION_DATE,
                      )}
                    >
                      <ListItem>
                        {formatDate(decision.decision_date) || "-"}
                      </ListItem>
                    </Authorization>
                  </Column>
                  <Column small={3} large={2}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        infillDevelopmentAttributes,
                        InfillDevelopmentCompensationLeaseDecisionsFieldPaths.SECTION,
                      )}
                    >
                      <ListItem>
                        {decision.section ? `${decision.section} §` : "-"}
                      </ListItem>
                    </Authorization>
                  </Column>
                  <Column small={3} large={2}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        infillDevelopmentAttributes,
                        InfillDevelopmentCompensationLeaseDecisionsFieldPaths.REFERENCE_NUMBER,
                      )}
                    >
                      {decision.reference_number ? (
                        <ListItem>
                          <ExternalLink
                            className="no-margin"
                            href={getReferenceNumberLink(
                              decision.reference_number,
                            )}
                            text={decision.reference_number}
                          />
                        </ListItem>
                      ) : (
                        <ListItem>-</ListItem>
                      )}
                    </Authorization>
                  </Column>
                </Row>
              ))}
            </ListItems>
          )}
        </>
      </Authorization>

      <Authorization
        allow={isFieldAllowedToRead(
          infillDevelopmentAttributes,
          InfillDevelopmentCompensationLeaseIntendedUsesFieldPaths.INTENDED_USES,
        )}
      >
        <>
          <SubTitle
            uiDataKey={getUiDataInfillDevelopmentKey(
              InfillDevelopmentCompensationLeaseIntendedUsesFieldPaths.INTENDED_USES,
            )}
          >
            {
              InfillDevelopmentCompensationLeaseIntendedUsesFieldTitles.INTENDED_USES
            }
          </SubTitle>

          {!intendedUses.length && <FormText>Ei käyttötarkoituksia</FormText>}
          {!!intendedUses.length && (
            <ListItems>
              <Row>
                <Column small={3} large={2}>
                  <Authorization
                    allow={isFieldAllowedToRead(
                      infillDevelopmentAttributes,
                      InfillDevelopmentCompensationLeaseIntendedUsesFieldPaths.INTENDED_USE,
                    )}
                  >
                    <FormTextTitle
                      uiDataKey={getUiDataInfillDevelopmentKey(
                        InfillDevelopmentCompensationLeaseIntendedUsesFieldPaths.INTENDED_USE,
                      )}
                    >
                      {
                        InfillDevelopmentCompensationLeaseIntendedUsesFieldTitles.INTENDED_USE
                      }
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column small={3} large={2}>
                  <Authorization
                    allow={isFieldAllowedToRead(
                      infillDevelopmentAttributes,
                      InfillDevelopmentCompensationLeaseIntendedUsesFieldPaths.FLOOR_M2,
                    )}
                  >
                    <FormTextTitle
                      uiDataKey={getUiDataInfillDevelopmentKey(
                        InfillDevelopmentCompensationLeaseIntendedUsesFieldPaths.FLOOR_M2,
                      )}
                    >
                      {
                        InfillDevelopmentCompensationLeaseIntendedUsesFieldTitles.FLOOR_M2
                      }
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column small={3} large={2}>
                  <Authorization
                    allow={isFieldAllowedToRead(
                      infillDevelopmentAttributes,
                      InfillDevelopmentCompensationLeaseIntendedUsesFieldPaths.AMOUNT_PER_FLOOR_M2,
                    )}
                  >
                    <FormTextTitle
                      uiDataKey={getUiDataInfillDevelopmentKey(
                        InfillDevelopmentCompensationLeaseIntendedUsesFieldPaths.AMOUNT_PER_FLOOR_M2,
                      )}
                    >
                      {
                        InfillDevelopmentCompensationLeaseIntendedUsesFieldTitles.AMOUNT_PER_FLOOR_M2
                      }
                    </FormTextTitle>
                  </Authorization>
                </Column>
              </Row>
              {intendedUses.map((intendedUse, index) => (
                <Row key={index}>
                  <Column small={3} large={2}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        infillDevelopmentAttributes,
                        InfillDevelopmentCompensationLeaseIntendedUsesFieldPaths.INTENDED_USE,
                      )}
                    >
                      <ListItem>
                        {getLabelOfOption(
                          intendedUseOptions,
                          intendedUse.intended_use,
                        ) || "-"}
                      </ListItem>
                    </Authorization>
                  </Column>
                  <Column small={3} large={2}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        infillDevelopmentAttributes,
                        InfillDevelopmentCompensationLeaseIntendedUsesFieldPaths.FLOOR_M2,
                      )}
                    >
                      <ListItem>
                        {intendedUse.floor_m2
                          ? `${formatNumber(intendedUse.floor_m2)} k-m²`
                          : "-"}
                      </ListItem>
                    </Authorization>
                  </Column>
                  <Column small={3} large={2}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        infillDevelopmentAttributes,
                        InfillDevelopmentCompensationLeaseIntendedUsesFieldPaths.AMOUNT_PER_FLOOR_M2,
                      )}
                    >
                      <ListItem>
                        {intendedUse.amount_per_floor_m2
                          ? `${formatNumber(intendedUse.amount_per_floor_m2)} €/k-m²`
                          : "-"}
                      </ListItem>
                    </Authorization>
                  </Column>
                </Row>
              ))}
            </ListItems>
          )}
        </>
      </Authorization>

      <Row>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              infillDevelopmentAttributes,
              InfillDevelopmentCompensationLeasesFieldPaths.MONETARY_COMPENSATION_AMOUNT,
            )}
          >
            <>
              <FormTextTitle
                uiDataKey={getUiDataInfillDevelopmentKey(
                  InfillDevelopmentCompensationLeasesFieldPaths.MONETARY_COMPENSATION_AMOUNT,
                )}
              >
                {
                  InfillDevelopmentCompensationLeasesFieldTitles.MONETARY_COMPENSATION_AMOUNT
                }
              </FormTextTitle>
              <FormText>
                {!isEmptyValue(leaseData.monetary_compensation_amount)
                  ? `${formatNumber(leaseData.monetary_compensation_amount)} €`
                  : "-"}
              </FormText>
            </>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              infillDevelopmentAttributes,
              InfillDevelopmentCompensationLeasesFieldPaths.COMPENSATION_INVESTMENT_AMOUNT,
            )}
          >
            <>
              <FormTextTitle
                uiDataKey={getUiDataInfillDevelopmentKey(
                  InfillDevelopmentCompensationLeasesFieldPaths.COMPENSATION_INVESTMENT_AMOUNT,
                )}
              >
                {
                  InfillDevelopmentCompensationLeasesFieldTitles.COMPENSATION_INVESTMENT_AMOUNT
                }
              </FormTextTitle>
              <FormText>
                {!isEmptyValue(leaseData.compensation_investment_amount)
                  ? `${formatNumber(leaseData.compensation_investment_amount)} €`
                  : "-"}
              </FormText>
            </>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={
              isFieldAllowedToRead(
                infillDevelopmentAttributes,
                InfillDevelopmentCompensationLeasesFieldPaths.MONETARY_COMPENSATION_AMOUNT,
              ) ||
              isFieldAllowedToRead(
                infillDevelopmentAttributes,
                InfillDevelopmentCompensationLeasesFieldPaths.COMPENSATION_INVESTMENT_AMOUNT,
              )
            }
          >
            <>
              <FormTextTitle
                uiDataKey={getUiDataInfillDevelopmentKey(
                  InfillDevelopmentCompensationLeasesFieldPaths.TOTAL_COMPENSATION,
                )}
              >
                {
                  InfillDevelopmentCompensationLeasesFieldTitles.TOTAL_COMPENSATION
                }
              </FormTextTitle>
              <FormText>{`${formatNumber(totalCompensation)} €`}</FormText>
            </>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              infillDevelopmentAttributes,
              InfillDevelopmentCompensationLeasesFieldPaths.INCREASE_IN_VALUE,
            )}
          >
            <>
              <FormTextTitle
                uiDataKey={getUiDataInfillDevelopmentKey(
                  InfillDevelopmentCompensationLeasesFieldPaths.INCREASE_IN_VALUE,
                )}
              >
                {
                  InfillDevelopmentCompensationLeasesFieldTitles.INCREASE_IN_VALUE
                }
              </FormTextTitle>
              <FormText>
                {!isEmptyValue(leaseData.increase_in_value)
                  ? `${formatNumber(leaseData.increase_in_value)} €`
                  : "-"}
              </FormText>
            </>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              infillDevelopmentAttributes,
              InfillDevelopmentCompensationLeasesFieldPaths.PART_OF_THE_INCREASE_IN_VALUE,
            )}
          >
            <>
              <FormTextTitle
                uiDataKey={getUiDataInfillDevelopmentKey(
                  InfillDevelopmentCompensationLeasesFieldPaths.PART_OF_THE_INCREASE_IN_VALUE,
                )}
              >
                {
                  InfillDevelopmentCompensationLeasesFieldTitles.PART_OF_THE_INCREASE_IN_VALUE
                }
              </FormTextTitle>
              <FormText>
                {!isEmptyValue(leaseData.part_of_the_increase_in_value)
                  ? `${formatNumber(leaseData.part_of_the_increase_in_value)} €`
                  : "-"}
              </FormText>
            </>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              infillDevelopmentAttributes,
              InfillDevelopmentCompensationLeasesFieldPaths.DISCOUNT_IN_RENT,
            )}
          >
            <>
              <FormTextTitle
                uiDataKey={getUiDataInfillDevelopmentKey(
                  InfillDevelopmentCompensationLeasesFieldPaths.DISCOUNT_IN_RENT,
                )}
              >
                {
                  InfillDevelopmentCompensationLeasesFieldTitles.DISCOUNT_IN_RENT
                }
              </FormTextTitle>
              <FormText>
                {!isEmptyValue(leaseData.discount_in_rent)
                  ? `${formatNumber(leaseData.discount_in_rent)} €`
                  : "-"}
              </FormText>
            </>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              infillDevelopmentAttributes,
              InfillDevelopmentCompensationLeasesFieldPaths.YEAR,
            )}
          >
            <>
              <FormTextTitle
                uiDataKey={getUiDataInfillDevelopmentKey(
                  InfillDevelopmentCompensationLeasesFieldPaths.YEAR,
                )}
              >
                {InfillDevelopmentCompensationLeasesFieldTitles.YEAR}
              </FormTextTitle>
              <FormText>{leaseData.year || "-"}</FormText>
            </>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              infillDevelopmentAttributes,
              InfillDevelopmentCompensationLeasesFieldPaths.SENT_TO_SAP_DATE,
            )}
          >
            <>
              <FormTextTitle
                uiDataKey={getUiDataInfillDevelopmentKey(
                  InfillDevelopmentCompensationLeasesFieldPaths.SENT_TO_SAP_DATE,
                )}
              >
                {
                  InfillDevelopmentCompensationLeasesFieldTitles.SENT_TO_SAP_DATE
                }
              </FormTextTitle>
              <FormText>
                {formatDate(leaseData.sent_to_sap_date) || "-"}
              </FormText>
            </>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              infillDevelopmentAttributes,
              InfillDevelopmentCompensationLeasesFieldPaths.PAID_DATE,
            )}
          >
            <>
              <FormTextTitle
                uiDataKey={getUiDataInfillDevelopmentKey(
                  InfillDevelopmentCompensationLeasesFieldPaths.PAID_DATE,
                )}
              >
                {InfillDevelopmentCompensationLeasesFieldTitles.PAID_DATE}
              </FormTextTitle>
              <FormText>{formatDate(leaseData.paid_date) || "-"}</FormText>
            </>
          </Authorization>
        </Column>
      </Row>

      <Authorization
        allow={isMethodAllowed(infillDevelopmentAttachmentMethods, Methods.GET)}
      >
        <>
          <SubTitle
            uiDataKey={getUiDataInfillDevelopmentAttachmentKey(
              InfillDevelopmentCompensationAttachmentFieldPaths.ATTACHMENTS,
            )}
          >
            {InfillDevelopmentCompensationAttachmentFieldTitles.ATTACHMENTS}
          </SubTitle>

          {!attachments.length && <FormText>Ei liitetiedostoja</FormText>}
          {!!attachments.length && (
            <>
              <Row>
                <Column small={3} large={4}>
                  <Authorization
                    allow={isFieldAllowedToRead(
                      infillDevelopmentAttachmentAttributes,
                      InfillDevelopmentCompensationAttachmentFieldPaths.FILE,
                    )}
                  >
                    <FormTextTitle
                      uiDataKey={getUiDataInfillDevelopmentAttachmentKey(
                        InfillDevelopmentCompensationAttachmentFieldPaths.FILE,
                      )}
                    >
                      {InfillDevelopmentCompensationAttachmentFieldTitles.FILE}
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column small={3} large={2}>
                  <Authorization
                    allow={isFieldAllowedToRead(
                      infillDevelopmentAttachmentAttributes,
                      InfillDevelopmentCompensationAttachmentFieldPaths.UPLOADED_AT,
                    )}
                  >
                    <FormTextTitle
                      uiDataKey={getUiDataInfillDevelopmentAttachmentKey(
                        InfillDevelopmentCompensationAttachmentFieldPaths.UPLOADED_AT,
                      )}
                    >
                      {
                        InfillDevelopmentCompensationAttachmentFieldTitles.UPLOADED_AT
                      }
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column small={3} large={2}>
                  <FormTextTitle
                    uiDataKey={getUiDataInfillDevelopmentAttachmentKey(
                      InfillDevelopmentCompensationAttachmentFieldPaths.UPLOADER,
                    )}
                  >
                    {
                      InfillDevelopmentCompensationAttachmentFieldTitles.UPLOADER
                    }
                  </FormTextTitle>
                </Column>
              </Row>

              {attachments.map((file, index) => {
                return (
                  <Row key={index}>
                    <Column small={3} large={4}>
                      <Authorization
                        allow={isFieldAllowedToRead(
                          infillDevelopmentAttachmentAttributes,
                          InfillDevelopmentCompensationAttachmentFieldPaths.FILE,
                        )}
                      >
                        <FileDownloadLink
                          fileUrl={file.file}
                          label={file.filename}
                        />
                      </Authorization>
                    </Column>
                    <Column small={3} large={2}>
                      <Authorization
                        allow={isFieldAllowedToRead(
                          infillDevelopmentAttachmentAttributes,
                          InfillDevelopmentCompensationAttachmentFieldPaths.UPLOADED_AT,
                        )}
                      >
                        <FormText>
                          {formatDate(file.uploaded_at) || "-"}
                        </FormText>
                      </Authorization>
                    </Column>
                    <Column small={3} large={2}>
                      <FormText>
                        {getUserFullName(file.uploader) || "-"}
                      </FormText>
                    </Column>
                  </Row>
                );
              })}
            </>
          )}
        </>
      </Authorization>

      <Authorization
        allow={isFieldAllowedToRead(
          infillDevelopmentAttributes,
          InfillDevelopmentCompensationLeasesFieldPaths.NOTE,
        )}
      >
        <Row>
          <Column>
            <FormTextTitle
              uiDataKey={InfillDevelopmentCompensationLeasesFieldPaths.NOTE}
            >
              {InfillDevelopmentCompensationLeasesFieldTitles.NOTE}
            </FormTextTitle>
            <FormText>{leaseData.note || "-"}</FormText>
          </Column>
        </Row>
      </Authorization>
    </Collapse>
  );
};

export default LeaseItem;
