// @flow
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import capitalize from 'lodash/capitalize';
import debounce from 'lodash/debounce';

import {KeyCodes} from '$src/enums';

type Language = 'fi' | 'sv';

type Street = {
  id: number,
  municipality: string,
  name: {
    fi: string,
    sv: string,
  }
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
  id?: string,
  language: Language,
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
      this.setState({
        focusedType: null,
        focusedValue: null,
        menuOpen: false,
        selectedStreet: null,
        streets: [],
      });
    }
  };

  onKeyDown = (e: any) => {
    const {focusedType, focusedValue, hasFocus} = this.state;
    if(hasFocus) {
      switch(e.keyCode) {
        case KeyCodes.ARROW_DOWN:
          e.preventDefault();
          this.focusValue('next');
          break;
        case KeyCodes.ARROW_UP:
          e.preventDefault();
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
          this.setState({
            focusedType: null,
            focusedValue: null,
            menuOpen: false,
          });
          break;
        case KeyCodes.TAB:
          const {filteredAddresses, selectedStreet, value} = this.state;
          if(selectedStreet) {
            const address = filteredAddresses.find((address) => this.getAddressText(address).toLowerCase() === (value ? value.toLowerCase() : ''));
            if(address) {
              this.handleAddressItemClick(address);
            }
          }
          this.setState({
            focusedType: null,
            focusedValue: null,
            menuOpen: false,
          });
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
          if(index > (0)) {
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

  sortStreets = (a: Street, b: Street) => {
    const {language} = this.props;
    const aStreet = a.name[language] ? a.name[language].toLowerCase() : '';
    const bStreet = b.name[language] ? b.name[language].toLowerCase() : '';

    if(aStreet < bStreet) return -1;
    if(aStreet > bStreet) return 1;
    return 0;
  }

  searchStreets = debounce((input: string) => {
    const {language} = this.props;

    const url = `https://api.hel.fi/servicemap/v2/street/?page_size=4&input=${input}&language=${language}`;
    const request = new Request(url);

    fetch(request)
      .then((response) => response.json())
      .then((results) => {
        const streets = results.results.sort(this.sortStreets),
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
        this.setState(newState);
      })
      .catch((error) => {
        console.error(`Failed to fetch streets with error ${error}`);
      });
  }, 300);

  handleOnChange = (e: any) => {
    const {language, onChange} = this.props;
    const {selectedStreet} = this.state;
    const newValue = e.target.value.toString();

    if(!selectedStreet || (selectedStreet && !newValue.startsWith(selectedStreet.name[language]))) {
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

  getStreetText = (street: Street) => {
    const {language} = this.props;
    return `${street.name[language]}`;
  };

  getFullStreetText = (street: Street) => {
    const {language} = this.props;
    return `${street.name[language]}, ${capitalize(street.municipality)}`;
  };

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
    const {language} = this.props;

    const url = `https://api.hel.fi/servicemap/v2/address/?street=${street.id}&language=${language}&page=1&page_size=200`;
    const request = new Request(url);

    fetch(request)
      .then((response) => response.json())
      .then((results) => {
        this.setState({
          addresses: results.results.sort(this.sortAddresses),
          selectedStreet: street,
        });
      })
      .catch((error) => {
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
    const numberText = `${address.number}${address.letter || ''}${address.number_end ? ` - ${address.number_end}` : ''}`;
    return `${this.getStreetText(address.street)} ${numberText}`;
  };

  getFullAddressText = (address: Address) => {
    const numberText = `${address.number}${address.letter || ''}${address.number_end ? ` - ${address.number_end}` : ''}`;
    return `${this.getStreetText(address.street)} ${numberText}, ${capitalize(address.street.municipality)}`;
  };

  handleAddressItemClick = (address: Address) => {
    const {onChange} = this.props,
      newValue = `${this.getAddressText(address)}`;

    this.setState({
      focusedType: null,
      focusedValue: null,
      menuOpen: false,
      value: newValue,
    });
    this.fetchAddressDetails(address);

    if(onChange) {
      onChange(newValue);
    }

    if(this.input) {
      this.input.focus();
    }
  }

  fetchAddressDetails = (address: Address) => {
    const coordinates = address.location.coordinates;
    if(coordinates.length >= 2) {
      const url = `https://api.hel.fi/servicemap/v2/administrative_division/?lon=${coordinates[0]}&lat=${coordinates[1]}&type=postcode_area`;
      const request = new Request(url);

      fetch(request)
        .then((response) => response.json())
        .then((results) => {
          const details = results.results;
          if(details.length) {
            const {addressDetailsCallBack, language} = this.props;
            if(addressDetailsCallBack) {
              addressDetailsCallBack({
                postalCode: details[0].origin_id,
                city: details[0].name[language],
              });
            }
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
    const {id, name, selected} = this.props;
    const {addresses, filteredAddresses, focusedValue, menuOpen, selectedStreet, streets, value} = this.state;

    return(
      <div className={classNames('address-search-input', {'open': menuOpen})}>
        <input
          ref={this.setInputRef}
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
            {(!selectedStreet || !addresses.length) && !!streets.length && streets.map((street) => {
              const handleClick = () => {
                this.handleStreetItemClick(street);
              };

              const text = this.getFullStreetText(street);

              return(
                <li key={street.id} onClick={handleClick} className={classNames('list-item', {'is-focused': focusedValue === street})}>{text}</li>
              );
            })}
            {selectedStreet && !!addresses.length && !filteredAddresses.length &&
              <li className='no-result-item'>Ei osoitteita</li>
            }
            {selectedStreet && !!filteredAddresses.length && filteredAddresses.map((address, index) => {
              const handleClick = () => {
                this.handleAddressItemClick(address);
              };

              const text = this.getFullAddressText(address);

              return(
                <li key={index} onClick={handleClick} className={classNames('list-item', {'is-focused': focusedValue === address})}>{text}</li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default AddressSearchInput;
