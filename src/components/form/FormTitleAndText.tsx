import React from "react";
import FormText from "@/components/form/FormText";
import FormTextTitle from "@/components/form/FormTextTitle";
type Props = {
  text: any;
  textClassName?: string;
  title: string;
};

const FormTitleAndText = ({
  text,
  textClassName,
  title,
}: Props): JSX.Element => {
  return (
    <div>
      <FormTextTitle title={title} />
      <FormText className={textClassName}>{text}</FormText>
    </div>
  );
};

export default FormTitleAndText;
