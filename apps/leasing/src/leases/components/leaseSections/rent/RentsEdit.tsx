import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FieldArray } from "react-final-form-arrays";
import { Field, Form } from "react-final-form";
import type { FormApi } from "final-form";
import { Row, Column } from "react-foundation";
import { ActionTypes, AppConsumer } from "@/app/AppContext";
import AddButton from "@/components/form/AddButton";
import Authorization from "@/components/authorization/Authorization";
import Button from "@/components/button/Button";
import Divider from "@/components/content/Divider";
import FormText from "@/components/form/FormText";
import GreenBox from "@/components/content/GreenBox";
import RentCalculator from "@/components/rent-calculator/RentCalculator";
import RentItemEdit from "./RentItemEdit";
import SuccessField from "@/components/form/SuccessField";
import Title from "@/components/content/Title";
import WarningContainer from "@/components/content/WarningContainer";
import WarningField from "@/components/form/WarningField";
import { ConfirmationModalTexts } from "@/enums";
import {
  ButtonColors,
  RentCalculatorFieldPaths,
  RentCalculatorFieldTitles,
} from "@/components/enums";
import { LeaseRentsFieldPaths, LeaseRentsFieldTitles } from "@/leases/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { getContentRents } from "@/leases/helpers";
import {
  getUiDataLeaseKey,
  getUiDataRentCalculatorKey,
} from "@/uiData/helpers";
import {
  hasPermissions,
  isArchived,
  isFieldAllowedToRead,
} from "@/util/helpers";
import {
  getAttributes as getLeaseAttributes,
  getCurrentLease,
} from "@/leases/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import type { Attributes } from "types";
type WarningsProps = {
  leaseAttributes: Attributes;
  meta: Record<string, any>;
};

const RentWarnings: React.FC<WarningsProps> = ({
  leaseAttributes,
  meta: { warning },
}) => {
  return (
    <>
      {warning && !!warning.length && (
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
          {warning.map((item, index) => (
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
    </>
  );
};

type RentsProps = {
  archived: boolean;
  fields: any;
  rents: Array<Record<string, any>>;
};

const Rents: React.FC<RentsProps> = ({ archived, fields, rents }) => {
  const usersPermissions = useSelector(getUsersPermissions);

  const handleAdd = () => {
    fields.push({
      contract_rents: [{}],
    });
  };

  return (
    <AppConsumer>
      {({ dispatch }) => {
        return (
          <>
            {!hasPermissions(usersPermissions, UsersPermissions.ADD_RENT) &&
              !archived &&
              (!fields || !fields.length) && (
                <FormText className="no-margin">Ei vuokria</FormText>
              )}

            {archived && !!fields && !!fields.length && (
              <h3
                style={{
                  marginTop: 10,
                  marginBottom: 5,
                }}
              >
                Arkisto
              </h3>
            )}

            {fields &&
              !!fields.length &&
              fields.map((item, index) => {
                const handleRemove = () => {
                  dispatch({
                    type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                    confirmationFunction: () => {
                      fields.remove(index);
                    },
                    confirmationModalButtonClassName: ButtonColors.ALERT,
                    confirmationModalButtonText:
                      ConfirmationModalTexts.DELETE_RENT.BUTTON,
                    confirmationModalLabel:
                      ConfirmationModalTexts.DELETE_RENT.LABEL,
                    confirmationModalTitle:
                      ConfirmationModalTexts.DELETE_RENT.TITLE,
                  });
                };

                return (
                  <RentItemEdit
                    key={index}
                    field={item}
                    index={index}
                    onRemove={handleRemove}
                    rents={rents}
                  />
                );
              })}
            {!archived && (
              <Authorization
                allow={hasPermissions(
                  usersPermissions,
                  UsersPermissions.ADD_RENT,
                )}
              >
                <Row>
                  <Column>
                    <AddButton label="Lisää vuokra" onClick={handleAdd} />
                  </Column>
                </Row>
              </Authorization>
            )}
          </>
        );
      }}
    </AppConsumer>
  );
};

type Props = {
  rentsFormApi: FormApi;
  rentCalculatorFormApi: FormApi;
  handleSetRentInfoComplete: () => void;
  handleSetRentInfoUncomplete: () => void;
};

const RentsEdit: React.FC<Props> = ({
  rentsFormApi,
  rentCalculatorFormApi,
  handleSetRentInfoComplete,
  handleSetRentInfoUncomplete,
}) => {
  const currentLease = useSelector(getCurrentLease);
  const leaseAttributes: Attributes = useSelector(getLeaseAttributes);
  const usersPermissions = useSelector(getUsersPermissions);
  const isRentInfoComplete = Boolean(currentLease?.rent_info_completed_at);

  const [rents, setRents] = useState([]);
  const [rentsArchived, setRentsArchived] = useState([]);

  useEffect(() => {
    const rents = getContentRents(currentLease);
    setRents(rents.filter((rent) => !isArchived(rent)));
    setRentsArchived(rents.filter((rent) => isArchived(rent)));
  }, [currentLease]);

  return (
    <>
      <Form form={rentsFormApi} onSubmit={rentsFormApi.submit}>
        {() => (
          <form>
            <Authorization
              allow={isFieldAllowedToRead(
                leaseAttributes,
                LeaseRentsFieldPaths.RENTS,
              )}
            >
              <>
                <Title
                  enableUiDataEdit
                  uiDataKey={getUiDataLeaseKey(LeaseRentsFieldPaths.RENTS)}
                >
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
                    buttonComponent={
                      <Authorization
                        allow={hasPermissions(
                          usersPermissions,
                          UsersPermissions.CHANGE_LEASE_RENT_INFO_COMPLETED_AT,
                        )}
                      >
                        {isRentInfoComplete ? (
                          <Button
                            className={ButtonColors.NEUTRAL}
                            onClick={handleSetRentInfoUncomplete}
                            text="Merkitse keskeneräisiksi"
                          />
                        ) : (
                          <Button
                            className={ButtonColors.NEUTRAL}
                            onClick={handleSetRentInfoComplete}
                            text="Merkitse valmiiksi"
                          />
                        )}
                      </Authorization>
                    }
                    success={isRentInfoComplete}
                  >
                    {isRentInfoComplete ? (
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

                <Field name="rentWarnings" subscription={{ value: true }}>
                  {({ meta }) => (
                    <RentWarnings
                      leaseAttributes={leaseAttributes}
                      meta={meta}
                    />
                  )}
                </Field>
                <Divider />

                <FieldArray name="rents">
                  {(fieldArrayProps) =>
                    Rents({
                      ...fieldArrayProps,
                      archived: false,
                      rents: rents,
                    })
                  }
                </FieldArray>

                {/* Archived rents */}
                <FieldArray name="rentsArchived">
                  {(fieldArrayProps) =>
                    Rents({
                      ...fieldArrayProps,
                      archived: true,
                      rents: rentsArchived,
                    })
                  }
                </FieldArray>
              </>
            </Authorization>
          </form>
        )}
      </Form>
      <Authorization
        allow={hasPermissions(usersPermissions, UsersPermissions.VIEW_INVOICE)}
      >
        <>
          <Title
            enableUiDataEdit
            uiDataKey={getUiDataRentCalculatorKey(
              RentCalculatorFieldPaths.RENT_CALCULATOR,
            )}
          >
            {RentCalculatorFieldTitles.RENT_CALCULATOR}
          </Title>
          <Divider />
          <GreenBox>
            <RentCalculator formApi={rentCalculatorFormApi} />
          </GreenBox>
        </>
      </Authorization>
    </>
  );
};

export default RentsEdit;
