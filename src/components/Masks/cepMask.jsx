export const maskCEP = value => {
  if (typeof value === 'string') {
    return value.replace(/\D/g, "").replace(/^(\d{5})(\d{3})+?$/, "$1-$2")
  }
  return value;
}