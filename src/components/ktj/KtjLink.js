// @flow
/* global API_URL */
import React from 'react';
import {connect} from 'react-redux';
import debounce from 'lodash/debounce';

import {getApiToken} from '../../auth/selectors';
import {displayUIMessage} from '$util/helpers';

type Props = {
  apiToken: string,
  fileKey: string,
  fileName?: string,
  identifier: string,
  idKey?: string,
  label: string,
  langCode?: string,
}

const KtjLink = ({
  apiToken,
  fileKey,
  fileName = 'ktj_document',
  identifier,
  idKey = 'kohdetunnus',
  label,
  langCode = 'fi',
}: Props) => {

  const handleClick =  debounce(() => {
    // $FlowFixMe
    const apiUrlWithOutVersionSuffix = API_URL.split('/v1')[0];
    const request = new Request(`${apiUrlWithOutVersionSuffix}/ktjkir/tuloste/${fileKey}/pdf?${idKey}=${identifier}&lang=${langCode}`);
    if (apiToken) {
      request.headers.set('Authorization', `Bearer ${apiToken}`);
    }
    request.headers.set('Content-Type', 'application/pdf');

    return fetch(request)
      .then((response) => {
        switch(response.status) {
          case 200:
            return response.blob();
          default:
            break;
        }
      })
      .then((blob) => {
        const filename = `${fileName}_${identifier}.pdf`;
        if (window.navigator.msSaveOrOpenBlob) { // for IE and Edge
          window.navigator.msSaveBlob(blob, filename);
        } else { // for modern browsers
          const tempLink = document.createElement('a');
          const fileURL = window.URL.createObjectURL(blob);
          tempLink.href = fileURL;
          tempLink.setAttribute('download', `${fileName}_${identifier}.pdf`);
          tempLink.click();
        }
      })
      .catch((e) => {
        console.error('Error when downloading file: ', e);
        displayUIMessage({title: '', body: 'Tiedoston lataaminen epäonnistui'}, {type: 'error'});
      });
  }, 1000, {leading: true});

  return <a onClick={handleClick}>{label}</a>;
};

export default connect(
  (state) => {
    return {
      apiToken: getApiToken(state),
    };
  }
)(KtjLink);
