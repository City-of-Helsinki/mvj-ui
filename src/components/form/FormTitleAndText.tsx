import React from "react";
import FormText from "src/components/form/FormText";
import FormTextTitle from "src/components/form/FormTextTitle";
type Props = {
  text: any;
  textClassName?: string;
  title: string;
};

const FormTitleAndText = ({
  text,
  textClassName,
  title
}: Props): React.ReactNode => {
  return <div>
      <FormTextTitle title={title} />
      <FormText className={textClassName}>{text}</FormText>
    </div>;
};

export default FormTitleAndText;