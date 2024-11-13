import React, { Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import flowRight from "lodash/flowRight";
import Authorization from "@/components/authorization/Authorization";
import BasisOfRents from "./BasisOfRents";
import Divider from "@/components/content/Divider";
import FormText from "@/components/form/FormText";
import GreenBox from "@/components/content/GreenBox";
import RentCalculator from "@/components/rent-calculator/RentCalculator";
import RentItem from "./RentItem";
import SuccessField from "@/components/form/SuccessField";
import Title from "@/components/content/Title";
import WarningContainer from "@/components/content/WarningContainer";
import WarningField from "@/components/form/WarningField";
import { RentCalculatorFieldPaths, RentCalculatorFieldTitles } from "@/components/enums";
import { LeaseBasisOfRentsFieldPaths, LeaseBasisOfRentsFieldTitles, LeaseRentsFieldPaths, LeaseRentsFieldTitles } from "@/leases/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { getContentRents, getRentWarnings } from "@/leases/helpers";
import { hasPermissions, isArchived, isFieldAllowedToRead } from "@/util/helpers";
import { getUiDataLeaseKey, getUiDataRentCalculatorKey } from "@/uiData/helpers";
import { getAttributes as getLeaseAttributes, getCurrentLease } from "@/leases/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import type { Attributes } from "types";
import type { RootState } from "@/root/types";
import type { Lease } from "@/leases/types";
import type { UsersPermissions as UsersPermissionsType } from "@/usersPermissions/types";
type Props = {
  currentLease: Lease;
  leaseAttributes: Attributes;
  usersPermissions: UsersPermissionsType;
};

const Rents = ({
  currentLease,
  leaseAttributes,
  usersPermissions
}: Props) => {
  const rentsAll = getContentRents(currentLease);
  const rents = rentsAll.filter(rent => !isArchived(rent));
  const rentsArchived = rentsAll.filter(rent => isArchived(rent));
  const warnings = getRentWarnings(rents);
  return <Fragment>
      <Title uiDataKey={getUiDataLeaseKey(LeaseRentsFieldPaths.RENTS)}>
        {LeaseRentsFieldTitles.RENTS}
      </Title>
      <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.IS_RENT_INFO_COMPLETE)}>
        <WarningContainer alignCenter success={currentLease.is_rent_info_complete}>
          {currentLease.is_rent_info_complete ? <SuccessField meta={{
          warning: 'Tiedot kunnossa'
        }} showWarning={true} /> : <WarningField meta={{
          warning: 'Tiedot keskeneräiset'
        }} showWarning={true} />}
        </WarningContainer>
      </Authorization>

      {warnings && !!warnings.length && <WarningContainer style={{
      marginTop: isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.IS_RENT_INFO_COMPLETE) ? 0 : null
    }}>
          {warnings.map((item, index) => <WarningField key={index} meta={{
        warning: item
      }} showWarning={true} />)}
        </WarningContainer>}
      <Divider />

      <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentsFieldPaths.RENTS)}>
        <>
        {!rents || !rents.length && <FormText className='no-margin'>Ei vuokria</FormText>}
        {rents && !!rents.length && rents.map(rent => {
        return <RentItem key={rent.id} rent={rent} rents={rents} serviceUnitId={currentLease.service_unit.id} />;
      })}

        {!!rentsArchived.length && <h3 style={{
        marginTop: 10,
        marginBottom: 5
      }}>Arkisto</h3>}
        {!!rentsArchived.length && rentsArchived.map(rent => <RentItem key={rent.id} rent={rent} rents={rents} />)}
        </>
      </Authorization>

      <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.VIEW_INVOICE)}>
        <>
        <Title uiDataKey={getUiDataRentCalculatorKey(RentCalculatorFieldPaths.RENT_CALCULATOR)}>
          {RentCalculatorFieldTitles.RENT_CALCULATOR}
        </Title>
        <Divider />
        <GreenBox>
          <RentCalculator />
        </GreenBox>
        </>
      </Authorization>

      <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.BASIS_OF_RENTS)}>
        <>
        <Title uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.BASIS_OF_RENTS)}>
          {LeaseBasisOfRentsFieldTitles.BASIS_OF_RENTS}
        </Title>
        <Divider />
        <BasisOfRents />
        </>
      </Authorization>
    </Fragment>;
};

const mapStateToProps = (state: RootState) => {
  return {
    currentLease: getCurrentLease(state),
    leaseAttributes: getLeaseAttributes(state),
    usersPermissions: getUsersPermissions(state)
  };
};

export default flowRight(connect(mapStateToProps), withRouter)(Rents) as React.ComponentType<any>;
