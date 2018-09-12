// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';

import DebtCollectionForm from './forms/DebtCollectionForm';
import GreenBox from '$components/content/GreenBox';
import {fetchCollectionLettersByLease} from '$src/collectionLetter/actions';
import {getCollectionLettersByLease} from '$src/collectionLetter/selectors';
import {getCurrentLease} from '$src/leases/selectors';

import type {Lease} from '$src/leases/types';

type Props = {
  collectionLetters: Array<Object>,
  currentLease: Lease,
  fetchCollectionLettersByLease: Function,
}

class DebtCollection extends Component<Props> {
  componentDidMount = () => {
    const {collectionLetters, currentLease, fetchCollectionLettersByLease} = this.props;
    if(!collectionLetters) {
      fetchCollectionLettersByLease(currentLease.id);
    }
  }
  render() {
    return(
      <GreenBox className='with-bottom-margin'>
        <DebtCollectionForm/>
      </GreenBox>
    );
  }

}

export default connect(
  (state) => {
    const currentLease = getCurrentLease(state);
    return {
      collectionLetters: getCollectionLettersByLease(state, currentLease.id),
      currentLease: currentLease,
    };
  },
  {
    fetchCollectionLettersByLease,
  }
)(DebtCollection);
