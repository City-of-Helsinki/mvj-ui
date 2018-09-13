// @flow
import React from 'react';
import {connect} from 'react-redux';
import debounce from 'lodash/debounce';
import {saveAs} from 'file-saver/FileSaver';

import {displayUIMessage, getFileNameFromResponse} from '$util/helpers';
import {getApiToken} from '$src/auth/selectors';

type Props = {
  apiToken: string,
  className?: string,
  fileUrl: string,
  label: string,
}

const FileDownloadLink = ({
  apiToken,
  className,
  fileUrl,
  label,
}: Props) => {

  const fetchFile = async() => {
    const request = new Request(fileUrl);
    if (apiToken) {
      request.headers.set('Authorization', `Bearer ${apiToken}`);
    }

    try {
      const response = await fetch(request);
      switch(response.status) {
        case 200:
          const blob = await response.blob();
          const filename = getFileNameFromResponse(response);

          saveAs(blob, filename);
          break;
        default:
          displayUIMessage({title: '', body: 'Tiedoston lataaminen epäonnistui'}, {type: 'error'});
          break;
      }
    } catch(e) {
      console.error(`Failed to download file with error ${e}`);
      displayUIMessage({title: '', body: 'Tiedoston lataaminen epäonnistui'}, {type: 'error'});
    }
  };

  const handleClick = debounce(fetchFile, 1000, {leading: true});

  const handleKeyDown = (e: any) => {
    if(e.keyCode === 13) {
      e.preventDefault();
      handleClick();
    }
  };

  return <a className={className} onClick={handleClick} onKeyDown={handleKeyDown} tabIndex={0}>{label}</a>;
};

export default connect(
  (state) => {
    return {
      apiToken: getApiToken(state),
    };
  }
)(FileDownloadLink);
