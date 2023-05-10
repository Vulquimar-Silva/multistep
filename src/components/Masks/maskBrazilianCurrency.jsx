export const maskReais = (value) => {
  return (Number(value.replace(/\D/g, "")) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};