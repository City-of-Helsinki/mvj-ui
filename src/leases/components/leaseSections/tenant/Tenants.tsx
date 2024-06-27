import React, { Fragment } from "react";
import { connect } from "react-redux";
import flowRight from "lodash/flowRight";
import Divider from "/src/components/content/Divider";
import FormText from "/src/components/form/FormText";
import Loader from "/src/components/loader/Loader";
import LoaderWrapper from "/src/components/loader/LoaderWrapper";
import Tenant from "./Tenant";
import Title from "/src/components/content/Title";
import WarningContainer from "/src/components/content/WarningContainer";
import WarningField from "/src/components/form/WarningField";
import { LeaseTenantsFieldPaths, LeaseTenantsFieldTitles } from "/src/leases/enums";
import { getContentTenants, getTenantShareWarnings } from "/src/leases/helpers";
import { isArchived } from "util/helpers";
import { getUiDataLeaseKey } from "uiData/helpers";
import { getCurrentLease } from "/src/leases/selectors";
import { withContactAttributes } from "/src/components/attributes/ContactAttributes";
import type { Lease } from "/src/leases/types";
type Props = {
  currentLease: Lease;
  isFetchingContactAttributes: boolean;
};

const Tenants = ({
  currentLease,
  isFetchingContactAttributes
}: Props) => {
  const tenantsAll = getContentTenants(currentLease);
  const tenants = tenantsAll.filter(tenant => !isArchived(tenant.tenant));
  const tenantsArchived = tenantsAll.filter(tenant => isArchived(tenant.tenant));
  const warnings = getTenantShareWarnings(tenants);
  if (isFetchingContactAttributes) return <LoaderWrapper><Loader isLoading={true} /></LoaderWrapper>;
  return <Fragment>
      <Title uiDataKey={getUiDataLeaseKey(LeaseTenantsFieldPaths.TENANTS)}>
        {LeaseTenantsFieldTitles.TENANTS}
      </Title>
      {warnings && !!warnings.length && <WarningContainer>
          {warnings.map((item, index) => <WarningField key={index} meta={{
        warning: item
      }} showWarning={true} />)}
        </WarningContainer>}
      <Divider />
      {!tenants.length && <FormText className='no-margin'>Ei vuokralaisia</FormText>}
      {!!tenants.length && tenants.map(tenant => <Tenant key={tenant.id} tenant={tenant} />)}

      {!!tenantsArchived.length && <h3 style={{
      marginTop: 10,
      marginBottom: 5
    }}>Arkisto</h3>}
      {!!tenantsArchived.length && tenantsArchived.map(tenant => <Tenant key={tenant.id} tenant={tenant} />)}
    </Fragment>;
};

export default flowRight(withContactAttributes, connect(state => {
  return {
    currentLease: getCurrentLease(state)
  };
}))(Tenants) as React.ComponentType<any>;