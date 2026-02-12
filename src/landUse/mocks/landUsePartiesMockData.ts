import { LandUsePartiesFormValues } from "../components/tabs/LandUseParties";

const negotiatorsOptions = [
  { label: "NN", value: "NN" },
  { label: "Liisa Virtanen", value: "Liisa Virtanen" },
  { label: "Matti Meikäläinen", value: "Matti Meikäläinen" },
];

const signatoriesOptions = [
  { label: "Ylipäällikkö", value: "Ylipäällikkö" },
  { label: "Välipäällikkö", value: "Välipäällikkö" },
  { label: "Alipäällikkö", value: "Alipäällikkö" },
];

const createBaseFormValues = (): LandUsePartiesFormValues => ({
  customer: {
    reference: "",
    details: {
      customerType: "",
      name: "",
      businessId: "",
      language: "",
      partnerCode: "",
      ovtCode: "",
      streetAddress: "",
      city: "",
      postalCode: "",
      country: "",
      careOf: "",
      phone: "",
      email: "",
      landlord: "",
      note: "",
    },
  },
  contactPerson: {
    name: "",
    phone: "",
    email: "",
  },
  invoiceRecipient: {
    details: {
      customerType: "",
      name: "",
      businessId: "",
      language: "",
      partnerCode: "",
      ovtCode: "",
      customerNumber: "",
      sapCustomerNumber: "",
      streetAddress: "",
      city: "",
      postalCode: "",
      country: "",
      careOf: "",
      phone: "",
      email: "",
      landlord: "",
      note: "",
    },
  },
  negotiatorsOptions,
  signatoriesOptions,
  negotiators: [{ name: "" }],
  signatories: [{ name: "" }],
});

const ma101 = createBaseFormValues();
ma101.customer = {
  ...ma101.customer,
  reference: "MA101-REF",
};
ma101.customer.details = {
  ...ma101.customer.details,
  customerType: "yritys",
  name: "Senaatti kiinteistöt",
  businessId: "12345",
  language: "suomi",
  country: "suomi",
  landlord: "ei",
  note: "Placeholder",
};
ma101.contactPerson = {
  name: "NN",
  phone: "040 123 4567",
  email: "yhteys@example.com",
};
ma101.invoiceRecipient = {
  ...ma101.invoiceRecipient,
  details: {
    ...ma101.invoiceRecipient.details,
    customerType: "yritys",
    name: "Senaatti kiinteistöt",
    businessId: "12345",
    language: "suomi",
    partnerCode: "12345",
    ovtCode: "003712345678",
    customerNumber: "C-0001",
    sapCustomerNumber: "SAP-001",
    streetAddress: "Esimerkkikatu 1",
    city: "Helsinki",
    postalCode: "00100",
    country: "suomi",
    landlord: "ei",
  },
};

ma101.negotiators = [{ name: negotiatorsOptions[2].value }];
ma101.signatories = [{ name: signatoriesOptions[2].value }];

const ma113 = createBaseFormValues();
ma113.customer = {
  ...ma113.customer,
  reference: "MA113-REF",
};
ma113.customer.details = {
  ...ma113.customer.details,
  customerType: "yritys",
  name: "Helsingin kaupunki",
  businessId: "3100001-5",
  language: "suomi",
  country: "suomi",
  landlord: "kylla",
};
ma113.contactPerson = {
  name: "Liisa Virtanen",
  phone: "050 555 0000",
  email: "liisa.virtanen@example.com",
};
ma113.invoiceRecipient = {
  ...ma113.invoiceRecipient,
  details: {
    ...ma113.invoiceRecipient.details,
    customerType: "yritys",
    name: "Helsingin kaupunki",
    businessId: "3100001-5",
    language: "suomi",
    partnerCode: "77777",
    ovtCode: "003703100001",
    customerNumber: "C-0456",
    sapCustomerNumber: "SAP-0456",
    streetAddress: "Kaupungintalo 1",
    city: "Helsinki",
    postalCode: "00100",
    country: "suomi",
    landlord: "kylla",
  },
};
ma113.negotiators = [{ name: negotiatorsOptions[1].value }];
ma113.signatories = [{ name: signatoriesOptions[0].value }];

const ma112 = createBaseFormValues();
ma112.customer = {
  ...ma112.customer,
  reference: "MA112-REF",
};
ma112.customer.details = {
  ...ma112.customer.details,
  customerType: "yritys",
  name: "ABC Oy",
  businessId: "9876543-1",
  language: "englanti",
  country: "suomi",
  landlord: "ei",
};
ma112.contactPerson = {
  name: "Matti Meikäläinen",
  phone: "041 200 3000",
  email: "matti.meikalainen@example.com",
};
ma112.invoiceRecipient = {
  ...ma112.invoiceRecipient,
  details: {
    ...ma112.invoiceRecipient.details,
    customerType: "yritys",
    name: "ABC Oy",
    businessId: "9876543-1",
    language: "englanti",
    customerNumber: "C-0987",
    sapCustomerNumber: "SAP-0987",
    streetAddress: "Betonikatu 3",
    city: "Espoo",
    postalCode: "02150",
    country: "suomi",
    landlord: "ei",
  },
};
ma112.negotiators = [{ name: negotiatorsOptions[0].value }];
ma112.signatories = [{ name: signatoriesOptions[1].value }];

export const mockLandUsePartiesStore: Record<string, LandUsePartiesFormValues> =
  {
    "MA101-1": ma101,
    "MA113-1": ma113,
    "MA112-1": ma112,
  };
