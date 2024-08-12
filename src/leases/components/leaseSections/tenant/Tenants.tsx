import React, { Fragment } from "react";
import { connect } from "react-redux";
import flowRight from "lodash/flowRight";
import Divider from "@/components/content/Divider";
import FormText from "@/components/form/FormText";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import Tenant from "./Tenant";
import Title from "@/components/content/Title";
import WarningContainer from "@/components/content/WarningContainer";
import WarningField from "@/components/form/WarningField";
import { LeaseTenantsFieldPaths, LeaseTenantsFieldTitles } from "@/leases/enums";
import { getContentTenants, getTenantShareWarnings } from "@/leases/helpers";
import { isArchived } from "@/util/helpers";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import { getCurrentLease } from "@/leases/selectors";
import { withContactAttributes } from "@/components/attributes/ContactAttributes";
import type { Lease } from "@/leases/types";
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