import React, { Fragment, PureComponent } from "react";
import { connect } from "react-redux";
import flowRight from "lodash/flowRight";
import FormText from "@/components/form/FormText";
import Litigant from "./Litigant";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import { isArchived } from "@/util/helpers";
import { getContentLitigants } from "@/landUseContract/helpers";
import { getCurrentLandUseContract } from "@/landUseContract/selectors";
import { withContactAttributes } from "@/components/attributes/ContactAttributes";
import type { LandUseContract } from "@/landUseContract/types";
type Props = {
  currentLandUseContract: LandUseContract;
  isFetchingContactAttributes: boolean;
};
type State = {
  activeLitigants: Array<Record<string, any>>;
  archivedLitigants: Array<Record<string, any>>;
  currentLandUseContract: LandUseContract;
  litigants: Array<Record<string, any>>;
};

class Litigants extends PureComponent<Props, State> {
  state = {
    activeLitigants: [],
    archivedLitigants: [],
    currentLandUseContract: {},
    litigants: []
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    if (props.currentLandUseContract !== state.currentLandUseContract) {
      const litigants = getContentLitigants(props.currentLandUseContract);
      return {
        activeLitigants: litigants.filter(litigant => !isArchived(litigant.litigant)),
        archivedLitigants: litigants.filter(litigant => isArchived(litigant.litigant)),
        currentLandUseContract: props.currentLandUseContract,
        litigants: litigants
      };
    }

    return null;
  }

  render() {
    const {
      isFetchingContactAttributes
    } = this.props;
    const {
      activeLitigants,
      archivedLitigants
    } = this.state;
    if (isFetchingContactAttributes) return <LoaderWrapper><Loader isLoading={true} /></LoaderWrapper>;
    return <Fragment>
        {!activeLitigants.length && <FormText className='no-margin'>Ei osapuolia</FormText>}
        {!!activeLitigants.length && activeLitigants.map((litigant, index) => <Litigant key={index} litigant={litigant} />)}

        {
        /* Archived litigants */
      }
        {!!archivedLitigants.length && <h3 style={{
        marginTop: 10,
        marginBottom: 5
      }}>Arkisto</h3>}
        {!!archivedLitigants.length && archivedLitigants.map((litigant, index) => <Litigant key={index} litigant={litigant} />)}
      </Fragment>;
  }

}

export default flowRight(withContactAttributes, connect(state => {
  return {
    currentLandUseContract: getCurrentLandUseContract(state)
  };
}))(Litigants) as React.ComponentType<any>;