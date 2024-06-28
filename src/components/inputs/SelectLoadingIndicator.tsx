// flow
import React from "react";
import Loader from "/src/components/loader/Loader";
import LoaderWrapper from "/src/components/loader/LoaderWrapper";

const SelectLoadingIndicator = () => <LoaderWrapper className='select-wrapper'>
    <Loader isLoading className='small' />
  </LoaderWrapper>;

export default SelectLoadingIndicator;