/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from 'axios'
import _ from "lodash";
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Checkbox from '@mui/material/Checkbox';
import { useFormContext } from "react-hook-form";
import { maskCEP } from '../Masks/cepMask'

const formNewAddress = {
  newCep: "",
  newStreet: "",
  newNumber: "",
  newComplement: "",
  newCity: "",
  newState: "",
}

export default function AddressForm({ dataContainer }) {

  const { register } = useFormContext();
  const [newAddress, setNewAddress] = useState(() => {
    try {
      const item = localStorage.getItem('enderecoNovoCnpj');
      return item ? JSON.parse(item) : formNewAddress;
    } catch (error) {
      console.log(error);
      return formNewAddress;
    }
  });

  const [yesChecked, setYesChecked] = useState(
    localStorage.getItem('yesChecked') === 'true'
  );
  const [noChecked, setNoChecked] = useState(
    localStorage.getItem('noChecked') === 'true'
  );

  function handleInputChange(e) {
    const { name, value } = e.target;
    if (name === 'newCep' && value.length === 9) {
      fetchCepData(value.replace('-', ''));
    }
    setNewAddress({ ...newAddress, [name]: value });
  }

  const fetchCepData = _.debounce(async (cep) => {
    const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    setNewAddress({ ...newAddress, newStreet: data.logradouro, newCity: data.localidade, newState: data.uf });
  }, 900)

  useEffect(() => {
    if (newAddress.newCep.length === 8) {
      fetchCepData(newAddress.newCep.replace('-', ''));
    }
  }, [newAddress.newCep]);

  const isEmpty = (obj) => {
    return Object.values(obj).every(value => value === null || value === undefined || value === '');
  }

  useEffect(() => {
    if (!isEmpty(newAddress)) {
      try {
        const serializedState = JSON.stringify(newAddress);
        localStorage.setItem('enderecoNovoCnpj', serializedState);
      } catch (error) {
        console.error('Erro ao armazenar o endereço no localStorage:', error);
      }
    }
  }, [newAddress]);

  useEffect(() => {
    localStorage.setItem('yesChecked', yesChecked);
    localStorage.setItem('noChecked', noChecked);
  }, [yesChecked, noChecked]);

  function handleYesChange(e) {
    setYesChecked(e.target.checked);
    setNoChecked(!e.target.checked);

    if (e.target.checked) {
      const enderecoCnpj = {
        cep: dataContainer.cep,
        logradouro: dataContainer.logradouro,
        numero: dataContainer.numero,
        complemento: dataContainer.complemento,
        cidade: dataContainer.municipio,
        uf: dataContainer.uf
      };
      localStorage.removeItem('enderecoNovoCnpj');
      localStorage.setItem('enderecoCnpj', JSON.stringify(enderecoCnpj));
    }
  }

  function handleNoChange(e) {
    setNoChecked(e.target.checked);
    setYesChecked(!e.target.checked);

    if (e.target.checked) {
      localStorage.removeItem('enderecoCnpj');
      const enderecoNovoCnpj = {
        newCep: newAddress.newCep,
        newStreet: newAddress.newStreet,
        newNumber: newAddress.newNumber,
        newComplement: newAddress.newComplement,
        newCity: newAddress.newCity,
        newState: newAddress.newState
      };
      localStorage.setItem('enderecoNovoCnpj', JSON.stringify(enderecoNovoCnpj));
    }
  }

  return (
    <>
      <h2 className='register-form-title'>
        ENDEREÇO FISCAL
      </h2>
      <Grid container spacing={3}>

        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="cep"
            name="cep"
            label="CEP"
            fullWidth
            variant="standard"
            {...register("cep")}
            value={dataContainer.cep}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="logradouro"
            name="logradouro"
            label="Logradouro"
            fullWidth
            variant="standard"
            {...register("logradouro")}
            value={dataContainer.logradouro}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="numero"
            name="numero"
            label="Nº"
            fullWidth
            variant="standard"
            {...register("numero")}
            value={dataContainer.numero}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            id="complemento"
            name="complemento"
            label="Complemento"
            fullWidth
            variant="standard"
            {...register("complemento")}
            value={dataContainer.complemento}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="municipio"
            name="cidade"
            label="Cidade"
            fullWidth
            variant="standard"
            {...register("municipio")}
            value={dataContainer.municipio}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            id="uf"
            name="uf"
            label="UF"
            fullWidth
            variant="standard"
            {...register("uf")}
            value={dataContainer.uf}
          />
        </Grid>

        <Grid item xs={12}>
          <FormLabel component="legend">Este é seu endereço de correspondência?</FormLabel>
          <FormControlLabel
            control={
              <Checkbox
                name="yes"
                value="yes"
                checked={yesChecked}
                onChange={handleYesChange}
              />
            }
            label="Sim"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="no"
                value="no"
                checked={noChecked}
                onChange={handleNoChange}
              />
            }
            label="Não"
          />
        </Grid>

        {noChecked && (
          <>
            <Grid item xs={12}>
              <h2 className='register-form-title'>
                Certo, qual é o seu endereço de correspondência?
              </h2>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="newCep"
                name="newCep"
                label="CEP"
                fullWidth
                variant="standard"
                {...register('newCep', { required: true })}
                value={maskCEP(newAddress.newCep)}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="newStreet"
                name="newStreet"
                label="Logradouro"
                fullWidth
                variant="standard"
                {...register("newStreet", { required: true })}
                value={newAddress.newStreet}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="newNumber"
                name="newNumber"
                label="Número"
                fullWidth
                variant="standard"
                {...register("newNumber", { required: true })}
                value={newAddress.newNumber}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                id="newComplement"
                name="newComplement"
                label="Complemento"
                fullWidth
                variant="standard"
                {...register("newComplement", { required: true })}
                value={newAddress.newComplement}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="newCity"
                name="newCity"
                label="Cidade"
                fullWidth
                variant="standard"
                {...register("newCity", { required: true })}
                value={newAddress.newCity}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                id="newState"
                name="newState"
                label="Estado"
                fullWidth
                variant="standard"
                {...register("newState", { required: true })}
                value={newAddress.newState}
                onChange={handleInputChange}
              />
            </Grid>
          </>
        )}

      </Grid>
    </>
  );
}
