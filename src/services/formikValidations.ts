import * as Yup from "yup";

const amountRegex = /^(0|[1-9][0-9]*)(\.[0-9]{1,2})?$/;
const nameRegex = /^[a-zA-Z ,\-]+$/;
const ageRegex = /^(0|[1-9][0-9]?|1[01][0-9]|120)$/;

export const clearanceValidation = Yup.object({
  name: Yup.string()
    .matches(nameRegex, "Only letters, commas, spaces, and dashes are allowed")
    .required("Required"),
  age: Yup.string().matches(ageRegex, "Only ages 0-120").required("Required"),
  sex: Yup.string()
    .required("Required")
    .oneOf(["Male", "Female"], "Sex must be either Male or Female"),
  amount: Yup.string()
    .matches(amountRegex, "Amount must be at most 2 decimal places only")
    .required("Amount is required"),
});
