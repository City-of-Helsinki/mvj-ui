import React, { useState } from "react";
import {
  Button,
  ButtonSize,
  ButtonVariant,
  Dialog,
  IconTrash,
  type IconProps,
} from "hds-react";

interface ConfirmDeleteButtonProps {
  id: string;
  onConfirm: () => void;
  dialogTitle: string;
  dialogContent: React.ReactNode;
  buttonLabel?: string;
  buttonAriaLabel?: string;
  buttonVariant?: ButtonVariant;
  buttonSize?: ButtonSize;
  buttonClassName?: string;
  buttonStyle?: React.CSSProperties;
  disabled?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  iconStart?: React.ReactElement<IconProps>;
}

export const ConfirmDeleteButton: React.FC<ConfirmDeleteButtonProps> = ({
  id,
  onConfirm,
  dialogTitle,
  dialogContent,
  buttonLabel = "Poista",
  buttonAriaLabel,
  buttonVariant = ButtonVariant.Danger,
  buttonSize = ButtonSize.Small,
  buttonClassName,
  buttonStyle,
  disabled = false,
  confirmLabel = "Poista",
  cancelLabel = "Peruuta",
  iconStart = <IconTrash />,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const titleId = `${id}-title`;

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const handleConfirm = () => {
    onConfirm();
    closeDialog();
  };

  return (
    <>
      <Button
        type="button"
        aria-label={buttonAriaLabel}
        variant={buttonVariant}
        size={buttonSize}
        className={buttonClassName}
        style={buttonStyle}
        disabled={disabled}
        iconStart={iconStart}
        onClick={() => setIsDialogOpen(true)}
      >
        {buttonLabel}
      </Button>

      <Dialog
        id={id}
        isOpen={isDialogOpen}
        aria-labelledby={titleId}
        closeButtonLabelText="Sulje"
        close={closeDialog}
      >
        <Dialog.Header id={titleId} title={dialogTitle} />
        <Dialog.Content>{dialogContent}</Dialog.Content>
        <Dialog.ActionButtons>
          <Button
            type="button"
            variant={ButtonVariant.Secondary}
            onClick={closeDialog}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={ButtonVariant.Danger}
            onClick={handleConfirm}
          >
            {confirmLabel}
          </Button>
        </Dialog.ActionButtons>
      </Dialog>
    </>
  );
};
