import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Field,
  FieldArray,
  change,
  formValueSelector,
  reduxForm,
} from "redux-form";
import { Row, Column } from "react-foundation";
import { ActionTypes, AppConsumer } from "@/app/AppContext";
import AddButton from "@/components/form/AddButton";
import Authorization from "@/components/authorization/Authorization";
import BasisOfRentsEdit from "./BasisOfRentsEdit";
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
import {
  receiveFormValidFlags,
  setRentInfoComplete,
  setRentInfoUncomplete,
} from "@/leases/actions";
import { ConfirmationModalTexts, FormNames } from "@/enums";
import {
  ButtonColors,
  RentCalculatorFieldPaths,
  RentCalculatorFieldTitles,
} from "@/components/enums";
import {
  LeaseBasisOfRentsFieldPaths,
  LeaseBasisOfRentsFieldTitles,
  LeaseRentsFieldPaths,
  LeaseRentsFieldTitles,
} from "@/leases/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { validateRentForm, warnRentForm } from "@/leases/formValidators";
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
  getErrorsByFormName,
  getIsSaveClicked,
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
  valid: boolean;
};

const RentsEdit: React.FC<Props> = ({ valid }) => {
  const dispatch = useDispatch();
  const currentLease = useSelector(getCurrentLease);
  const leaseAttributes: Attributes = useSelector(getLeaseAttributes);
  const usersPermissions = useSelector(getUsersPermissions);
  const isRentInfoComplete = Boolean(currentLease?.rent_info_completed_at);
  const editedActiveBasisOfRents = useSelector((state) =>
    formValueSelector(formName)(state, "basis_of_rents"),
  );
  const editedArchivedBasisOfRents = useSelector((state) =>
    formValueSelector(formName)(state, "basis_of_rents_archived"),
  );

  const activeBasisOfRentsComponent = useRef(null);
  const archivedBasisOfRentsComponent = useRef(null);

  const [rents, setRents] = useState([]);
  const [rentsArchived, setRentsArchived] = useState([]);

  useEffect(() => {
    const rents = getContentRents(currentLease);
    setRents(rents.filter((rent) => !isArchived(rent)));
    setRentsArchived(rents.filter((rent) => isArchived(rent)));
  }, [currentLease]);

  useEffect(() => {
    dispatch(
      receiveFormValidFlags({
        [formName]: valid,
      }),
    );
  }, [valid, dispatch]);

  const handleRentInfoComplete = () => {
    dispatch(setRentInfoComplete(currentLease.id));
  };

  const handleRentInfoUncomplete = () => {
    dispatch(setRentInfoUncomplete(currentLease.id));
  };

  const setActiveBasisOfRentsRef = (ref: any) => {
    activeBasisOfRentsComponent.current = ref;
  };

  const setArchivedBasisOfRentsRef = (ref: any) => {
    archivedBasisOfRentsComponent.current = ref;
  };

  const handleArchive = (index: number, item: Record<string, any>) => {
    activeBasisOfRentsComponent.current
      .getRenderedComponent()
      .removeBasisOfRent(index);
    addArchivedItemToUnarchivedItems(item);
  };

  const addArchivedItemToUnarchivedItems = (item: Record<string, any>) => {
    const newItems = [
      ...editedArchivedBasisOfRents,
      { ...item, archived_at: new Date().toISOString() },
    ];
    dispatch(change(formName, "basis_of_rents_archived", newItems));
  };

  const handleUnarchive = (index: number, item: Record<string, any>) => {
    archivedBasisOfRentsComponent.current
      .getRenderedComponent()
      .removeBasisOfRent(index);
    addUnarchivedItemToArchivedItems(item);
  };

  const addUnarchivedItemToArchivedItems = (item: Record<string, any>) => {
    const newItems = [
      ...editedActiveBasisOfRents,
      { ...item, archived_at: null },
    ];
    dispatch(change(formName, "basis_of_rents", newItems));
  };

  return (
    <AppConsumer>
      {({ dispatch }) => {
        const handleSetRentInfoComplete = () => {
          dispatch({
            type: ActionTypes.SHOW_CONFIRMATION_MODAL,
            confirmationFunction: () => {
              handleRentInfoComplete();
            },
            confirmationModalButtonClassName: ButtonColors.SUCCESS,
            confirmationModalButtonText:
              ConfirmationModalTexts.SET_RENT_INFO_COMPLETE.BUTTON,
            confirmationModalLabel:
              ConfirmationModalTexts.SET_RENT_INFO_COMPLETE.LABEL,
            confirmationModalTitle:
              ConfirmationModalTexts.SET_RENT_INFO_COMPLETE.TITLE,
          });
        };

        const handleSetRentInfoUncomplete = () => {
          dispatch({
            type: ActionTypes.SHOW_CONFIRMATION_MODAL,
            confirmationFunction: () => {
              handleRentInfoUncomplete();
            },
            confirmationModalButtonClassName: ButtonColors.ALERT,
            confirmationModalButtonText:
              ConfirmationModalTexts.SET_RENT_INFO_UNCOMPLETE.BUTTON,
            confirmationModalLabel:
              ConfirmationModalTexts.SET_RENT_INFO_UNCOMPLETE.LABEL,
            confirmationModalTitle:
              ConfirmationModalTexts.SET_RENT_INFO_UNCOMPLETE.TITLE,
          });
        };

        return (
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

                <Field
                  name="rentWarnings"
                  component={RentWarnings}
                  leaseAttributes={leaseAttributes}
                  showWarning={true}
                />
                <Divider />

                <FieldArray
                  component={Rents}
                  archived={false}
                  name="rents"
                  rents={rents}
                />

                {/* Archived rents */}
                <FieldArray
                  component={Rents}
                  archived={true}
                  name="rentsArchived"
                  rents={rentsArchived}
                />
              </>
            </Authorization>

            <Authorization
              allow={hasPermissions(
                usersPermissions,
                UsersPermissions.VIEW_INVOICE,
              )}
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
                  <RentCalculator />
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
                  enableUiDataEdit
                  uiDataKey={getUiDataLeaseKey(
                    LeaseBasisOfRentsFieldPaths.BASIS_OF_RENTS,
                  )}
                >
                  {LeaseBasisOfRentsFieldTitles.BASIS_OF_RENTS}
                </Title>
                <Divider />
                <FieldArray
                  ref={setActiveBasisOfRentsRef}
                  archived={false}
                  basisOfRents={editedActiveBasisOfRents}
                  component={BasisOfRentsEdit}
                  formName={formName}
                  name="basis_of_rents"
                  onArchive={handleArchive}
                />

                <FieldArray
                  ref={setArchivedBasisOfRentsRef}
                  archived={true}
                  basisOfRents={editedArchivedBasisOfRents}
                  component={BasisOfRentsEdit}
                  formName={formName}
                  name="basis_of_rents_archived"
                  onUnarchive={handleUnarchive}
                />
              </>
            </Authorization>
          </form>
        );
      }}
    </AppConsumer>
  );
};

const formName = FormNames.LEASE_RENTS;
export default reduxForm({
  form: formName,
  destroyOnUnmount: false,
  validate: validateRentForm,
  warn: warnRentForm,
})(RentsEdit) as React.ComponentType;
