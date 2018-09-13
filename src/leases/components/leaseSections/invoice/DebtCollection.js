// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';

import DebtCollectionForm from './forms/DebtCollectionForm';
import GreenBox from '$components/content/GreenBox';
import {fetchCollectionCourtDecisionsByLease} from '$src/collectionCourtDecision/actions';
import {fetchCollectionLettersByLease} from '$src/collectionLetter/actions';
import {fetchCollectionNotesByLease} from '$src/collectionNote/actions';
import {getCollectionCourtDecisionsByLease} from '$src/collectionCourtDecision/selectors';
import {getCollectionLettersByLease} from '$src/collectionLetter/selectors';
import {getCollectionNotesByLease} from '$src/collectionNote/selectors';
import {getCurrentLease} from '$src/leases/selectors';

import type {Lease} from '$src/leases/types';

type Props = {
  collectionCourtDecisions: Array<Object>,
  collectionLetters: Array<Object>,
  collectionNotes: Array<Object>,
  currentLease: Lease,
  fetchCollectionCourtDecisionsByLease: Function,
  fetchCollectionLettersByLease: Function,
  fetchCollectionNotesByLease: Function,
}

class DebtCollection extends Component<Props> {
  componentDidMount = () => {
    const {
      collectionCourtDecisions,
      collectionLetters,
      collectionNotes,
      currentLease,
      fetchCollectionCourtDecisionsByLease,
      fetchCollectionLettersByLease,
      fetchCollectionNotesByLease,
    } = this.props;
    if(!collectionCourtDecisions) {
      fetchCollectionCourtDecisionsByLease(currentLease.id);
    }
    if(!collectionLetters) {
      fetchCollectionLettersByLease(currentLease.id);
    }
    if(!collectionNotes) {
      fetchCollectionNotesByLease(currentLease.id);
    }
  }
  render() {
    return(
      <GreenBox className='with-bottom-margin'>
        <DebtCollectionForm />
      </GreenBox>
    );
  }

}

export default connect(
  (state) => {
    const currentLease = getCurrentLease(state);
    return {
      collectionCourtDecisions: getCollectionCourtDecisionsByLease(state, currentLease.id),
      collectionLetters: getCollectionLettersByLease(state, currentLease.id),
      collectionNotes: getCollectionNotesByLease(state, currentLease.id),
      currentLease: currentLease,
    };
  },
  {
    fetchCollectionCourtDecisionsByLease,
    fetchCollectionLettersByLease,
    fetchCollectionNotesByLease,
  }
)(DebtCollection);
