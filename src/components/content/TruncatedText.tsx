import React from "react";
type Props = {
  text: string;
};

const TruncatedText = ({
  text
}: Props) => <span title={text} className='content__truncated-text'>{text}</span>;

export default TruncatedText;