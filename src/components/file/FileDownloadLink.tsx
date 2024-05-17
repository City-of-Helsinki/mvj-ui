import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { saveAs } from "file-saver";
import classNames from "classnames";
import Loader from "src/components/loader/Loader";
import LoaderWrapper from "src/components/loader/LoaderWrapper";
import { displayUIMessage, getFileNameFromResponse } from "src/util/helpers";
import { getApiToken } from "src/auth/selectors";
type Props = {
  apiToken: string;
  className?: string;
  fileName?: string;
  fileUrl: string;
  label: string;
};
type State = {
  isLoading: boolean;
};

class FileDownloadLink extends PureComponent<Props, State> {
  state = {
    isLoading: false
  };
  handleClick = () => {
    const {
      apiToken,
      fileName: fileNameProp,
      fileUrl,
      label
    } = this.props;
    const {
      isLoading
    } = this.state;
    if (isLoading) return;
    this.setState({
      isLoading: true
    });

    const stopLoader = () => {
      this.setState({
        isLoading: false
      });
    };

    const fetchFile = async () => {
      const request = new Request(fileUrl);

      if (apiToken) {
        request.headers.set('Authorization', `Bearer ${apiToken}`);
      }

      try {
        const response = await fetch(request);

        switch (response.status) {
          case 200:
            const blob = await response.blob();
            const filename = fileNameProp ? fileNameProp : getFileNameFromResponse(response);
            saveAs(blob, filename || label);
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
        console.error(`Failed to download file with error ${e}`);
        stopLoader();
        displayUIMessage({
          title: '',
          body: 'Tiedoston lataaminen epäonnistui'
        }, {
          type: 'error'
        });
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
      className,
      label
    } = this.props;
    const {
      isLoading
    } = this.state;
    return <a className={classNames('file__file-download-link', className)} onClick={this.handleClick} onKeyDown={this.handleKeyDown} tabIndex={0}>
      {label}
      {isLoading && <LoaderWrapper className='small-inline-wrapper'>
          <Loader isLoading={isLoading} className='small' />
        </LoaderWrapper>}
    </a>;
  }

}

export default connect(state => {
  return {
    apiToken: getApiToken(state)
  };
})(FileDownloadLink);