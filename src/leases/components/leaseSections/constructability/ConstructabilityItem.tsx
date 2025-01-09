import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import get from "lodash/get";
import Authorization from "@/components/authorization/Authorization";
import Collapse from "@/components/collapse/Collapse";
import CollapseHeaderSubtitle from "@/components/collapse/CollapseHeaderSubtitle";
import Comments from "./Comments";
import FileDownloadLink from "@/components/file/FileDownloadLink";
import FormText from "@/components/form/FormText";
import FormTextTitle from "@/components/form/FormTextTitle";
import StatusIndicator from "./StatusIndicator";
import SubTitle from "@/components/content/SubTitle";
import { receiveCollapseStates } from "@/leases/actions";
import { FormNames, ViewModes } from "@/enums";
import {
  LeaseAreaAddressesFieldPaths,
  LeaseAreaAttachmentsFieldPaths,
  LeaseAreaAttachmentsFieldTitles,
  LeaseAreasFieldPaths,
  LeaseAreasFieldTitles,
  LeaseConstructabilityDescriptionsFieldPaths,
} from "@/leases/enums";
import { getFullAddress } from "@/leases/helpers";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import {
  formatDate,
  formatNumber,
  getLabelOfOption,
  isEmptyValue,
  isFieldAllowedToRead,
} from "@/util/helpers";
import { getUserFullName } from "@/users/helpers";
import { getAttributes, getCollapseStateByKey } from "@/leases/selectors";
import type { Attributes } from "types";
const formName = FormNames.LEASE_CONSTRUCTABILITY;
type Props = {
  area: Record<string, any>;
  areaCollapseState: boolean;
  attributes: Attributes;
  constructabilityReportCollapseState: boolean;
  constructabilityReportInvestigationStateOptions: Array<Record<string, any>>;
  constructabilityStateOptions: Array<Record<string, any>>;
  demolitionCollapseState: boolean;
  locationOptions: Array<Record<string, any>>;
  otherCollapseState: boolean;
  pollutedLandCollapseState: boolean;
  pollutedLandRentConditionStateOptions: Array<Record<string, any>>;
  preconstructionCollapseState: boolean;
  receiveCollapseStates: (...args: Array<any>) => any;
  typeOptions: Array<Record<string, any>>;
};

const ConstructabilityItem = ({
  area,
  areaCollapseState,
  attributes,
  constructabilityReportCollapseState,
  constructabilityReportInvestigationStateOptions,
  constructabilityStateOptions,
  demolitionCollapseState,
  locationOptions,
  otherCollapseState,
  pollutedLandCollapseState,
  pollutedLandRentConditionStateOptions,
  preconstructionCollapseState,
  receiveCollapseStates,
  typeOptions,
}: Props) => {
  const handleCollapseToggle = (key: string, val: boolean) => {
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [formName]: {
          [area.id]: {
            [key]: val,
          },
        },
      },
    });
  };

  const handleAreaCollapseToggle = (val: boolean) => {
    handleCollapseToggle("area", val);
  };

  const handlePreconstructionCollapseToggle = (val: boolean) => {
    handleCollapseToggle("preconstruction", val);
  };

  const handleDemolitionCollapseToggle = (val: boolean) => {
    handleCollapseToggle("demolition", val);
  };

  const handlePollutedLandCollapseToggle = (val: boolean) => {
    handleCollapseToggle("polluted_land", val);
  };

  const handleConstructabilityReportCollapseToggle = (val: boolean) => {
    handleCollapseToggle("constructability_report", val);
  };

  const handleOtherCollapseToggle = (val: boolean) => {
    handleCollapseToggle("other", val);
  };

  const pollutedLandMattiAttachments = area.polluted_land_matti_reports;
  const constructabilityReportGeotechnicalAttachments =
    area.constructability_report_geotechnical_attachments;
  return (
    <Collapse
      key={area.id}
      defaultOpen={areaCollapseState !== undefined ? areaCollapseState : true}
      headerSubtitles={
        <Fragment>
          <Column>
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeaseAreasFieldPaths.TYPE,
              )}
            >
              <CollapseHeaderSubtitle>
                {getLabelOfOption(typeOptions, area.type) || "-"}
              </CollapseHeaderSubtitle>
            </Authorization>
          </Column>
          <Column>
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeaseAreaAddressesFieldPaths.ADDRESSES,
              )}
            >
              <CollapseHeaderSubtitle>
                {getFullAddress(area)}
              </CollapseHeaderSubtitle>
            </Authorization>
          </Column>
          <Column>
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeaseAreasFieldPaths.AREA,
              )}
            >
              <CollapseHeaderSubtitle>
                {!isEmptyValue(area.area)
                  ? `${formatNumber(area.area)} m²`
                  : "-"}
                {area.location
                  ? ` / ${getLabelOfOption(locationOptions, area.location) || ""}`
                  : ""}
              </CollapseHeaderSubtitle>
            </Authorization>
          </Column>
        </Fragment>
      }
      headerTitle={
        <Authorization
          allow={isFieldAllowedToRead(
            attributes,
            LeaseAreasFieldPaths.IDENTIFIER,
          )}
        >
          {area.identifier || "-"}
        </Authorization>
      }
      onToggle={handleAreaCollapseToggle}
      showTitleOnOpen
    >
      <Collapse
        className="collapse__secondary"
        defaultOpen={
          preconstructionCollapseState !== undefined
            ? preconstructionCollapseState
            : false
        }
        headerSubtitles={
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseAreasFieldPaths.PRECONSTRUCTION_STATE,
            )}
          >
            <Column>
              <StatusIndicator
                researchState={area.preconstruction_state}
                stateOptions={constructabilityStateOptions}
              />
            </Column>
          </Authorization>
        }
        headerTitle={LeaseAreasFieldTitles.PRECONSTRUCTION}
        onToggle={handlePreconstructionCollapseToggle}
        showTitleOnOpen
        uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.PRECONSTRUCTION)}
      >
        <Row>
          <Column small={6} medium={4} large={2}>
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeaseAreasFieldPaths.PRECONSTRUCTION_STATE,
              )}
            >
              <>
                <FormTextTitle
                  uiDataKey={getUiDataLeaseKey(
                    LeaseAreasFieldPaths.PRECONSTRUCTION_STATE,
                  )}
                >
                  {LeaseAreasFieldTitles.PRECONSTRUCTION_STATE}
                </FormTextTitle>
                <FormText>
                  {getLabelOfOption(
                    constructabilityStateOptions,
                    area.preconstruction_state,
                  ) || "-"}
                </FormText>
              </>
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeaseAreasFieldPaths.PRECONSTRUCTION_ESTIMATED_CONSTRUCTION_READINESS_MOMENT,
              )}
            >
              <>
                <FormTextTitle
                  uiDataKey={getUiDataLeaseKey(
                    LeaseAreasFieldPaths.PRECONSTRUCTION_ESTIMATED_CONSTRUCTION_READINESS_MOMENT,
                  )}
                >
                  {
                    LeaseAreasFieldTitles.PRECONSTRUCTION_ESTIMATED_CONSTRUCTION_READINESS_MOMENT
                  }
                </FormTextTitle>
                <FormText>
                  {area.preconstruction_estimated_construction_readiness_moment ||
                    "-"}
                </FormText>
              </>
            </Authorization>
          </Column>
          <Column small={6} medium={4} offsetOnLarge={1} large={2}>
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeaseAreasFieldPaths.PRECONSTRUCTION_INSPECTION_MOMENT,
              )}
            >
              <>
                <FormTextTitle
                  uiDataKey={getUiDataLeaseKey(
                    LeaseAreasFieldPaths.PRECONSTRUCTION_INSPECTION_MOMENT,
                  )}
                >
                  {LeaseAreasFieldTitles.PRECONSTRUCTION_INSPECTION_MOMENT}
                </FormTextTitle>
                <FormText>
                  {area.preconstruction_inspection_moment || "-"}
                </FormText>
              </>
            </Authorization>
          </Column>
        </Row>
        <Authorization
          allow={isFieldAllowedToRead(
            attributes,
            LeaseConstructabilityDescriptionsFieldPaths.CONSTRUCTABILITY_DESCRIPTIONS,
          )}
        >
          <Comments comments={area.descriptionsPreconstruction} />
        </Authorization>
      </Collapse>

      <Collapse
        className="collapse__secondary"
        defaultOpen={
          demolitionCollapseState !== undefined
            ? demolitionCollapseState
            : false
        }
        headerSubtitles={
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseAreasFieldPaths.DEMOLITION_STATE,
            )}
          >
            <Column>
              <StatusIndicator
                researchState={area.demolition_state}
                stateOptions={constructabilityStateOptions}
              />
            </Column>
          </Authorization>
        }
        headerTitle={LeaseAreasFieldTitles.DEMOLITION}
        onToggle={handleDemolitionCollapseToggle}
        showTitleOnOpen
        uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.DEMOLITION)}
      >
        <Row>
          <Column small={6} medium={4} large={2}>
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeaseAreasFieldPaths.DEMOLITION_STATE,
              )}
            >
              <>
                <FormTextTitle
                  uiDataKey={getUiDataLeaseKey(
                    LeaseAreasFieldPaths.DEMOLITION_STATE,
                  )}
                >
                  {LeaseAreasFieldTitles.DEMOLITION_STATE}
                </FormTextTitle>
                <FormText>
                  {getLabelOfOption(
                    constructabilityStateOptions,
                    area.demolition_state,
                  ) || "-"}
                </FormText>
              </>
            </Authorization>
          </Column>
        </Row>
        <Authorization
          allow={isFieldAllowedToRead(
            attributes,
            LeaseConstructabilityDescriptionsFieldPaths.CONSTRUCTABILITY_DESCRIPTIONS,
          )}
        >
          <Comments comments={area.descriptionsDemolition} />
        </Authorization>
      </Collapse>

      <Collapse
        className="collapse__secondary"
        defaultOpen={
          pollutedLandCollapseState !== undefined
            ? pollutedLandCollapseState
            : false
        }
        headerSubtitles={
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseAreasFieldPaths.POLLUTED_LAND_STATE,
            )}
          >
            <Column>
              <StatusIndicator
                researchState={area.polluted_land_state}
                stateOptions={constructabilityStateOptions}
              />
            </Column>
          </Authorization>
        }
        headerTitle={LeaseAreasFieldTitles.POLLUTED_LAND}
        onToggle={handlePollutedLandCollapseToggle}
        showTitleOnOpen={true}
        uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.POLLUTED_LAND)}
      >
        <Row>
          <Column small={6} medium={4} large={2}>
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeaseAreasFieldPaths.POLLUTED_LAND_STATE,
              )}
            >
              <>
                <FormTextTitle
                  uiDataKey={getUiDataLeaseKey(
                    LeaseAreasFieldPaths.POLLUTED_LAND_STATE,
                  )}
                >
                  {LeaseAreasFieldTitles.POLLUTED_LAND_STATE}
                </FormTextTitle>
                <FormText>
                  {getLabelOfOption(
                    constructabilityStateOptions,
                    area.polluted_land_state,
                  ) || "-"}
                </FormText>
              </>
            </Authorization>
          </Column>
          <Column small={6} medium={3} large={2}>
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeaseAreasFieldPaths.POLLUTED_LAND_RENT_CONDITION_STATE,
              )}
            >
              <>
                <FormTextTitle
                  uiDataKey={getUiDataLeaseKey(
                    LeaseAreasFieldPaths.POLLUTED_LAND_RENT_CONDITION_STATE,
                  )}
                >
                  {LeaseAreasFieldTitles.POLLUTED_LAND_RENT_CONDITION_STATE}
                </FormTextTitle>
                <FormText>
                  {getLabelOfOption(
                    pollutedLandRentConditionStateOptions,
                    area.polluted_land_rent_condition_state,
                  ) || "-"}
                </FormText>
              </>
            </Authorization>
          </Column>
          <Column small={6} medium={3} large={2}>
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeaseAreasFieldPaths.POLLUTED_LAND_RENT_CONDITION_DATE,
              )}
            >
              <>
                <FormTextTitle
                  uiDataKey={getUiDataLeaseKey(
                    LeaseAreasFieldPaths.POLLUTED_LAND_RENT_CONDITION_STATE,
                  )}
                >
                  {LeaseAreasFieldTitles.POLLUTED_LAND_RENT_CONDITION_DATE}
                </FormTextTitle>
                <FormText>
                  {formatDate(area.polluted_land_rent_condition_date) || "–"}
                </FormText>
              </>
            </Authorization>
          </Column>
          <Column small={6} medium={3} large={2}>
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeaseAreasFieldPaths.POLLUTED_LAND_PLANNER,
              )}
            >
              <>
                <FormTextTitle
                  uiDataKey={getUiDataLeaseKey(
                    LeaseAreasFieldPaths.POLLUTED_LAND_PLANNER,
                  )}
                >
                  {LeaseAreasFieldTitles.POLLUTED_LAND_PLANNER}
                </FormTextTitle>
                <FormText>
                  {getUserFullName(area.polluted_land_planner) || "–"}
                </FormText>
              </>
            </Authorization>
          </Column>
          <Column small={6} medium={3} large={2}>
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeaseAreasFieldPaths.POLLUTED_LAND_PROJECTWISE_NUMBER,
              )}
            >
              <>
                <FormTextTitle
                  uiDataKey={getUiDataLeaseKey(
                    LeaseAreasFieldPaths.POLLUTED_LAND_PROJECTWISE_NUMBER,
                  )}
                >
                  {LeaseAreasFieldTitles.POLLUTED_LAND_PROJECTWISE_NUMBER}
                </FormTextTitle>
                <FormText>
                  {area.polluted_land_projectwise_number || "-"}
                </FormText>
              </>
            </Authorization>
          </Column>
        </Row>

        <Authorization
          allow={isFieldAllowedToRead(
            attributes,
            LeaseAreaAttachmentsFieldPaths.ATTACHMENTS,
          )}
        >
          <>
            <SubTitle
              uiDataKey={getUiDataLeaseKey(
                LeaseAreasFieldPaths.POLLUTED_LAND_MATTI_REPORTS,
              )}
            >
              {LeaseAreasFieldTitles.POLLUTED_LAND_MATTI_REPORTS}
            </SubTitle>
            {!pollutedLandMattiAttachments.length && (
              <FormText>Ei Matti raportteja</FormText>
            )}
            {!!pollutedLandMattiAttachments.length && (
              <Fragment>
                <Row>
                  <Column small={3} large={4}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        attributes,
                        LeaseAreaAttachmentsFieldPaths.FILE,
                      )}
                    >
                      <FormTextTitle
                        uiDataKey={getUiDataLeaseKey(
                          LeaseAreaAttachmentsFieldPaths.FILE,
                        )}
                      >
                        {LeaseAreaAttachmentsFieldTitles.FILE}
                      </FormTextTitle>
                    </Authorization>
                  </Column>
                  <Column small={3} large={2}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        attributes,
                        LeaseAreaAttachmentsFieldPaths.UPLOADED_AT,
                      )}
                    >
                      <FormTextTitle
                        uiDataKey={getUiDataLeaseKey(
                          LeaseAreaAttachmentsFieldPaths.UPLOADED_AT,
                        )}
                      >
                        {LeaseAreaAttachmentsFieldTitles.UPLOADED_AT}
                      </FormTextTitle>
                    </Authorization>
                  </Column>
                  <Column small={3} large={2}>
                    <FormTextTitle
                      uiDataKey={getUiDataLeaseKey(
                        LeaseAreaAttachmentsFieldPaths.UPLOADER,
                      )}
                    >
                      {LeaseAreaAttachmentsFieldTitles.UPLOADER}
                    </FormTextTitle>
                  </Column>
                </Row>

                {pollutedLandMattiAttachments.map((file, index) => {
                  return (
                    <Row key={index}>
                      <Column small={3} large={4}>
                        <Authorization
                          allow={isFieldAllowedToRead(
                            attributes,
                            LeaseAreaAttachmentsFieldPaths.FILE,
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
                            attributes,
                            LeaseAreaAttachmentsFieldPaths.UPLOADED_AT,
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
              </Fragment>
            )}
          </>
        </Authorization>

        <Authorization
          allow={isFieldAllowedToRead(
            attributes,
            LeaseConstructabilityDescriptionsFieldPaths.CONSTRUCTABILITY_DESCRIPTIONS,
          )}
        >
          <Comments comments={area.descriptionsPollutedLand} />
        </Authorization>
      </Collapse>

      <Collapse
        className="collapse__secondary"
        defaultOpen={
          constructabilityReportCollapseState !== undefined
            ? constructabilityReportCollapseState
            : false
        }
        headerSubtitles={
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseAreasFieldPaths.CONSTRUCTABILITY_REPORT_STATE,
            )}
          >
            <Column>
              <StatusIndicator
                researchState={area.constructability_report_state}
                stateOptions={constructabilityStateOptions}
              />
            </Column>
          </Authorization>
        }
        headerTitle={LeaseAreasFieldTitles.CONSTRUCTABILITY_REPORT}
        onToggle={handleConstructabilityReportCollapseToggle}
        showTitleOnOpen
        uiDataKey={getUiDataLeaseKey(
          LeaseAreasFieldPaths.CONSTRUCTABILITY_REPORT,
        )}
      >
        <Row>
          <Column small={6} medium={4} large={2}>
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeaseAreasFieldPaths.CONSTRUCTABILITY_REPORT_STATE,
              )}
            >
              <>
                <FormTextTitle
                  uiDataKey={getUiDataLeaseKey(
                    LeaseAreasFieldPaths.CONSTRUCTABILITY_REPORT_STATE,
                  )}
                >
                  {LeaseAreasFieldTitles.CONSTRUCTABILITY_REPORT_STATE}
                </FormTextTitle>
                <FormText>
                  {getLabelOfOption(
                    constructabilityStateOptions,
                    area.constructability_report_state,
                  ) || "-"}
                </FormText>
              </>
            </Authorization>
          </Column>
          <Column small={6} medium={3} large={2}>
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeaseAreasFieldPaths.CONSTRUCTABILITY_REPORT_INVESTIGATION_STATE,
              )}
            >
              <>
                <FormTextTitle
                  uiDataKey={getUiDataLeaseKey(
                    LeaseAreasFieldPaths.CONSTRUCTABILITY_REPORT_INVESTIGATION_STATE,
                  )}
                >
                  {
                    LeaseAreasFieldTitles.CONSTRUCTABILITY_REPORT_INVESTIGATION_STATE
                  }
                </FormTextTitle>
                <FormText>
                  {getLabelOfOption(
                    constructabilityReportInvestigationStateOptions,
                    area.constructability_report_investigation_state,
                  ) || "-"}
                </FormText>
              </>
            </Authorization>
          </Column>
          <Column small={6} medium={3} large={2}>
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeaseAreasFieldPaths.CONSTRUCTABILITY_REPORT_SIGNING_DATE,
              )}
            >
              <>
                <FormTextTitle
                  uiDataKey={getUiDataLeaseKey(
                    LeaseAreasFieldPaths.CONSTRUCTABILITY_REPORT_SIGNING_DATE,
                  )}
                >
                  {LeaseAreasFieldTitles.CONSTRUCTABILITY_REPORT_SIGNING_DATE}
                </FormTextTitle>
                <FormText>
                  {formatDate(area.constructability_report_signing_date) || "–"}
                </FormText>
              </>
            </Authorization>
          </Column>
          <Column small={6} medium={3} large={2}>
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeaseAreasFieldPaths.CONSTRUCTABILITY_REPORT_SIGNER,
              )}
            >
              <>
                <FormTextTitle
                  uiDataKey={getUiDataLeaseKey(
                    LeaseAreasFieldPaths.CONSTRUCTABILITY_REPORT_SIGNER,
                  )}
                >
                  {LeaseAreasFieldTitles.CONSTRUCTABILITY_REPORT_SIGNER}
                </FormTextTitle>
                <FormText>
                  {area.constructability_report_signer || "-"}
                </FormText>
              </>
            </Authorization>
          </Column>
        </Row>

        <Authorization
          allow={isFieldAllowedToRead(
            attributes,
            LeaseAreaAttachmentsFieldPaths.ATTACHMENTS,
          )}
        >
          <>
            <SubTitle
              uiDataKey={getUiDataLeaseKey(
                LeaseAreasFieldPaths.CONSTRUCTABILITY_REPORT_GEOTECHNICAL_ATTACHMENTS,
              )}
            >
              {
                LeaseAreasFieldTitles.CONSTRUCTABILITY_REPORT_GEOTECHNICAL_ATTACHMENTS
              }
            </SubTitle>
            {!constructabilityReportGeotechnicalAttachments.length && (
              <FormText>Ei geoteknisen palvelun tiedostoja</FormText>
            )}
            {!!constructabilityReportGeotechnicalAttachments.length && (
              <Fragment>
                <Row>
                  <Column small={3} large={4}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        attributes,
                        LeaseAreaAttachmentsFieldPaths.FILE,
                      )}
                    >
                      <FormTextTitle
                        uiDataKey={getUiDataLeaseKey(
                          LeaseAreaAttachmentsFieldPaths.FILE,
                        )}
                      >
                        {LeaseAreaAttachmentsFieldTitles.FILE}
                      </FormTextTitle>
                    </Authorization>
                  </Column>
                  <Column small={3} large={2}>
                    <Authorization
                      allow={isFieldAllowedToRead(
                        attributes,
                        LeaseAreaAttachmentsFieldPaths.UPLOADED_AT,
                      )}
                    >
                      <FormTextTitle
                        uiDataKey={getUiDataLeaseKey(
                          LeaseAreaAttachmentsFieldPaths.UPLOADED_AT,
                        )}
                      >
                        {LeaseAreaAttachmentsFieldTitles.UPLOADED_AT}
                      </FormTextTitle>
                    </Authorization>
                  </Column>
                  <Column small={3} large={2}>
                    <FormTextTitle
                      uiDataKey={getUiDataLeaseKey(
                        LeaseAreaAttachmentsFieldPaths.UPLOADER,
                      )}
                    >
                      {LeaseAreaAttachmentsFieldTitles.UPLOADER}
                    </FormTextTitle>
                  </Column>
                </Row>
                {constructabilityReportGeotechnicalAttachments.map(
                  (file, index) => {
                    return (
                      <Row key={index}>
                        <Column small={3} large={4}>
                          <Authorization
                            allow={isFieldAllowedToRead(
                              attributes,
                              LeaseAreaAttachmentsFieldPaths.FILE,
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
                              attributes,
                              LeaseAreaAttachmentsFieldPaths.UPLOADED_AT,
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
                  },
                )}
              </Fragment>
            )}
          </>
        </Authorization>

        <Authorization
          allow={isFieldAllowedToRead(
            attributes,
            LeaseConstructabilityDescriptionsFieldPaths.CONSTRUCTABILITY_DESCRIPTIONS,
          )}
        >
          <Comments comments={area.descriptionsReport} />
        </Authorization>
      </Collapse>

      <Collapse
        className="collapse__secondary"
        defaultOpen={
          otherCollapseState !== undefined ? otherCollapseState : false
        }
        headerSubtitles={
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseAreasFieldPaths.OTHER_STATE,
            )}
          >
            <Column>
              <StatusIndicator
                researchState={area.other_state}
                stateOptions={constructabilityStateOptions}
              />
            </Column>
          </Authorization>
        }
        headerTitle={LeaseAreasFieldTitles.OTHER}
        onToggle={handleOtherCollapseToggle}
        showTitleOnOpen
        uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.OTHER)}
      >
        <Row>
          <Column small={6} medium={4} large={2}>
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeaseAreasFieldPaths.OTHER_STATE,
              )}
            >
              <>
                <FormTextTitle
                  uiDataKey={getUiDataLeaseKey(
                    LeaseAreasFieldPaths.OTHER_STATE,
                  )}
                >
                  {LeaseAreasFieldTitles.OTHER_STATE}
                </FormTextTitle>
                <FormText>
                  {getLabelOfOption(
                    constructabilityStateOptions,
                    area.other_state,
                  ) || "-"}
                </FormText>
              </>
            </Authorization>
          </Column>
        </Row>
        <Authorization
          allow={isFieldAllowedToRead(
            attributes,
            LeaseConstructabilityDescriptionsFieldPaths.CONSTRUCTABILITY_DESCRIPTIONS,
          )}
        >
          <Comments comments={area.descriptionsOther} />
        </Authorization>
      </Collapse>
    </Collapse>
  );
};

export default connect(
  (state, props: Props) => {
    const id = get(props, "area.id");
    return {
      areaCollapseState: getCollapseStateByKey(
        state,
        `${ViewModes.READONLY}.${formName}.${id}.area`,
      ),
      attributes: getAttributes(state),
      constructabilityReportCollapseState: getCollapseStateByKey(
        state,
        `${ViewModes.READONLY}.${formName}.${id}.constructability_report`,
      ),
      demolitionCollapseState: getCollapseStateByKey(
        state,
        `${ViewModes.READONLY}.${formName}.${id}.demolition`,
      ),
      otherCollapseState: getCollapseStateByKey(
        state,
        `${ViewModes.READONLY}.${formName}.${id}.other`,
      ),
      pollutedLandCollapseState: getCollapseStateByKey(
        state,
        `${ViewModes.READONLY}.${formName}.${id}.polluted_land`,
      ),
      preconstructionCollapseState: getCollapseStateByKey(
        state,
        `${ViewModes.READONLY}.${formName}.${id}.preconstruction`,
      ),
    };
  },
  {
    receiveCollapseStates,
  },
)(ConstructabilityItem);
