// List of valid access codes
const VALID_CODES = ["omega", "fluffle"];

// Function to verify if a code is valid
export const isValidCode = (code: string): boolean => {
  return VALID_CODES.includes(code.toLowerCase());
};

// Function to save access in localStorage
export const saveAccess = (): void => {
  try {
    localStorage.setItem('hasAccess', 'true');
  } catch (error) {
    console.error('Error saving access:', error);
  }
};

// Function to verify if the user has access
export const hasAccess = (): boolean => {
  try {
    return localStorage.getItem('hasAccess') === 'true';
  } catch (error) {
    console.error('Error verifying access:', error);
    return false;
  }
};

// Function to get used codes from localStorage
const getUsedCodesFromStorage = (): string[] => {
  try {
    const usedCodes = localStorage.getItem('usedCodes');
    return usedCodes ? JSON.parse(usedCodes) : [];
  } catch (error) {
    console.error('Error reading used codes:', error);
    return [];
  }
};

// Function to save used codes in localStorage
const saveUsedCodesToStorage = (codes: string[]): void => {
  try {
    localStorage.setItem('usedCodes', JSON.stringify(codes));
  } catch (error) {
    console.error('Error saving used codes:', error);
  }
};

// Function to verify if a code has already been used
export const isCodeUsed = (code: string): boolean => {
  const usedCodes = getUsedCodesFromStorage();
  return usedCodes.includes(code);
};

// Function to mark a code as used
export const markCodeAsUsed = (code: string): void => {
  const usedCodes = getUsedCodesFromStorage();
  if (!usedCodes.includes(code)) {
    usedCodes.push(code);
    saveUsedCodesToStorage(usedCodes);
  }
};

// Function to get the list of used codes
export const getUsedCodes = (): string[] => {
  return getUsedCodesFromStorage();
};

// Function to get the list of available codes
export const getAvailableCodes = (): string[] => {
  const usedCodes = getUsedCodesFromStorage();
  return VALID_CODES.filter(code => !usedCodes.includes(code));
};

// Function to verify if a code is available (not used and valid)
export const isCodeAvailable = (code: string): boolean => {
  return isValidCode(code) && !isCodeUsed(code);
}; 