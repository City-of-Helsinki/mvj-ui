import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Attributes, Methods } from "@/types";
import type {
  Contact,
  ContactId,
  ContactList,
  ContactModalSettings,
  ContactState,
  ContactsFetchParams,
} from "@/contacts/types";

export const initialState: ContactState = {
  attributes: null,
  contactModalSettings: null,
  currentContact: {} as Contact,
  initialContactFormValues: {},
  isContactFormValid: false,
  isContactModalOpen: false,
  isEditMode: false,
  isFetching: false,
  isFetchingAttributes: false,
  isSaveClicked: false,
  isSaving: false,
  list: {},
  methods: null,
};

const contactsSlice = createSlice({
  name: "mvj/contacts",
  initialState,
  reducers: {
    notFound: (state) => {
      state.isFetching = false;
    },
    fetchAttributes: (state) => {
      state.isFetchingAttributes = true;
    },
    receiveAttributes: (state, { payload }: PayloadAction<Attributes>) => {
      state.attributes = payload;
      state.isFetchingAttributes = false;
    },
    receiveMethods: (state, { payload }: PayloadAction<Methods>) => {
      state.methods = payload;
      state.isFetchingAttributes = false;
    },
    attributesNotFound: (state) => {
      state.isFetchingAttributes = false;
    },
    createContact: (state, _action: PayloadAction<Contact>) => {
      state.isFetching = true;
    },
    editContact: (state, _action: PayloadAction<Contact>) => {
      state.isSaving = true;
    },
    createContactOnModal: (state, _action: PayloadAction<Contact>) => {
      state.isFetching = true;
    },
    editContactOnModal: (state, _action: PayloadAction<Contact>) => {
      state.isFetching = true;
    },
    fetchContacts: (state, _action: PayloadAction<ContactsFetchParams>) => {
      state.isFetching = true;
    },
    receiveContacts: (state, { payload }: PayloadAction<ContactList>) => {
      state.list = payload;
      state.isFetching = false;
    },
    fetchSingleContact: (state, _action: PayloadAction<ContactId>) => {
      state.isFetching = true;
    },
    receiveSingleContact: (state, { payload }: PayloadAction<Contact>) => {
      state.currentContact = payload;
      state.isFetching = false;
      state.isSaving = false;
    },
    initializeContactForm: (
      state,
      { payload }: PayloadAction<Partial<Contact>>,
    ) => {
      state.initialContactFormValues = payload;
    },
    receiveIsSaveClicked: (state, { payload }: PayloadAction<boolean>) => {
      state.isSaveClicked = payload;
    },
    receiveContactFormValid: (state, { payload }: PayloadAction<boolean>) => {
      state.isContactFormValid = payload;
    },
    hideEditMode: (state) => {
      state.isEditMode = false;
    },
    showEditMode: (state) => {
      state.isEditMode = true;
    },
    hideContactModal: (state) => {
      state.isContactModalOpen = false;
    },
    showContactModal: (state) => {
      state.isContactModalOpen = true;
    },
    receiveContactModalSettings: (
      state,
      { payload }: PayloadAction<ContactModalSettings>,
    ) => {
      state.contactModalSettings = payload;
    },
  },
});

export const {
  notFound,
  fetchAttributes,
  receiveAttributes,
  receiveMethods,
  attributesNotFound,
  createContact,
  editContact,
  createContactOnModal,
  editContactOnModal,
  fetchContacts,
  receiveContacts,
  fetchSingleContact,
  receiveSingleContact,
  initializeContactForm,
  receiveIsSaveClicked,
  receiveContactFormValid,
  hideEditMode,
  showEditMode,
  hideContactModal,
  showContactModal,
  receiveContactModalSettings,
} = contactsSlice.actions;

export default contactsSlice.reducer;
