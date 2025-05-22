export const validateField = (value, regex, errorMessage) => {
  return !regex.test(value) ? errorMessage : null;
};

export const validateForm = (formData, formType) => {
  const errors = {};

  const nameRegex = /^.{20,60}$/;
  const emailRegex = /^\S+@\S+\.\S+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16}$).*$/;
  const addressRegex = /^.{0,400}$/;

  errors.name = validateField(formData.name, nameRegex, 'Name must be between 20 and 60 characters.');
  errors.email = validateField(formData.email, emailRegex, 'Invalid email format.');
  errors.address = validateField(formData.address, addressRegex, 'Address cannot exceed 400 characters.');

  if (formType === 'user') {
    errors.password = validateField(formData.password, passwordRegex, 'Password must be 8-16 characters, include at least one uppercase letter and one special character.');
  } else if (formType === 'store') {
    if (!formData.owner_id) {
      errors.owner_id = 'Please select an owner.';
    }
  }

  Object.keys(errors).forEach(key => errors[key] === null && delete errors[key]);

  return errors;
};
