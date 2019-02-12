// @flow
import React, {Fragment} from 'react';

import BoxItemContainer from '$components/content/BoxItemContainer';
import Comment from './Comment';
import FormText from '$components/form/FormText';
import SubTitle from '$components/content/SubTitle';
import {LeaseConstructabilityDescriptionsFieldTitles} from '$src/leases/enums';

type Props = {
  commentClassName?: string,
  comments: Array<Object>,
  showNoDataText?: boolean,
  showTitle?: boolean,
}

const Comments = ({
  commentClassName,
  comments,
  showNoDataText = true,
  showTitle = true,
}: Props) =>
  <Fragment>
    {showTitle &&
      <SubTitle>{LeaseConstructabilityDescriptionsFieldTitles.CONSTRUCTABILITY_DESCRIPTIONS}</SubTitle>
    }
    {comments && !!comments.length
      ? <BoxItemContainer>
        {comments.map((comment, index) =>
          <Comment key={index} comment={comment} className={commentClassName}/>
        )}
      </BoxItemContainer>
      : showNoDataText && <FormText><em>Ei huomautuksia.</em></FormText>
    }
  </Fragment>;

export default Comments;
