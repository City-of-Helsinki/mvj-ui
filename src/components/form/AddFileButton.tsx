import React from "react";
import AddIcon from "@/components/icons/AddIcon";
type Props = {
  label: string;
  name: string;
  onChange: (...args: Array<any>) => any;
  disabled?: boolean;
};

const AddFileButton = ({ label, name, onChange }: Props): JSX.Element => {
  let input: any;

  const handleKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      input.click();
    }
  };

  const setRefForFileInput = (element: any) => {
    input = element;
  };

  return (
    <div className="form__add-file-button">
      <label
        htmlFor={name}
        onKeyDown={handleKeyDown}
        className="form__add-file-button__label"
        tabIndex={0}
      >
        <AddIcon />
        {label}
      </label>
      <input
        ref={setRefForFileInput}
        className="form__add-file-button__input"
        name={name}
        id={name}
        type="file"
        onChange={onChange}
      />
    </div>
  );
};

export default AddFileButton;
