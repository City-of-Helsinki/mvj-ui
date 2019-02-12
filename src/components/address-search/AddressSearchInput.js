// @flow
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import capitalize from 'lodash/capitalize';
import debounce from 'lodash/debounce';

import Loader from '$components/loader/Loader';
import LoaderWrapper from '$components/loader/LoaderWrapper';
import {stringifyQuery} from '$src/api/createUrl';
import {KeyCodes} from '$src/enums';
import {findFromOcdString, hasNumber} from '$util/helpers';

const SERVICE_MAP_URL = 'https://api.hel.fi/servicemap/v2';
type Language = 'fi' | 'sv';

type Street = {
  id: number,
  language: Language,
  municipality: string,
  name: {
    fi: string,
    sv: string,
  },
}

type Address = {
  number: string,
  number_end: ?string,
  letter: ?string,
  location: {
    coordinates: Array<number>
  },
  street: Street,
}

type Props = {
  addressDetailsCallBack?: Function,
  autoComplete: string,
  id?: string,
  name?: string,
  onBlur?: Function,
  onChange?: Function,
  selected?: ?string,
};

type State = {
  addresses: Array<Address>,
  filteredAddresses: Array<Address>,
  focusedType: 'street' | 'address' | null,
  focusedValue: ?Object,
  hasFocus: boolean,
  isLoading: boolean,
  menuOpen: boolean,
  selectedStreet: ?Street,
  streets: Array<Street>,
  value: ?string,
}

class AddressSearchInput extends Component<Props, State> {
  input: any
  menuList: any

  state = {
    addresses: [],
    filteredAddresses: [],
    focusedType: null,
    focusedValue: null,
    hasFocus: false,
    isLoading: false,
    menuOpen: false,
    selectedStreet: null,
    streets: [],
    value: '',
  }

  static defaultProps = {
    language: 'fi',
  }

  setInputRef = (el: any) => {
    this.input = el;
  }

  refMenuListRef = (el: any) => {
    this.menuList = el;
  }

  componentDidMount() {
    document.addEventListener('click', this.onDocumentClick);
    document.addEventListener('keydown', this.onKeyDown);
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if(prevState.addresses !== this.state.addresses ||
      prevState.value !== this.state.value) {
      this.setState({
        filteredAddresses: this.filterAddresses(),
      });
    }

    if(prevState.focusedValue !== this.state.focusedValue) {
      this.scrollToFocusedItem();
    }

    if(this.props.selected !== undefined && this.props.selected !== prevProps.selected) {
      this.setState({value: this.props.selected});
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onDocumentClick);
    document.removeEventListener('keydown', this.onKeyDown);
  }

  scrollToFocusedItem = () => {
    const focusedItems = this.menuList.getElementsByClassName('is-focused');

    if(focusedItems.length) {
      const focusedItem = focusedItems[0],
        top = focusedItem.offsetTop,
        height = focusedItem.offsetHeight,
        menuScrollTop = this.menuList.scrollTop,
        menuHeight = this.menuList.clientHeight;

      if(top < menuScrollTop) {
        this.menuList.scrollTop = top;
      } else if (top + height > menuScrollTop + menuHeight) {
        this.menuList.scrollTop = top + height - menuHeight;
      }
    }
  }

  filterAddresses = (): Array<Address> => {
    const {addresses, value} = this.state;

    return addresses.filter((address) => this.getAddressText(address).toLowerCase().startsWith(value ? value.toLowerCase() : ''));
  }

  onDocumentClick = (event: any) => {
    const {menuOpen} = this.state;
    const target = event.target,
      el = ReactDOM.findDOMNode(this);

    if (menuOpen && el && target !== el && !el.contains(target)) {
      this.closeMenu();
    }
  };

  openMenuIfNeeded = () => {
    const {menuOpen} = this.state;

    if(!menuOpen) {
      this.setState({menuOpen: true});
    }
  }

  closeMenu = () => {
    this.setState({
      focusedType: null,
      focusedValue: null,
      menuOpen: false,
    });
  }

  onKeyDown = (e: any) => {
    const {focusedType, focusedValue, hasFocus} = this.state;

    if(hasFocus) {
      switch(e.keyCode) {
        case KeyCodes.ARROW_DOWN:
          e.preventDefault();
          this.openMenuIfNeeded();
          this.focusValue('next');
          break;
        case KeyCodes.ARROW_UP:
          e.preventDefault();
          this.openMenuIfNeeded();
          this.focusValue('previous');
          break;
        case KeyCodes.ENTER:
          if(focusedValue) {
            switch (focusedType) {
              case 'address':
                this.handleAddressItemClick(focusedValue);
                break;
              case 'street':
                this.handleStreetItemClick(focusedValue);
                break;
            }
          } else {
            const {filteredAddresses, selectedStreet, value} = this.state;

            if(selectedStreet) {
              const address = filteredAddresses.find((address) => this.getAddressText(address).toLowerCase() === (value ? value.toLowerCase() : ''));

              if(address) {
                this.handleAddressItemClick(address);
              }
            }
          }
          break;
        case KeyCodes.ESC:
          this.closeMenu();
          break;
        case KeyCodes.TAB:
          const {filteredAddresses, selectedStreet, value} = this.state;

          if(selectedStreet) {
            const address = filteredAddresses.find((address) => this.getAddressText(address).toLowerCase() === (value ? value.toLowerCase() : ''));

            if(address) {
              this.handleAddressItemClick(address);
            }
          }

          this.closeMenu();
          break;
      }
    }
  }

  handleBlur = () => {
    const {onBlur} = this.props;
    const {value} = this.state;

    this.setState({
      hasFocus: false,
    });

    if(onBlur) {
      onBlur(value);
    }
  }

  handleFocus = () => {
    this.setState({
      hasFocus: true,
    });
  }

  focusValue = (direction: 'next' | 'previous') => {
    const {focusedValue, selectedStreet} = this.state;

    if(!selectedStreet) {
      const {streets} = this.state;
      const index = streets.findIndex((street) => focusedValue === street);

      switch(direction) {
        case 'next':
          if(index < (streets.length - 1)) {
            this.setState({
              focusedType: 'street',
              focusedValue: streets[index + 1],
              menuOpen: true,
            });
          }
          break;
        case 'previous':
          if(index > (0)) {
            this.setState({
              focusedType: 'street',
              focusedValue: streets[index - 1],
              menuOpen: true,
            });
          }
          break;
      }
    } else {
      const {filteredAddresses} = this.state;
      const index = filteredAddresses.findIndex((address) => focusedValue === address);

      switch(direction) {
        case 'next':
          if(index < (filteredAddresses.length - 1)) {
            this.setState({
              focusedType: 'address',
              focusedValue: filteredAddresses[index + 1],
              menuOpen: true,
            });
          }
          break;
        case 'previous':
          if(index) {
            this.setState({
              focusedType: 'address',
              focusedValue: filteredAddresses[index - 1],
              menuOpen: true,
            });
          }
          break;
      }
    }
  }

  searchByKeyword = (input: string) => {
    const fetchByKeyword = (language: 'fi' | 'sv') => {
      const url = `${SERVICE_MAP_URL}/search/?${stringifyQuery({
        page_size: 4,
        type: 'address',
        input: input,
        language: language,
      })}`;
      const request = new Request(url);

      return fetch(request);
    };

    const fetchResults = async() => {
      const fiResponse = await fetchByKeyword('fi');
      const svResponse = await fetchByKeyword('sv');

      const fiResults = await fiResponse.json();
      const svResults = await svResponse.json();

      return [
        ...fiResults.results.map((street) => ({...street, language: 'fi'})),
        ...svResults.results.map((street) => ({...street, language: 'sv'})),
      ];
    };

    this.setState({isLoading: true});

    fetchResults()
      .then((results) => {
        if(results.length) {
          const street = {
            ...results[0].street,
            language: results[0].language,
          };

          this.searchAddresses(street);
        } else {
          this.setState({isLoading: false});
        }
      })
      .catch((error) => {
        this.setState({isLoading: false});
        console.error(`Failed to fetch by keyword with error ${error}`);
      });
  }

  sortStreets = (a: Street, b: Street) => {
    const aStreet = a.name[a.language] ? a.name[a.language].toLowerCase() : '';
    const bStreet = b.name[b.language] ? b.name[b.language].toLowerCase() : '';

    if(aStreet < bStreet) return -1;
    if(aStreet > bStreet) return 1;
    return 0;
  }

  searchStreets = debounce((input: string) => {
    const fetchStreets = (language: 'fi' | 'sv') => {
      const url = `${SERVICE_MAP_URL}/street/?${stringifyQuery({
        page_size: 4,
        input: input,
        language: language,
      })}`;
      const request = new Request(url);

      return fetch(request);
    };

    const fetchAllStreets = async() => {
      const fiResponse = await fetchStreets('fi');
      const svResponse = await fetchStreets('sv');

      const fiResults = await fiResponse.json();
      const svResults = await svResponse.json();

      return [
        ...fiResults.results.map((street) => ({...street, language: 'fi'})),
        ...svResults.results.map((street) => ({...street, language: 'sv'})),
      ];
    };

    this.setState({isLoading: true});

    fetchAllStreets()
      .then((results) => {
        const streets = results.sort(this.sortStreets),
          newState: any = {streets: streets};

        if(streets.length === 1) {
          const {selectedStreet} = this.state;

          if(!selectedStreet || (streets[0].id !== selectedStreet.id)) {
            newState.selectedStreet = streets[0];
            this.searchAddresses(streets[0]);
          }
        } else {
          newState.selectedStreet = null;
          newState.addresses = [];
        }

        newState.isLoading = false;
        this.setState(newState);
      })
      .catch((error) => {
        this.setState({isLoading: false});
        console.error(`Failed to fetch streets with error ${error}`);
      });
  }, 300);

  handleOnChange = (e: any) => {
    const {onChange} = this.props;
    const {selectedStreet} = this.state;
    const newValue = e.target.value.toString();

    if(!selectedStreet && hasNumber(newValue)) {
      this.searchByKeyword(newValue);
    } else if(!selectedStreet || (selectedStreet && !newValue.startsWith(selectedStreet.name[selectedStreet.language]))) {
      this.searchStreets(newValue);
    }

    this.setState({
      menuOpen: newValue ? true : false,
      value: newValue,
    });

    if(onChange) {
      onChange(newValue);
    }
  }

  getStreetText = (street: Street) => `${street.name[street.language]}`;

  getFullStreetText = (street: Street) => `${street.name[street.language]}, ${capitalize(street.municipality)}`;

  sortAddresses = (a: Address, b: Address) => {
    if(a.number === b.number) {
      const aLetter = a.letter ? a.letter : '';
      const bLetter = b.letter ? b.letter : '';

      if(aLetter < bLetter) return -1;
      if(aLetter > bLetter) return 1;
      return 0;
    }

    return Number(a.number) - Number(b.number);
  }

  searchAddresses = (street: Street) => {
    const url = `${SERVICE_MAP_URL}/address/?${stringifyQuery({
      page: 1,
      page_size: 200,
      street: street.id,
      language: street.language,
    })}`;
    const request = new Request(url);

    this.setState({isLoading: true});

    fetch(request)
      .then((response) => response.json())
      .then((results) => {
        this.setState({
          addresses: results.results.sort(this.sortAddresses),
          selectedStreet: street,
        });

        this.setState({isLoading: false});
      })
      .catch((error) => {
        this.setState({isLoading: false});
        console.error(`Failed to fetch addresses with error ${error}`);
      });
  };

  handleStreetItemClick = (street: Street) => {
    const {onChange} = this.props,
      newValue = `${this.getStreetText(street)} `;

    this.searchAddresses(street);

    this.setState({
      focusedType: null,
      focusedValue: null,
      value: newValue,
    });

    if(onChange) {
      onChange(newValue);
    }

    if(this.input) {
      this.input.focus();
    }
  }

  getAddressText = (address: Address) => {
    const {selectedStreet} = this.state;
    const numberText = `${address.number}${address.letter || ''}${address.number_end ? ` - ${address.number_end}` : ''}`;

    return selectedStreet ? `${this.getStreetText(selectedStreet)} ${numberText}` : '';
  };

  getFullAddressText = (address: Address) => {
    const {selectedStreet} = this.state;
    const numberText = `${address.number}${address.letter || ''}${address.number_end ? ` - ${address.number_end}` : ''}`;

    return selectedStreet
      ? `${this.getStreetText(selectedStreet)} ${numberText}, ${capitalize(address.street.municipality)}`
      : '';
  };

  handleAddressItemClick = (address: Address) => {
    const {onChange} = this.props,
      newValue = `${this.getAddressText(address)}`;

    this.setState({value: newValue});
    this.closeMenu();
    this.fetchAddressDetails(address);


    if(onChange) {
      onChange(newValue);
    }

    if(this.input) {
      this.input.focus();
    }
  }

  fetchAddressDetails = (address: Address) => {
    const {addressDetailsCallBack} = this.props;
    const coordinates = address.location.coordinates;

    if(coordinates.length >= 2) {
      const url = `${SERVICE_MAP_URL}/administrative_division/?${stringifyQuery({
        lon: coordinates[0],
        lat: coordinates[1],
        type: 'postcode_area',
      })}`;
      const request = new Request(url);

      fetch(request)
        .then((response) => response.json())
        .then((results) => {
          const details = results.results;
          const postalCode = details.length
            ? details[0].origin_id || ''
            : '';
          const country = details.length
            ? findFromOcdString(details[0].ocd_id, 'country') || ''
            : '';

          if(addressDetailsCallBack) {
            addressDetailsCallBack({
              postalCode,
              city: address.street.municipality ? capitalize(address.street.municipality) : '',
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
    const {autoComplete, id, name, selected} = this.props;
    const {addresses, filteredAddresses, focusedValue, isLoading, menuOpen, selectedStreet, streets, value} = this.state;

    return(
      <div className={classNames('address-search-input', {'open': menuOpen})}>
        {menuOpen &&
          <LoaderWrapper className='address-input-wrapper'><Loader isLoading={isLoading} className='small' /></LoaderWrapper>
        }
        <input
          ref={this.setInputRef}
          autoComplete={autoComplete}
          id={id}
          name={name}
          onBlur={this.handleBlur}
          onChange={this.handleOnChange}
          onFocus={this.handleFocus}
          type='text'
          value={selected !== undefined ? selected : value}
        />
        <div className={classNames('address-search-input__dropdown', {'open': menuOpen})}>
          <ul ref={this.refMenuListRef}>
            {!selectedStreet && !streets.length &&
              <li className='no-result-item'>Ei katuja</li>
            }
            {(!selectedStreet || !addresses.length) && !!streets.length && streets.map((street, index) => {
              const handleClick = () => {
                this.handleStreetItemClick(street);
              };

              const text = this.getFullStreetText(street);

              return <li
                key={index}
                onClick={handleClick}
                className={classNames('list-item', {'is-focused': focusedValue === street})}
              >{text}</li>;
            })}
            {selectedStreet && !!addresses.length && !filteredAddresses.length &&
              <li className='no-result-item'>Ei osoitteita</li>
            }
            {selectedStreet && !!filteredAddresses.length && filteredAddresses.map((address, index) => {
              const handleClick = () => {
                this.handleAddressItemClick(address);
              };

              const text = this.getFullAddressText(address);

              return <li key={index} onClick={handleClick} className={classNames('list-item', {'is-focused': focusedValue === address})}>
                {text}
              </li>;
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default AddressSearchInput;
