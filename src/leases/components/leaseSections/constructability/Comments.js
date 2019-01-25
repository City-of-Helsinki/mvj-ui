// @flow
import React, {Fragment} from 'react';

import BoxItemContainer from '$components/content/BoxItemContainer';
import Comment from './Comment';
import FormText from '$components/form/FormText';
import SubTitle from '$components/content/SubTitle';
import {LeaseConstructabilityDescriptionsFieldTitles} from '$src/leases/enums';

type Props = {
  comments: Array<Object>,
}

const Comments = ({
  comments,
}: Props) =>
  <Fragment>
    <SubTitle>{LeaseConstructabilityDescriptionsFieldTitles.CONSTRUCTABILITY_DESCRIPTIONS}</SubTitle>
    {comments && !!comments.length
      ? (
        <BoxItemContainer>
          {comments.map((comment, index) =>
            <Comment key={index} comment={comment} />
          )}
        </BoxItemContainer>
      ) : (
        <FormText><em>Ei huomautuksia.</em></FormText>
      )
    }
  </Fragment>;

export default Comments;
