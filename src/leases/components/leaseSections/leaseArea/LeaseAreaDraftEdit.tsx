import React from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import FormFieldLegacy from "@/components/form/FormFieldLegacy";
import { Row, Column } from "react-foundation";
import {
  LeaseAreaDraftFieldPaths,
  LeaseAreaDraftFieldTitles,
  LeaseAreasFieldPaths,
  LeaseAreasFieldTitles,
} from "@/leases/enums";
import {
  getFieldAttributes,
  getSearchQuery,
  getUrlParams,
  isFieldAllowedToEdit,
  isFieldAllowedToRead,
} from "@/util/helpers";
import { getAttributes } from "@/leases/selectors";
import { FormNames } from "@/enums";
import { formValueSelector, reduxForm } from "redux-form";
import flowRight from "lodash/flowRight";
import Collapse from "@/components/collapse/Collapse";
import Authorization from "@/components/authorization/Authorization";

const LeaseAreaDraftEdit = ({ attributes, identifier }) => {
  const getMapLinkUrl = () => {
    const { pathname, search } = location;
    const searchQuery = getUrlParams(search);
    delete searchQuery.plan_unit;
    delete searchQuery.plot;
    searchQuery.tab = 7;
    return `${pathname}${getSearchQuery(searchQuery)}`;
  };

  const mapLinkUrl = getMapLinkUrl();

  return (
    <Collapse
      defaultOpen={true}
      headerTitle={
        <Authorization
          allow={isFieldAllowedToRead(
            attributes,
            LeaseAreasFieldPaths.IDENTIFIER,
          )}
        >
          <>{identifier || "-"}{" (luonnos)"}</>
        </Authorization>
      }
    >
      <Row>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseAreaDraftFieldPaths.IDENTIFIER,
            )}
          >
            <FormFieldLegacy
              fieldAttributes={getFieldAttributes(
                attributes,
                LeaseAreaDraftFieldPaths.IDENTIFIER,
              )}
              overrideValues={{
                label: LeaseAreaDraftFieldTitles.IDENTIFIER,
              }}
              name="lease_area_draft.identifier"
            />
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseAreaDraftFieldPaths.AREA,
            )}
          >
            <FormFieldLegacy
              fieldAttributes={getFieldAttributes(
                attributes,
                LeaseAreaDraftFieldPaths.AREA,
              )}
              overrideValues={{
                label: LeaseAreaDraftFieldTitles.AREA,
              }}
              name="lease_area_draft.area"
            />
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseAreaDraftFieldPaths.LOCATION,
            )}
          >
            <FormFieldLegacy
              fieldAttributes={getFieldAttributes(
                attributes,
                LeaseAreaDraftFieldPaths.LOCATION,
              )}
              overrideValues={{
                label: LeaseAreaDraftFieldTitles.LOCATION,
              }}
              name="lease_area_draft.location"
            />
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseAreaDraftFieldPaths.GEOMETRY,
            )}
          >
            <Link to={mapLinkUrl}>
              {isFieldAllowedToEdit(attributes, LeaseAreasFieldPaths.GEOMETRY)
                ? LeaseAreasFieldTitles.GEOMETRY_DRAFT
                : LeaseAreasFieldTitles.GEOMETRY}
            </Link>
          </Authorization>
        </Column>
      </Row>
      <Row>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseAreaDraftFieldPaths.ADDRESS,
            )}
          >
            <FormFieldLegacy
              fieldAttributes={getFieldAttributes(
                attributes,
                LeaseAreaDraftFieldPaths.ADDRESS,
              )}
              overrideValues={{
                label: LeaseAreaDraftFieldTitles.ADDRESS,
              }}
              name="lease_area_draft.address"
            />
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseAreaDraftFieldPaths.POSTAL_CODE,
            )}
          >
            <FormFieldLegacy
              fieldAttributes={getFieldAttributes(
                attributes,
                LeaseAreaDraftFieldPaths.POSTAL_CODE,
              )}
              overrideValues={{
                label: LeaseAreaDraftFieldTitles.POSTAL_CODE,
              }}
              name="lease_area_draft.postal_code"
            />
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization
            allow={isFieldAllowedToRead(
              attributes,
              LeaseAreaDraftFieldPaths.CITY,
            )}
          >
            <FormFieldLegacy
              fieldAttributes={getFieldAttributes(
                attributes,
                LeaseAreaDraftFieldPaths.CITY,
              )}
              overrideValues={{
                label: LeaseAreaDraftFieldTitles.CITY,
              }}
              name="lease_area_draft.city"
            />
          </Authorization>
        </Column>
      </Row>
    </Collapse>
  );
};

const formName = FormNames.LEASE_AREA_DRAFT;
const selector = formValueSelector(formName);
export default flowRight(
  withRouter,
  connect((state) => {
    return {
      attributes: getAttributes(state),
      identifier: selector(state, "lease_area_draft.identifier"),
    };
  }),
  reduxForm({
    form: FormNames.LEASE_AREA_DRAFT,
    destroyOnUnmount: false,
  }),
)(LeaseAreaDraftEdit) as React.ComponentType<any>;
