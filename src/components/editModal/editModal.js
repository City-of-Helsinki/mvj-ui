// @flow

import React, {createElement} from 'react';
import flowRight from 'lodash/flowRight';
import {translate} from 'react-i18next';
import {reveal} from '../../foundation/reveal';

type Props = {
  component: Object,
  handleDismiss: Function,
  handleSave: Function,
  t: Function,
};

const EditModal = ({component, handleDismiss, handleSave, t, ...rest}: Props) => (
  <div className="edit-modal">
    <span className="edit-modal__close" onClick={handleDismiss}>{t('close')}</span>
    {component && createElement(component, {handleSave, ...rest})}
  </div>
);

export default flowRight(
  reveal({name: 'editModal'}),
  translate(['common']),
)(EditModal);
