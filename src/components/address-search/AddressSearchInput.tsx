import React, { Component } from "react";
import classNames from "classnames";
import capitalize from "lodash/capitalize";
import debounce from "lodash/debounce";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import { stringifyQuery } from "@/api/createUrl";
import { KeyCodes } from "@/enums";
import { findFromOcdString } from "@/util/helpers";
import { SERVICE_MAP_URL } from "@/util/constants";
type Language = "fi" | "sv";
const MINIMUM_SEARCH_STRING = 3;
const DEBOUNCE_TIME_MILLISECONDS = 500;
type Address = {
  object_type: string;
  name: {
    fi: string;
    sv: string;
    en: string;
  };
  number: string;
  number_end: string;
  letter: string;
  modified_at: string;
  municipality: {
    id: string;
    name: {
      fi: string;
      sv: string;
    };
  };
  street: {
    name: {
      fi: string;
      sv: string;
    };
  };
  location: {
    type: string;
    coordinates: Array<number>;
  };
};
type Props = {
  addressDetailsCallBack?: (...args: Array<any>) => any;
  id?: string;
  name?: string;
  onBlur?: (...args: Array<any>) => any;
  onChange?: (...args: Array<any>) => any;
  selected?: string | null | undefined;
  autoComplete?: any;
  disabled?: boolean;
};
type State = {
  addresses: Array<Address>;
  filteredAddresses: Array<Address>;
  focusedValue: Record<string, any> | null | undefined;
  hasFocus: boolean;
  isLoading: boolean;
  menuOpen: boolean;
  selectedAddress: Address | null | undefined;
  value: string | null | undefined;
};

class AddressSearchInput extends Component<Props, State> {
  rootRef: React.RefObject<HTMLDivElement>;
  input: any;
  menuList: any;
  state = {
    addresses: [],
    filteredAddresses: [],
    focusedValue: null,
    hasFocus: false,
    isLoading: false,
    menuOpen: false,
    selectedAddress: null,
    value: this.props.selected || "",
  };
  static defaultProps = {
    language: "fi",
  };

  constructor(props: Props) {
    super(props);
    this.rootRef = React.createRef();
  }

  setInputRef = (el: any) => {
    this.input = el;
  };
  refMenuListRef = (el: any) => {
    this.menuList = el;
  };

  componentDidMount() {
    window.addEventListener("click", this.onDocumentClick);
    window.addEventListener("keydown", this.onKeyDown);
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.focusedValue !== this.state.focusedValue) {
      this.scrollToFocusedItem();
    }

    if (
      this.props.selected !== undefined &&
      this.props.selected !== prevProps.selected
    ) {
      this.setState({
        value: this.props.selected,
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.onDocumentClick);
    window.removeEventListener("keydown", this.onKeyDown);
  }

  scrollToFocusedItem = () => {
    const focusedItems = this.menuList.getElementsByClassName("is-focused");

    if (focusedItems.length) {
      const focusedItem = focusedItems[0],
        top = focusedItem.offsetTop,
        height = focusedItem.offsetHeight,
        menuScrollTop = this.menuList.scrollTop,
        menuHeight = this.menuList.clientHeight;

      if (top < menuScrollTop) {
        this.menuList.scrollTop = top;
      } else if (top + height > menuScrollTop + menuHeight) {
        this.menuList.scrollTop = top + height - menuHeight;
      }
    }
  };
  onDocumentClick = (event: any) => {
    const { menuOpen } = this.state;
    const target = event.target,
      el = this.rootRef.current;

    if (menuOpen && el && target !== el && !el.contains(target)) {
      this.closeMenu();
    }
  };
  openMenuIfNeeded = () => {
    const { menuOpen } = this.state;

    if (!menuOpen) {
      this.setState({
        menuOpen: true,
      });
    }
  };
  closeMenu = () => {
    this.setState({
      focusedValue: null,
      menuOpen: false,
    });
  };
  onKeyDown = (e: any) => {
    const { focusedValue, hasFocus } = this.state;

    if (hasFocus) {
      switch (e.keyCode) {
        case KeyCodes.ARROW_DOWN:
          e.preventDefault();
          this.openMenuIfNeeded();
          this.focusValue("next");
          break;

        case KeyCodes.ARROW_UP:
          e.preventDefault();
          this.openMenuIfNeeded();
          this.focusValue("previous");
          break;

        case KeyCodes.ENTER:
          if (focusedValue) {
            this.handleAddressItemClick(focusedValue);
          }

          break;

        case KeyCodes.ESC:
          this.closeMenu();
          break;

        case KeyCodes.TAB:
          this.closeMenu();
          break;
      }
    }
  };
  handleBlur = () => {
    const { onBlur } = this.props;
    const { value } = this.state;
    this.setState({
      hasFocus: false,
    });

    if (onBlur) {
      onBlur(value);
    }
  };
  handleFocus = () => {
    this.setState({
      hasFocus: true,
    });
  };
  focusValue = (direction: "next" | "previous") => {
    const { focusedValue } = this.state;
    const { addresses } = this.state;
    const index = addresses.findIndex((address) => focusedValue === address);

    switch (direction) {
      case "next":
        if (index < addresses.length - 1) {
          this.setState({
            focusedValue: addresses[index + 1],
            menuOpen: true,
          });
        }

        break;

      case "previous":
        if (index > 0) {
          this.setState({
            focusedValue: addresses[index - 1],
            menuOpen: true,
          });
        }

        break;
    }
  };
  searchByKeyword = debounce((input: string) => {
    const fetchByKeyword = (language: Language) => {
      const url = `${SERVICE_MAP_URL}/search/?${stringifyQuery({
        page_size: 25,
        type: "address",
        input: input,
        language: language,
      })}`;
      const request = new Request(url);
      return fetch(request);
    };

    const fetchResults = async () => {
      const fiResponse = await fetchByKeyword("fi");
      const fiResults = await fiResponse.json();
      return [
        ...fiResults.results.map((address) => ({ ...address, language: "fi" })),
      ];
    };

    this.setState({
      isLoading: true,
    });
    fetchResults()
      .then((results) => {
        if (results.length) {
          this.setState({
            addresses: results,
            selectedAddress: results[0],
          });
          this.setState({
            isLoading: false,
          });
        } else {
          this.setState({
            isLoading: false,
          });
        }
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        console.error(`Failed to fetch by keyword with error ${error}`);
      });
  }, DEBOUNCE_TIME_MILLISECONDS);
  handleOnChange = (e: any) => {
    const { onChange } = this.props;
    const newValue = e.target.value;

    if (newValue && newValue?.length >= MINIMUM_SEARCH_STRING) {
      this.searchByKeyword(newValue);
    }

    if (!newValue || newValue?.length < MINIMUM_SEARCH_STRING) {
      this.setState({
        addresses: [],
      });
    }

    this.setState({
      menuOpen: newValue ? true : false,
      value: newValue,
    });

    if (onChange) {
      onChange(newValue);
    }
  };
  handleAddressItemClick = (address: Address) => {
    const { onChange } = this.props,
      newValue = address.name.fi;
    this.setState({
      value: newValue,
    });
    this.closeMenu();
    this.fetchAddressDetails(address);

    if (onChange) {
      onChange(newValue);
    }

    if (this.input) {
      this.input.focus();
    }
  };
  fetchAddressDetails = (address: Address) => {
    const { addressDetailsCallBack } = this.props;
    const coordinates = address.location.coordinates;

    if (coordinates.length >= 2) {
      const url = `${SERVICE_MAP_URL}/administrative_division/?${stringifyQuery(
        {
          lon: coordinates[0],
          lat: coordinates[1],
          type: "postcode_area",
        },
      )}`;
      const request = new Request(url);
      fetch(request)
        .then((response) => response.json())
        .then((results) => {
          const details = results.results;
          const postalCode =
            details.length && details[0].name && details[0].name.fi
              ? details[0].name.fi
              : details.length
                ? details[0].origin_id || ""
                : "";
          const country = details.length
            ? findFromOcdString(details[0].ocd_id, "country") || ""
            : "";

          if (addressDetailsCallBack) {
            addressDetailsCallBack({
              postalCode,
              city: address.municipality.name.fi
                ? capitalize(address.municipality.name.fi)
                : "",
              country,
            });
          }
        })
        .catch((error) => {
          console.error(`Failed to fetch address details with error ${error}`);
        });
    } else {
      console.error(`Failed to fetch address details. Coordinates are missing`);
    }
  };

  render() {
    const { id, name, selected } = this.props;
    const {
      addresses,
      focusedValue,
      isLoading,
      menuOpen,
      selectedAddress,
      value,
    } = this.state;
    return (
      <div
        ref={this.rootRef}
        className={classNames("address-search-input", {
          open: menuOpen,
        })}
      >
        {menuOpen && (
          <LoaderWrapper className="address-input-wrapper">
            <Loader isLoading={isLoading} className="small" />
          </LoaderWrapper>
        )}
        <input
          ref={this.setInputRef}
          autoComplete="off"
          id={id}
          name={name}
          onBlur={this.handleBlur}
          onChange={this.handleOnChange}
          onFocus={this.handleFocus}
          type="text"
          value={selected !== undefined ? selected : value}
        />
        <div
          className={classNames("address-search-input__dropdown", {
            open: menuOpen,
          })}
        >
          <ul ref={this.refMenuListRef}>
            {selectedAddress && !addresses.length && (
              <li className="no-result-item">Ei osoitteita.</li>
            )}
            {selectedAddress &&
              !!addresses.length &&
              addresses.map((address, index) => {
                const handleClick = () => {
                  this.handleAddressItemClick(address);
                };

                const text = `${address.name.fi}, ${address.municipality.name.fi}`;
                return (
                  <li
                    key={index}
                    onClick={handleClick}
                    onKeyDown={(e: React.KeyboardEvent) => {
                      if (e.key === "Enter") handleClick();
                    }}
                    className={classNames("list-item", {
                      "is-focused": focusedValue === address,
                    })}
                  >
                    {text}
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    );
  }
}

export default AddressSearchInput;
