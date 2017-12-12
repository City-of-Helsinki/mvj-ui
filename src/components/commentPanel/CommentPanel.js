//@flow
import React, {Component} from 'react';
import classnames from 'classnames';

type Props = {
  isOpen: boolean,
  onClose: Function,
}

class CommentPanel extends Component {
  props: Props

  render () {
    const {isOpen, onClose} = this.props;

    return (
      <div className={classnames('comment-panel', {'is-panel-open': isOpen}) }>
        <div className='comment-panel__title-row'>
          <div className='title'>
            <h1>Kommentit</h1>
          </div>
          <div className='close-button-container'>
            <a onClick={onClose}></a>
          </div>
        </div>

      </div>
    );
  }
}

export default CommentPanel;
