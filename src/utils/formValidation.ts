const PHONE_PATTERN = /^\+?[0-9][0-9\s-]{7,17}$/;

export const validateName = (name: string): string | null => {
  const value = name.trim();
  if (!value) return "Name is required.";
  if (value.length < 2) return "Name must be at least 2 characters.";
  if (value.length > 60) return "Name must be under 60 characters.";
  return null;
};

export const validatePhone = (phone: string): string | null => {
  const value = phone.trim();
  if (!value) return "Phone number is required.";
  if (!PHONE_PATTERN.test(value)) return "Please enter a valid phone number.";
  return null;
};

export const validateVehicleInfo = (vehicleInfo: string): string | null => {
  const value = vehicleInfo.trim();
  if (!value) return "Vehicle details are required.";
  if (value.length < 10) return "Vehicle details should be at least 10 characters.";
  return null;
};

export const validatePasswordStrength = (password: string): string | null => {
  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least 1 uppercase letter.";
  }

  if (!/\d/.test(password)) {
    return "Password must contain at least 1 number.";
  }

  if (!/[!@#$%^&*]/.test(password)) {
    return "Password must contain at least 1 special character.";
  }

  return null;
};
