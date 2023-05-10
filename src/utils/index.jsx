import { isCPF } from 'brazilian-values';

export function validateCPF(value) {
  return isCPF(value);
}