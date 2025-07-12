export const validateDni = (dni:string) => {
  const regex = /^[0-9]{8}$/;
  return regex.test(dni);
};

export const validatePartialDni = (dni:string) => {
  return dni === "" || /^[0-9]{1,8}$/.test(dni);
};

export const validateNumDoc = (numDoc:string) => {
  const regex = /^[0-9]{1,6}$/;
  if (!regex.test(numDoc)) {
    return false;
  }
  return numDoc.padStart(6, "0");
};
export const validateNumMesaPartes = (numDoc:string) => {
  const regex = /^[0-9]{1,7}$/;
  if (!regex.test(numDoc)) {
    return false;
  }
  return numDoc.padStart(7, "0");
};

export const validateNumDocAndDni = (numDoc:string) => {
  const regex = /^[0-9]{6,8}$/;
    return regex.test(numDoc);
};