import React, { useState } from "react";
import { connect } from "react-redux";
import { saveAs } from "file-saver";
import { Button, IconDownload } from "hds-react";
import { displayUIMessage, getFileNameFromResponse } from "@/util/helpers";
import { getApiToken } from "@/auth/selectors";
type OwnProps = {
  disabled: boolean;
  label: string;
  payload?: Record<string, any>;
  url: string;
  loadingText?: string;
  timeoutMs?: number;
  onSuccess?: () => void;
  onFailure?: () => void;
};
type Props = OwnProps & {
  apiToken: string;
};

const FileDownloadButton = ({
  apiToken,
  disabled,
  label,
  payload,
  url,
  loadingText,
  timeoutMs,
  onFailure,
  onSuccess,
}: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchFile = async () => {
    setIsLoading(true);
    const controller = new AbortController();
    const abortTimeoutMs = timeoutMs || 30000;
    const abortTimeoutS = abortTimeoutMs / 1000;
    const timeoutId = setTimeout(() => controller.abort(), abortTimeoutMs);

    let request: Request;

    if (payload) {
      const body = JSON.stringify(payload);
      request = new Request(url, {
        method: "POST",
        body,
        signal: controller.signal,
      });
      request.headers.set("Content-Type", "application/json");
    } else {
      request = new Request(url, { signal: controller.signal });
    }

    if (apiToken) {
      request.headers.set("Authorization", `Bearer ${apiToken}`);
    }
    try {
      const response = await fetch(request);

      clearTimeout(timeoutId);

      switch (response.status) {
        case 200:
          const blob = await response.blob();
          const filename = getFileNameFromResponse(response);
          saveAs(blob, filename);
          onSuccess && onSuccess();
          break;

        default:
          const errors = await response.json();

          if (errors && errors.detail) {
            displayUIMessage(
              {
                title: "",
                body: errors.detail,
              },
              {
                type: "error",
              },
            );
          } else {
            const errorMessage = errors?.error
              ? errors.error
              : errors.message
                ? errors.message
                : "";
            displayUIMessage(
              {
                title: "Tiedoston lataaminen epäonnistui",
                body: errorMessage,
              },
              {
                type: "error",
                timeOut: 15000,
              },
            );
          }

          onFailure && onFailure();
          break;
      }
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") {
        console.error(`Request timed out after ${timeoutMs}ms`);
        displayUIMessage(
          {
            title: "",
            body: `Tiedoston lataaminen keskeytettiin ${abortTimeoutS}s jälkeen.`,
          },
          {
            type: "error",
          },
        );
      } else {
        console.error(`Failed to download file with error ${e}`);
        displayUIMessage(
          {
            title: "",
            body: "Tiedoston lataaminen epäonnistui",
          },
          {
            type: "error",
          },
        );
        onFailure && onFailure();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    fetchFile();
  };

  return (
    <Button
      disabled={disabled}
      onClick={handleClick}
      iconLeft={<IconDownload />}
      {...(isLoading && { isLoading })}
      {...(loadingText && { loadingText })}
    >
      {label}
    </Button>
  );
};

export default connect((state) => {
  return {
    apiToken: getApiToken(state),
  };
})(FileDownloadButton);
