import React, { ReactElement, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formValueSelector } from "redux-form";
import { Row, Column } from "react-foundation";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import Authorization from "@/components/authorization/Authorization";
import Collapse from "@/components/collapse/Collapse";
import CollapseHeaderSubtitle from "@/components/collapse/CollapseHeaderSubtitle";
import Divider from "@/components/content/Divider";
import FormFieldLegacy from "@/components/form/FormFieldLegacy";
import FormText from "@/components/form/FormText";
import FormTextTitle from "@/components/form/FormTextTitle";
import LeaseArea from "./LeaseArea";
import LeaseAreaEdit from "./LeaseAreaEdit";
import { receiveCollapseStates } from "@/leases/actions";
import { FormNames, ViewModes } from "@/enums";
import {
  LeaseAreasFieldPaths,
  LeaseAreasFieldTitles,
  LeaseAreaAddressesFieldPaths,
} from "@/leases/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import {
  getDecisionOptions,
  getFullAddress,
  getLeaseAreaById,
} from "@/leases/helpers";
import {
  formatDate,
  formatNumber,
  getFieldAttributes,
  getFieldOptions,
  getLabelOfOption,
  hasPermissions,
  isFieldAllowedToEdit,
  isFieldAllowedToRead,
} from "@/util/helpers";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import {
  getAttributes,
  getCollapseStateByKey,
  getCurrentLease,
  getErrorsByFormName,
  getIsSaveClicked,
} from "@/leases/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import type { Attributes } from "types";
import type { Lease } from "@/leases/types";
import type { UsersPermissions as UsersPermissionsType } from "@/usersPermissions/types";

type OwnProps = {
  field: string;
  index: number;
  isActive: boolean;
  onArchive: (...args: Array<any>) => any;
  onRemove: (...args: Array<any>) => any;
  onUnarchive: (...args: Array<any>) => any;
};

const LeaseAreaWithArchiveInfoEdit = ({
  field,
  index,
  isActive,
  onArchive,
  onRemove,
  onUnarchive,
}: OwnProps): ReactElement => {
  const dispatch = useDispatch();
  const selector = formValueSelector(FormNames.LEASE_AREAS);

  const areaId = useSelector((state) => selector(state, `${field}.id`));
  const archivedAt = useSelector((state) =>
    selector(state, `${field}.archived_at`),
  );
  const areaCollapseState = useSelector((state) =>
    getCollapseStateByKey(
      state,
      `${ViewModes.EDIT}.${FormNames.LEASE_AREAS}.${areaId}.area`,
    ),
  );

  const attributes: Attributes = useSelector(getAttributes);
  const currentLease: Lease = useSelector(getCurrentLease);
  const editedArea = useSelector((state) => selector(state, field));
  const errors = useSelector((state) => getErrorsByFormName(state, formName));
  const isSaveClicked: boolean = useSelector(getIsSaveClicked);
  const usersPermissions: UsersPermissionsType =
    useSelector(getUsersPermissions);
  const decisionOptions = getDecisionOptions(currentLease);

  const handleArchive = () => {
    onArchive(index, editedArea);
  };

  const handleUnarchive = () => {
    onUnarchive(index, editedArea);
  };

  const handleAreaCollapseToggle = (val: boolean) => {
    if (!areaId) {
      return;
    }
    dispatch(
      receiveCollapseStates({
        [ViewModes.EDIT]: {
          [FormNames.LEASE_AREAS]: {
            [areaId]: {
              area: val,
            },
          },
        },
      }),
    );
  };

  const typeOptions = getFieldOptions(attributes, LeaseAreasFieldPaths.TYPE);
  const locationOptions = getFieldOptions(
    attributes,
    LeaseAreasFieldPaths.LOCATION,
  );

  const { savedArea, archived } = useMemo(() => {
    const area = getLeaseAreaById(currentLease, areaId);
    return {
      savedArea: area,
      archived: Boolean(area && area.archived_at),
    };
  }, [areaId, currentLease]);

  const areaErrors = errors?.[field];
  return (
    <Collapse
      archived={archived}
      defaultOpen={
        areaCollapseState !== undefined ? areaCollapseState : !archived
      }
      hasErrors={isSaveClicked && !isEmpty(areaErrors)}
      headerSubtitles={
        savedArea && (
          <>
            <Column>
              <Authorization
                allow={isFieldAllowedToRead(
                  attributes,
                  LeaseAreasFieldPaths.TYPE,
                )}
              >
                <CollapseHeaderSubtitle>
                  {getLabelOfOption(typeOptions, savedArea.type) || "-"}
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
                  {getFullAddress(get(savedArea, "addresses[0]")) || "-"}
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
                  {formatNumber(savedArea.area) || "-"} m<sup>2</sup>
                </CollapseHeaderSubtitle>
              </Authorization>
            </Column>
            <Column>
              <Authorization
                allow={isFieldAllowedToRead(
                  attributes,
                  LeaseAreasFieldPaths.LOCATION,
                )}
              >
                <CollapseHeaderSubtitle>
                  {getLabelOfOption(locationOptions, savedArea.location) || "-"}
                </CollapseHeaderSubtitle>
              </Authorization>
            </Column>
          </>
        )
      }
      headerTitle={
        <Authorization
          allow={isFieldAllowedToRead(
            attributes,
            LeaseAreasFieldPaths.IDENTIFIER,
          )}
        >
          {savedArea ? savedArea.identifier || "-" : "-"}
        </Authorization>
      }
      onArchive={
        isFieldAllowedToEdit(attributes, LeaseAreasFieldPaths.ARCHIVED_AT) &&
        isActive &&
        areaId
          ? handleArchive
          : null
      }
      onRemove={
        hasPermissions(usersPermissions, UsersPermissions.DELETE_LEASEAREA)
          ? onRemove
          : null
      }
      onUnarchive={
        isFieldAllowedToEdit(attributes, LeaseAreasFieldPaths.ARCHIVED_AT) &&
        !isActive &&
        areaId
          ? handleUnarchive
          : null
      }
      onToggle={handleAreaCollapseToggle}
    >
      {isActive && (
        <LeaseAreaEdit
          field={field}
          index={index}
          areaId={areaId}
          savedArea={savedArea}
        />
      )}

      {!isActive && <LeaseArea area={savedArea} />}
      {!isActive && <Divider className="lease-area-divider" />}
      {!isActive && (
        <Row>
          <Column small={6} medium={4} large={2}>
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeaseAreasFieldPaths.ARCHIVED_AT,
              )}
            >
              <>
                <FormTextTitle
                  uiDataKey={getUiDataLeaseKey(
                    LeaseAreasFieldPaths.ARCHIVED_AT,
                  )}
                >
                  {LeaseAreasFieldTitles.ARCHIVED_AT}
                </FormTextTitle>
                <FormText>{formatDate(archivedAt) || "-"}</FormText>
              </>
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeaseAreasFieldPaths.ARCHIVED_DECISION,
              )}
            >
              <FormFieldLegacy
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(
                  attributes,
                  LeaseAreasFieldPaths.ARCHIVED_DECISION,
                )}
                name={`${field}.archived_decision`}
                overrideValues={{
                  label: LeaseAreasFieldTitles.ARCHIVED_DECISION,
                  options: decisionOptions,
                }}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(
                  LeaseAreasFieldPaths.ARCHIVED_DECISION,
                )}
              />
            </Authorization>
          </Column>
          <Column small={12} medium={4} large={8}>
            <Authorization
              allow={isFieldAllowedToRead(
                attributes,
                LeaseAreasFieldPaths.ARCHIVED_NOTE,
              )}
            >
              <FormFieldLegacy
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(
                  attributes,
                  LeaseAreasFieldPaths.ARCHIVED_NOTE,
                )}
                name={`${field}.archived_note`}
                overrideValues={{
                  label: LeaseAreasFieldTitles.ARCHIVED_NOTE,
                }}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(
                  LeaseAreasFieldPaths.ARCHIVED_NOTE,
                )}
              />
            </Authorization>
          </Column>
        </Row>
      )}
    </Collapse>
  );
};

const formName = FormNames.LEASE_AREAS;
export default LeaseAreaWithArchiveInfoEdit;
