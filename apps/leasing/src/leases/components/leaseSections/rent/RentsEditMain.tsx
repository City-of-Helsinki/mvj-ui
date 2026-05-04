import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { FormApi } from "final-form";
import { ActionTypes, AppConsumer } from "@/app/AppContext";
import { setRentInfoComplete, setRentInfoUncomplete } from "@/leases/actions";
import { ConfirmationModalTexts } from "@/enums";
import { ButtonColors } from "@/components/enums";
import { getCurrentLease } from "@/leases/selectors";
import RentsEdit from "./RentsEdit";
import BasisOfRentsEditMain from "./basisOfRent/BasisOfRentsEditMain";

type Props = {
  rentsFormApi: FormApi;
  rentCalculatorFormApi: FormApi;
};

const RentsEditMain: React.FC<Props> = ({
  rentsFormApi,
  rentCalculatorFormApi,
}) => {
  const dispatch = useDispatch();
  const currentLease = useSelector(getCurrentLease);

  const handleRentInfoComplete = () => {
    dispatch(setRentInfoComplete(currentLease.id));
  };

  const handleRentInfoUncomplete = () => {
    dispatch(setRentInfoUncomplete(currentLease.id));
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
          <>
            <RentsEdit
              rentsFormApi={rentsFormApi}
              rentCalculatorFormApi={rentCalculatorFormApi}
              handleSetRentInfoComplete={handleSetRentInfoComplete}
              handleSetRentInfoUncomplete={handleSetRentInfoUncomplete}
            />
            <BasisOfRentsEditMain />
          </>
        );
      }}
    </AppConsumer>
  );
};

export default RentsEditMain;
