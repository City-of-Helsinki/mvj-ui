import React, { useEffect, useState } from "react";
import BasisOfRent from "./BasisOfRent";
import CalculateRentTotal from "./CalculateRentTotal";
import BoxItemContainer from "@/components/content/BoxItemContainer";
import FormText from "@/components/form/FormText";
import GrayBox from "@/components/content/GrayBox";
import GreenBox from "@/components/content/GreenBox";
import {
  BasisOfRentManagementSubventionsFieldPaths,
  LeaseBasisOfRentsFieldPaths,
} from "@/leases/enums";
import {
  calculateBasisOfRentTotalDiscountedInitialYearRent,
  getContentBasisOfRents,
} from "@/leases/helpers";
import { getFieldOptions, isEmptyValue } from "@/util/helpers";
import {
  getAttributes as getLeaseAttributes,
  getCurrentLease,
} from "@/leases/selectors";
import type { Attributes } from "types";
import type { Lease } from "@/leases/types";
import { useSelector } from "react-redux";

const BasisOfRents = () => {
  const currentLease: Lease = useSelector(getCurrentLease);
  const leaseAttributes: Attributes = useSelector(getLeaseAttributes);

  const [areaUnitOptions, setAreaUnitOptions] = useState([]);
  const [basisOfRents, setBasisOfRents] = useState([]);
  const [basisOfRentsArchived, setBasisOfRentsArchived] = useState([]);
  const [indexOptions, setIndexOptions] = useState([]);
  const [intendedUseOptions, setIntendedUseOptions] = useState([]);
  const [managementTypeOptions, setManagementTypeOptions] = useState([]);
  const [subventionTypeOptions, setSubventionTypeOptions] = useState([]);

  useEffect(() => {
    setAreaUnitOptions(
      getFieldOptions(
        leaseAttributes,
        LeaseBasisOfRentsFieldPaths.AREA_UNIT,
      ).map((item) => ({
        ...item,
        label: !isEmptyValue(item.label)
          ? item.label.replace("^2", "²")
          : item.label,
      })),
    );
    setIndexOptions(
      getFieldOptions(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX),
    );
    setIntendedUseOptions(
      getFieldOptions(
        leaseAttributes,
        LeaseBasisOfRentsFieldPaths.INTENDED_USE,
      ),
    );
    setManagementTypeOptions(
      getFieldOptions(
        leaseAttributes,
        BasisOfRentManagementSubventionsFieldPaths.MANAGEMENT,
      ),
    );
    setSubventionTypeOptions(
      getFieldOptions(
        leaseAttributes,
        LeaseBasisOfRentsFieldPaths.SUBVENTION_TYPE,
      ),
    );
  }, [leaseAttributes]);

  useEffect(() => {
    setBasisOfRents(
      getContentBasisOfRents(currentLease).filter((item) => !item.archived_at),
    );
    setBasisOfRentsArchived(
      getContentBasisOfRents(currentLease).filter((item) => item.archived_at),
    );
  }, [currentLease]);

  const totalDiscountedInitialYearRent =
    calculateBasisOfRentTotalDiscountedInitialYearRent(
      basisOfRents,
      indexOptions,
    );

  const totalDiscountedInitialYearRentArchived =
    calculateBasisOfRentTotalDiscountedInitialYearRent(
      basisOfRentsArchived,
      indexOptions,
    );

  return (
    <>
      {!basisOfRents ||
        (!basisOfRents.length && (
          <FormText className="no-margin">Ei vuokralaskureita</FormText>
        ))}
      {basisOfRents && !!basisOfRents.length && (
        <GreenBox>
          <BoxItemContainer>
            {basisOfRents.map((basisOfRent, index) => {
              return (
                <BasisOfRent
                  key={index}
                  areaUnitOptions={areaUnitOptions}
                  basisOfRent={basisOfRent}
                  indexOptions={indexOptions}
                  intendedUseOptions={intendedUseOptions}
                  managementTypeOptions={managementTypeOptions}
                  showTotal={
                    basisOfRents.length > 1 && basisOfRents.length === index + 1
                  }
                  subventionTypeOptions={subventionTypeOptions}
                  totalDiscountedInitialYearRent={
                    totalDiscountedInitialYearRent
                  }
                />
              );
            })}
            {basisOfRents.length > 1 && (
              <CalculateRentTotal
                basisOfRents={basisOfRents}
                indexOptions={indexOptions}
              />
            )}
          </BoxItemContainer>
        </GreenBox>
      )}

      {basisOfRentsArchived && !!basisOfRentsArchived.length && (
        <h3
          style={{
            marginTop: 10,
            marginBottom: 5,
          }}
        >
          Arkisto
        </h3>
      )}
      {basisOfRentsArchived && !!basisOfRentsArchived.length && (
        <GrayBox>
          <BoxItemContainer>
            {basisOfRentsArchived.map((basisOfRent, index) => {
              return (
                <BasisOfRent
                  key={index}
                  areaUnitOptions={areaUnitOptions}
                  basisOfRent={basisOfRent}
                  indexOptions={indexOptions}
                  intendedUseOptions={intendedUseOptions}
                  managementTypeOptions={managementTypeOptions}
                  showTotal={
                    basisOfRentsArchived.length > 1 &&
                    basisOfRentsArchived.length === index + 1
                  }
                  subventionTypeOptions={subventionTypeOptions}
                  totalDiscountedInitialYearRent={
                    totalDiscountedInitialYearRentArchived
                  }
                />
              );
            })}
          </BoxItemContainer>
        </GrayBox>
      )}
    </>
  );
};

export default BasisOfRents;
