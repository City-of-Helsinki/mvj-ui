import { LandUsePartiesFormValues } from "../components/tabs/LandUseParties";

const createBaseFormValues = (): LandUsePartiesFormValues => ({
  customer: {
    name: "",
    startDate: "",
    endDate: "",
    reference: "",
    details: {
      customerType: "",
      companyName: "",
      businessId: "",
      language: "",
      partnerCode: "",
      ovtCode: "",
      customerNumber: "",
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
    name: "",
    startDate: "",
    endDate: "",
    details: {
      customerType: "",
      companyName: "",
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
  negotiators: [{ name: "" }],
  signatories: [{ name: "" }],
});

const ma101 = createBaseFormValues();
ma101.customer = {
  ...ma101.customer,
  name: "senaatti-kiinteistot",
  startDate: "01.01.2024",
  reference: "MA101-REF",
};
ma101.customer.details = {
  ...ma101.customer.details,
  customerType: "yritys",
  companyName: "Senaatti kiinteistöt",
  businessId: "12345",
  language: "suomi",
  country: "suomi",
  landlord: "ei",
  note: "Placeholder",
};
ma101.contactPerson = {
  name: "nn",
  phone: "040 123 4567",
  email: "yhteys@example.com",
};
ma101.invoiceRecipient = {
  ...ma101.invoiceRecipient,
  name: "senaatti-kiinteistot",
  startDate: "01.01.2024",
  details: {
    ...ma101.invoiceRecipient.details,
    customerType: "yritys",
    companyName: "Senaatti kiinteistöt",
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
ma101.negotiators = [{ name: "nn" }];
ma101.signatories = [{ name: "nn" }];

const ma113 = createBaseFormValues();
ma113.customer = {
  ...ma113.customer,
  name: "helsingin-kaupunki",
  startDate: "15.03.2024",
  reference: "MA113-REF",
};
ma113.customer.details = {
  ...ma113.customer.details,
  customerType: "yritys",
  companyName: "Helsingin kaupunki",
  businessId: "3100001-5",
  language: "suomi",
  country: "suomi",
  landlord: "kylla",
};
ma113.contactPerson = {
  name: "liisa-virtanen",
  phone: "050 555 0000",
  email: "liisa.virtanen@example.com",
};
ma113.invoiceRecipient = {
  ...ma113.invoiceRecipient,
  name: "helsingin-kaupunki",
  startDate: "15.03.2024",
  details: {
    ...ma113.invoiceRecipient.details,
    customerType: "yritys",
    companyName: "Helsingin kaupunki",
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
ma113.negotiators = [{ name: "liisa-virtanen" }];
ma113.signatories = [{ name: "liisa-virtanen" }];

const ma112 = createBaseFormValues();
ma112.customer = {
  ...ma112.customer,
  name: "abc-oy",
  startDate: "01.02.2024",
  reference: "MA112-REF",
};
ma112.customer.details = {
  ...ma112.customer.details,
  customerType: "yritys",
  companyName: "ABC Oy",
  businessId: "9876543-1",
  language: "englanti",
  country: "suomi",
  landlord: "ei",
};
ma112.contactPerson = {
  name: "matti-meikalainen",
  phone: "041 200 3000",
  email: "matti.meikalainen@example.com",
};
ma112.invoiceRecipient = {
  ...ma112.invoiceRecipient,
  name: "abc-oy",
  startDate: "01.02.2024",
  details: {
    ...ma112.invoiceRecipient.details,
    customerType: "yritys",
    companyName: "ABC Oy",
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
ma112.negotiators = [{ name: "matti-meikalainen" }];
ma112.signatories = [{ name: "matti-meikalainen" }];

export const mockLandUsePartiesStore: Record<string, LandUsePartiesFormValues> =
  {
    "MA101-1": ma101,
    "MA113-1": ma113,
    "MA112-1": ma112,
  };
