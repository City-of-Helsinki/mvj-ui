import React from "react";
import CommentIcon from "src/components/icons/CommentIcon";
type Props = {
  commentAmount: number;
  onClick: (...args: Array<any>) => any;
};

const CommentButton = ({
  commentAmount,
  onClick
}: Props) => {
  const handleClick = () => {
    onClick();
  };

  const handleKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      handleClick();
    }
  };

  return <div className='control-buttons__comment-button' onClick={handleClick} onKeyDown={handleKeyDown} tabIndex={0}>
      <CommentIcon />
      <div className='comment-amount'>{commentAmount}</div>
    </div>;
};

export default CommentButton;