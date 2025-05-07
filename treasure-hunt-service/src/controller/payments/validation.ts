import * as yup from 'yup';

const mobileRegex = /^(?:[6-9]\d{9}|07\d{9})$/;
const fullNameRegex = /^[A-Za-z\s'-]{2,50}$/;
export const createBookingSchema = yup.object().shape({
  mobileNumber: yup
    .string()
    .matches(mobileRegex, 'Enter a valid mobile number (India or UK, no country code)')
    .required('Mobile number is required'),

  registrationDate: yup
    .date()
    .required('Registration date is required'),

  teamMemberCount: yup
    .number()
    .required('Team member count is required')
    .min(1, 'Team member count cannot be negative or zero'),
  amount: yup.number().required('Amount is required').min(1, 'Amount cannot be negative or zero'),
  fullName: yup.string().matches(fullNameRegex, 'Enter a valid name').required('Full name is required')
});

