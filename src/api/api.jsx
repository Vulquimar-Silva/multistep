/* eslint-disable no-unused-vars */
import axios from 'axios';

export async function getCnpj(data) {
  return await axios.get(`https://brasilapi.com.br/api/cnpj/v1/${data}`)
    .catch(error => {
      console.error(error);
    });
}

// export async function getCep(data) {
//   return await axios.get(`https://viacep.com.br/ws/${data}/json/`)
//     .catch(error => {
//       console.error(error);
//     });
// }