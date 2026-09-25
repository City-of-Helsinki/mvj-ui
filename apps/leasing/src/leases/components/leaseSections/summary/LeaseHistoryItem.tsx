import React from "react";
import { useAppSelector } from "@/root/hooks";
import classNames from "classnames";
import { ActionTypes, ModalConsumer } from "@/app/ModalContext";
import AccordionIcon from "@/components/icons/AccordionIcon";
import DiamondIcon from "@/components/icons/DiamondIcon";
import Authorization from "@/components/authorization/Authorization";
import ExternalLink from "@/components/links/ExternalLink";
import FormText from "@/components/form/FormText";
import RemoveButton from "@/components/form/RemoveButton";
import { ConfirmationModalTexts } from "@/enums";
import { LeaseHistoryItemTypes } from "@/leases/enums";
import { ButtonColors } from "@/components/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import {
  getContentLeaseIdentifier,
  getContentRelatedLeasesFrom,
  getTitleText,
} from "@/leases/helpers";
import { formatDate, getLabelOfOption, hasPermissions } from "@/util/helpers";
import { getRouteById, Routes } from "@/root/routes";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import type { Lease } from "@/leases/types";
import type { HistoryNodeVisual } from "@/leases/leaseHistory";
type Props = {
  active?: boolean;
  indented?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  visual?: HistoryNodeVisual;
  lease?: Lease;
  id?: number;
  deleteId?: number;
  itemTitle?: string;
  plotSearchName?: string;
  startDate?: string;
  endDate?: string;
  receivedAt?: string;
  plotSearchType?: string;
  plotSearchSubtype?: string;
  applicantName?: string;
  itemType?: string;
  onDelete?: (...args: Array<any>) => any;
  stateOptions: Array<Record<string, any>>;
};

const LeaseHistoryItem = ({
  active = false,
  indented = false,
  isFirst = false,
  isLast = false,
  lease,
  id,
  deleteId,
  itemTitle = "",
  startDate,
  endDate,
  receivedAt,
  plotSearchType,
  plotSearchSubtype,
  applicantName,
  itemType = "",
  visual,
  onDelete,
  stateOptions,
}: Props) => {
  // React.useEffect(() => {
  //   //DEBUG TO DISPLAY THE RELATED LEASES DATA PLS NO REMOVE
  //   getContentRelatedLeasesFrom(lease);
  // }, [lease]);
  const titleString = lease ? getContentLeaseIdentifier(lease) : itemTitle;
  const MAX_TITLE_LENGTH = 16;
  const title = getTitleText(titleString, MAX_TITLE_LENGTH);
  const externalLinkHref = (() => {
    if (lease) return `${getRouteById(Routes.LEASES)}/${lease.id}`;
    if (itemType === LeaseHistoryItemTypes.PLOTSEARCH && id)
      return `${getRouteById(Routes.PLOT_SEARCH)}/${id}`;
    if (itemType === LeaseHistoryItemTypes.PLOT_APPLICATION && id)
      return `${getRouteById(Routes.PLOT_APPLICATIONS)}/${id}`;
    if (itemType === LeaseHistoryItemTypes.AREA_SEARCH && id)
      return `${getRouteById(Routes.AREA_SEARCH)}/${id}`;
    return null;
  })();
  const usersPermissions = useAppSelector(getUsersPermissions);

  // Lease nodes render their badge from `visual`; attachments (plot searches,
  // applications, area searches) have no `visual` and keep the legacy badge.
  const badgeClassNames = visual
    ? {
        "related-leases-item_badge--current": visual === "current",
        "related-leases-item_badge--active": visual === "active",
        "related-leases-item_badge--ended":
          visual === "ended-continued" || visual === "ended-terminal",
      }
    : {
        "related-leases-item_badge--active": !active,
        "related-leases-item_badge--ended": false,
      };
  const badgeIcon = visual ? (
    visual === "ended-continued" ? (
      <AccordionIcon />
    ) : visual === "ended-terminal" ? (
      <DiamondIcon />
    ) : null
  ) : !active ? (
    <AccordionIcon />
  ) : null;

  return (
    <ModalConsumer>
      {({ modalDispatch }) => {
        const handleDelete = () => {
          modalDispatch({
            type: ActionTypes.SHOW_CONFIRMATION_MODAL,
            confirmationFunction: () => {
              if (onDelete) {
                onDelete(deleteId);
              }
            },
            confirmationModalButtonClassName: ButtonColors.ALERT,
            confirmationModalButtonText:
              ConfirmationModalTexts.DELETE_RELATED_LEASE.BUTTON,
            confirmationModalLabel:
              ConfirmationModalTexts.DELETE_RELATED_LEASE.LABEL,
            confirmationModalTitle:
              ConfirmationModalTexts.DELETE_RELATED_LEASE.TITLE,
          });
        };

        return (
          <div
            className={classNames("related-leases-item", {
              active: active,
              indented: indented,
              "related-leases-item--first": isFirst,
              "related-leases-item--last": isLast,
            })}
          >
            <div className="related-leases-item_wrapper">
              <div className="left-border-overlay" />
              <div className="connection-line" />
              <div
                className={classNames(
                  "related-leases-item_badge",
                  badgeClassNames,
                )}
              >
                {badgeIcon}
              </div>
              <div className={classNames("related-leases-item_info")}>
                <p className="identifier">
                  {active ? (
                    title
                  ) : externalLinkHref ? (
                    <ExternalLink href={externalLinkHref} text={title || ""} />
                  ) : (
                    title
                  )}
                </p>
                {receivedAt && (
                  <FormText>Saapunut {formatDate(receivedAt)}</FormText>
                )}
                {(startDate || endDate) && (
                  <FormText>
                    {startDate ? formatDate(startDate) : ""} -{" "}
                    {endDate ? formatDate(endDate) : ""}
                  </FormText>
                )}
                {plotSearchType && <FormText>{plotSearchType}</FormText>}
                {plotSearchSubtype && <FormText>{plotSearchSubtype}</FormText>}
                {applicantName && <FormText>{applicantName}</FormText>}
                <FormText className="type">
                  {lease
                    ? getLabelOfOption(stateOptions, lease.state)
                    : itemType}
                </FormText>
                <Authorization
                  allow={hasPermissions(
                    usersPermissions,
                    UsersPermissions.DELETE_LEASE_HISTORY_ITEM,
                  )}
                >
                  {Boolean(onDelete) && Boolean(deleteId) && (
                    <RemoveButton
                      className="related-leases-item_remove-button"
                      onClick={handleDelete}
                      title="Poista liitos"
                    />
                  )}
                </Authorization>
              </div>
            </div>
          </div>
        );
      }}
    </ModalConsumer>
  );
};

export default LeaseHistoryItem;
