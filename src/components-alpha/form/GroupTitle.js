// @flow
import React from 'react';
import {Column} from 'react-foundation';

type Props = {
  text: string,
};

const GroupTitle = ({text}: Props) => (
  <Column medium={12}>
    <h3 className="mvj-form__group-title">{text}</h3>
  </Column>
);

export default GroupTitle;
