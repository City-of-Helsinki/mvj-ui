//@flow
import React, {Component} from 'react';
import classnames from 'classnames';

type Props = {
  isOpen: boolean,
}

class CommentPanel extends Component {
  props: Props
  
  render () {
    const {isOpen} = this.props;

    return (
      <div className={classnames('comment-panel', {'is-panel-open': isOpen}) }>
        <h1>Comment modal</h1>
      </div>
    );
  }
}

export default CommentPanel;
