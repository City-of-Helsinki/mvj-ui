import React, { useRef } from "react";
import { useSelector } from "react-redux";
import Authorization from "@/components/authorization/Authorization";
import BasisOfRents from "./basisOfRent/BasisOfRents";
import Divider from "@/components/content/Divider";
import FormText from "@/components/form/FormText";
import arrayMutators from "final-form-arrays";
import { createForm } from "final-form";
import GreenBox from "@/components/content/GreenBox";
import RentCalculator from "@/components/rent-calculator/RentCalculator";
import RentItem from "./RentItem";
import SuccessField from "@/components/form/SuccessField";
import Title from "@/components/content/Title";
import WarningContainer from "@/components/content/WarningContainer";
import WarningField from "@/components/form/WarningField";
import { validateRentCalculatorForm } from "@/components/formValidations";
import {
  RentCalculatorFieldPaths,
  RentCalculatorFieldTitles,
  RentCalculatorTypes,
} from "@/components/enums";
import {
  LeaseBasisOfRentsFieldPaths,
  LeaseBasisOfRentsFieldTitles,
  LeaseRentsFieldPaths,
  LeaseRentsFieldTitles,
} from "@/leases/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { getContentRents, getRentWarnings } from "@/leases/helpers";
import {
  hasPermissions,
  isArchived,
  isFieldAllowedToRead,
} from "@/util/helpers";
import { getCurrentYear } from "@/util/date";
import {
  getUiDataLeaseKey,
  getUiDataRentCalculatorKey,
} from "@/uiData/helpers";
import {
  getAttributes as getLeaseAttributes,
  getCurrentLease,
} from "@/leases/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import type { Attributes } from "types";

const Rents: React.FC = () => {
  const currentLease = useSelector(getCurrentLease);
  const leaseAttributes: Attributes = useSelector(getLeaseAttributes);
  const usersPermissions = useSelector(getUsersPermissions);

  const rentsAll = getContentRents(currentLease);
  const rents = rentsAll.filter((rent) => !isArchived(rent));
  const rentsArchived = rentsAll.filter((rent) => isArchived(rent));
  const warnings = getRentWarnings(rents);
  const currentYear = getCurrentYear();

  const rentCalculatorFormRef = useRef(
    createForm({
      onSubmit: () => {},
      mutators: { ...arrayMutators },
      validate: validateRentCalculatorForm,
      initialValues: {
        type: RentCalculatorTypes.YEAR,
        year: currentYear,
        billing_start_date: `${currentYear}-01-01`,
        billing_end_date: `${currentYear}-12-31`,
      },
    }),
  );

  return (
    <>
      <Title uiDataKey={getUiDataLeaseKey(LeaseRentsFieldPaths.RENTS)}>
        {LeaseRentsFieldTitles.RENTS}
      </Title>
      <Authorization
        allow={isFieldAllowedToRead(
          leaseAttributes,
          LeaseRentsFieldPaths.RENT_INFO_COMPLETED_AT,
        )}
      >
        <WarningContainer
          alignCenter
          success={!!currentLease.rent_info_completed_at}
        >
          {currentLease.rent_info_completed_at ? (
            <SuccessField
              meta={{
                warning: "Tiedot kunnossa",
              }}
              showWarning={true}
            />
          ) : (
            <WarningField
              meta={{
                warning: "Tiedot keskeneräiset",
              }}
              showWarning={true}
            />
          )}
        </WarningContainer>
      </Authorization>

      {warnings && !!warnings.length && (
        <WarningContainer
          style={{
            marginTop: isFieldAllowedToRead(
              leaseAttributes,
              LeaseRentsFieldPaths.RENT_INFO_COMPLETED_AT,
            )
              ? 0
              : null,
          }}
        >
          {warnings.map((item, index) => (
            <WarningField
              key={index}
              meta={{
                warning: item,
              }}
              showWarning={true}
            />
          ))}
        </WarningContainer>
      )}
      <Divider />

      <Authorization
        allow={isFieldAllowedToRead(
          leaseAttributes,
          LeaseRentsFieldPaths.RENTS,
        )}
      >
        <>
          {!rents ||
            (!rents.length && (
              <FormText className="no-margin">Ei vuokria</FormText>
            ))}
          {rents &&
            !!rents.length &&
            rents.map((rent) => {
              return <RentItem key={rent.id} rent={rent} rents={rents} />;
            })}

          {!!rentsArchived.length && (
            <h3
              style={{
                marginTop: 10,
                marginBottom: 5,
              }}
            >
              Arkisto
            </h3>
          )}
          {!!rentsArchived.length &&
            rentsArchived.map((rent) => (
              <RentItem key={rent.id} rent={rent} rents={rents} />
            ))}
        </>
      </Authorization>

      <Authorization
        allow={hasPermissions(usersPermissions, UsersPermissions.VIEW_INVOICE)}
      >
        <>
          <Title
            uiDataKey={getUiDataRentCalculatorKey(
              RentCalculatorFieldPaths.RENT_CALCULATOR,
            )}
          >
            {RentCalculatorFieldTitles.RENT_CALCULATOR}
          </Title>
          <Divider />
          <GreenBox>
            <RentCalculator formApi={rentCalculatorFormRef.current} />
          </GreenBox>
        </>
      </Authorization>

      <Authorization
        allow={isFieldAllowedToRead(
          leaseAttributes,
          LeaseBasisOfRentsFieldPaths.BASIS_OF_RENTS,
        )}
      >
        <>
          <Title
            uiDataKey={getUiDataLeaseKey(
              LeaseBasisOfRentsFieldPaths.BASIS_OF_RENTS,
            )}
          >
            {LeaseBasisOfRentsFieldTitles.BASIS_OF_RENTS}
          </Title>
          <Divider />
          <BasisOfRents />
        </>
      </Authorization>
    </>
  );
};

export default Rents;
