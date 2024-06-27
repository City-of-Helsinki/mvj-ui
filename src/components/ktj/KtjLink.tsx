import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { saveAs } from "file-saver";
import Loader from "/src/components/loader/Loader";
import LoaderWrapper from "/src/components/loader/LoaderWrapper";
import { getApiToken } from "/src/auth/selectors";
import { displayUIMessage, getApiUrlWithOutVersionSuffix } from "/src/util/helpers";
type Props = {
  apiToken: string;
  fileKey: string;
  fileName?: string;
  identifier: string;
  idKey?: string;
  label: string;
  langCode?: string;
  prefix: "ktjkii" | "ktjkir";
};
type State = {
  isLoading: boolean;
};

class KtjLink extends PureComponent<Props, State> {
  state = {
    isLoading: false
  };
  handleClick = () => {
    const {
      apiToken,
      fileKey,
      fileName = 'ktj_document',
      identifier,
      idKey = 'kohdetunnus',
      langCode = 'fi',
      prefix = 'ktjkir'
    } = this.props;
    const {
      isLoading
    } = this.state;
    const filename = `${fileName}_${identifier}.pdf`;
    if (isLoading) return;
    this.setState({
      isLoading: true
    });
    const apiUrlWithOutVersionSuffix = getApiUrlWithOutVersionSuffix();
    const request = new Request(`${apiUrlWithOutVersionSuffix}/${prefix}/tuloste/${fileKey}/pdf?${idKey}=${identifier}&lang=${langCode}`);

    if (apiToken) {
      request.headers.set('Authorization', `Bearer ${apiToken}`);
    }

    request.headers.set('Content-Type', 'application/pdf');

    const stopLoader = () => {
      this.setState({
        isLoading: false
      });
    };

    const fetchFile = async () => {
      try {
        const response = await fetch(request);

        switch (response.status) {
          case 200:
            const blob = await response.blob();
            saveAs(blob, filename);
            break;

          default:
            displayUIMessage({
              title: '',
              body: 'Tiedoston lataaminen epäonnistui'
            }, {
              type: 'error'
            });
            break;
        }

        stopLoader();
      } catch (e) {
        console.error('Error when downloading file: ', e);
        displayUIMessage({
          title: '',
          body: 'Tiedoston lataaminen epäonnistui'
        }, {
          type: 'error'
        });
        stopLoader();
      }
    };

    fetchFile();
  };
  handleKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.handleClick();
    }
  };

  render() {
    const {
      label
    } = this.props,
          {
      isLoading
    } = this.state;
    return <a onClick={this.handleClick} onKeyDown={this.handleKeyDown} tabIndex={0}>
      {label}
      <LoaderWrapper className='small-inline-wrapper'>
        <Loader isLoading={isLoading} className='small' />
      </LoaderWrapper>
    </a>;
  }

}

export default connect(state => {
  return {
    apiToken: getApiToken(state)
  };
})(KtjLink);