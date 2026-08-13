import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { Row, Column } from "@/components/grid/Grid";
import { ActionTypes, AppConsumer } from "@/app/AppContext";
import Authorization from "@/components/authorization/Authorization";
import Button from "@/components/button/Button";
import FormFieldLabel from "@/components/form/FormFieldLabel";
import TextAreaInput from "@/components/inputs/TextAreaInput";
import { ConfirmationModalTexts, Methods } from "@/enums";
import { ButtonColors } from "@/components/enums";
import { isMethodAllowed } from "@/util/helpers";
import { getMethods as getAreaNoteMethods } from "@/areaNote/selectors";
import type { Methods as MethodsType } from "types";

type Props = {
  disableDelete: boolean;
  disableSave: boolean;
  isNew: boolean;
  onCancel: (...args: Array<any>) => any;
  onCreate: (...args: Array<any>) => any;
  onDelete: (...args: Array<any>) => any;
  onEdit: (...args: Array<any>) => any;
  show: boolean;
};

export type SaveConditionPanelHandle = {
  setNoteField: (note: string) => void;
};

const SaveConditionPanel = forwardRef<SaveConditionPanelHandle, Props>(
  (
    {
      disableDelete,
      disableSave,
      isNew,
      onCancel,
      onCreate,
      onDelete,
      onEdit,
      show,
    },
    ref,
  ) => {
    const areaNoteMethods: MethodsType = useSelector(getAreaNoteMethods);
    const [note, setNote] = useState("");
    const firstFieldRef = useRef<any>(null);
    const prevShowRef = useRef(show);

    useImperativeHandle(
      ref,
      () => ({
        setNoteField: (nextNote: string) => {
          setNote(nextNote);
        },
      }),
      [],
    );

    useEffect(() => {
      if (!prevShowRef.current && show) {
        firstFieldRef.current?.focus?.();
      }

      prevShowRef.current = show;
    }, [show]);

    const handleCreate = () => {
      onCreate(note);
    };

    const handleEdit = () => {
      onEdit(note);
    };

    return (
      <AppConsumer>
        {({ dispatch }) => {
          const handleDelete = () => {
            dispatch?.({
              type: ActionTypes.SHOW_CONFIRMATION_MODAL,
              confirmationFunction: () => {
                onDelete();
              },
              confirmationModalButtonClassName: ButtonColors.ALERT,
              confirmationModalButtonText:
                ConfirmationModalTexts.DELETE_AREA_NOTE.BUTTON,
              confirmationModalLabel:
                ConfirmationModalTexts.DELETE_AREA_NOTE.LABEL,
              confirmationModalTitle:
                ConfirmationModalTexts.DELETE_AREA_NOTE.TITLE,
            });
          };

          return (
            <div
              className={classNames("area-note-map__save-condition-panel", {
                "area-note-map__save-condition-panel--is-open": show,
              })}
            >
              <div className="area-note-map__save-condition-panel_container">
                <h2>
                  {isNew
                    ? "Luo muistettava ehto"
                    : "Muokkaa muistettavaa ehtoa"}
                </h2>

                <Row>
                  <Column>
                    <FormFieldLabel
                      className="invisible"
                      htmlFor="area-note__comment"
                    >
                      Kirjoita huomautus
                    </FormFieldLabel>
                    <TextAreaInput
                      className="no-margin"
                      id="area-note__comment"
                      onChange={(e: any) => setNote(e.target.value)}
                      placeholder="Kirjoita huomautus"
                      rows={4}
                      setRefForField={(element: any) => {
                        firstFieldRef.current = element;
                      }}
                      value={note}
                    />
                  </Column>
                </Row>
                <div className="area-note-map__save-condition-panel_buttons-wrapper">
                  <Row>
                    <Column>
                      <Authorization
                        allow={isMethodAllowed(areaNoteMethods, Methods.DELETE)}
                      >
                        {!isNew && (
                          <Button
                            className={ButtonColors.ALERT}
                            disabled={disableDelete}
                            onClick={handleDelete}
                            text="Poista"
                          />
                        )}
                      </Authorization>
                      <Button
                        className={ButtonColors.SECONDARY}
                        onClick={onCancel}
                        text="Peruuta"
                      />
                      {isNew ? (
                        <Authorization
                          allow={isMethodAllowed(areaNoteMethods, Methods.POST)}
                        >
                          <Button
                            className={ButtonColors.SUCCESS}
                            disabled={disableSave}
                            onClick={handleCreate}
                            text="Luo muistettava ehto"
                          />
                        </Authorization>
                      ) : (
                        <Authorization
                          allow={isMethodAllowed(
                            areaNoteMethods,
                            Methods.PATCH,
                          )}
                        >
                          <Button
                            className={ButtonColors.SUCCESS}
                            disabled={disableSave}
                            onClick={handleEdit}
                            text="Tallenna"
                          />
                        </Authorization>
                      )}
                    </Column>
                  </Row>
                </div>
              </div>
            </div>
          );
        }}
      </AppConsumer>
    );
  },
);

SaveConditionPanel.displayName = "SaveConditionPanel";

export default SaveConditionPanel;
