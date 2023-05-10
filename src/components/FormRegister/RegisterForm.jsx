/* eslint-disable no-constant-condition */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import { validate } from 'cnpj';
import { useFormContext, Controller } from "react-hook-form";
import _ from "lodash";

import ButtonContext from '../../context/ButtonContext';
import { getCnpj } from '../../api/api';
import { cnpjMask } from '../Masks/cnpjMask'
import { maskPhone } from '../Masks/maskPhone'
import { maskCPF } from '../Masks/cpfMask'


export default function RegisterForm({ dataContainer, setDataContainer }) {

  const { register, control, formState: { errors } } = useFormContext();
  const { setButtonStatus } = useContext(ButtonContext);
  const [showInputs, setShowInputs] = useState(false);
  const [isCheckd, setIsCheckd] = useState(true);

  const handleChange = (e) => {
    if (e) e.preventDefault()
    const cnpjFormat = e.target.value.replace(/[^\d]+/g, "");
    handleCnpj(cnpjFormat);
    setDataContainer({ ...dataContainer, [e.target.name]: e.target.value });
    setIsCheckd(!isCheckd)
  }

  const handleCnpj = _.debounce(async (cnpjFormat) => {
    if (cnpjFormat.length >= 14 || cnpjFormat.length <= 14) {
      if (validate(cnpjFormat) === true) {
        const cnpj = await getCnpj(cnpjFormat);
        const autoData = {
          ...cnpj.data,
          razaoSocial: cnpj.data.razao_social,
          nomeFantasia: cnpj.data.nome_fantasia,
          cnae: cnpj.data.cnae_fiscal,
          cnaeDescricao: cnpj.data.cnae_fiscal_descricao,
          cep: cnpj.data.cep,
          logradouro: cnpj.data.logradouro
        }
        setDataContainer({ ...dataContainer, ...autoData })
      }
    } else {
      setShowInputs(false);
      setButtonStatus(true);
    }
  }, 900)

  useEffect(() => {
    if (dataContainer.descricao_situacao_cadastral === 'ATIVA') {
      setShowInputs(true);
      setButtonStatus(false);
    } else if (validate(dataContainer.cnpj) === false) {
      console.log("CNPJ Inválido")
      setShowInputs(false);
      setButtonStatus(true);
    } else {
      console.log("CNPJ Inativo")
      setShowInputs(false);
      setButtonStatus(true);
    }
  }, [dataContainer.descricao_situacao_cadastral]);

  return (
    <>
      <h2 className='register-form-title'>
        Olá! Que ótimo tê-lo aqui! <br />
        Para dar continuidade a sua simulação peço que nos informe o seu CNPJ.
      </h2>
      <br />
      <Grid container spacing={3} style={{ marginBottom: '20px' }}>
        <Grid item xs={12} sm={4}>
          <TextField
            required
            {...register("cnpj", { required: true })}
            onChange={handleChange}
            value={cnpjMask(dataContainer.cnpj || '')}
            id="cnpj"
            name="cnpj"
            label="CNPJ"
            placeholder='Digite seu CNPJ'
            autoComplete='off'
            fullWidth
            variant="standard"
          />
          {dataContainer.descricao_situacao_cadastral === 'BAIXADA' && dataContainer.cnpj.length > 13 ? (
            <Stack sx={{ width: '100%' }} spacing={2}>
              <Alert severity="error"><strong>CNPJ INATIVO</strong></Alert>
            </Stack>
          ) : dataContainer.cnpj.length >= 16 && validate(dataContainer.cnpj) === false ? (
            <Stack sx={{ width: '100%' }} spacing={2}>
              <Alert severity="error"><strong>CNPJ INVÁLIDO</strong></Alert>
            </Stack>
          ) : ''
          }
        </Grid>
      </Grid>

      {showInputs && (
        <>
          <Grid container spacing={3}>

            <Grid item xs={12} sm={6}>
              <TextField
                id="razaoSocial"
                name="razaoSocial"
                label="Razão Social"
                placeholder='Digite sua Razão Social'
                autoComplete='off'
                variant="standard"
                fullWidth
                {...register("razaoSocial", { required: true })}
                value={dataContainer.razaoSocial || ''}
                onChange={handleChange}
              />
              {errors.razaoSocial && <span style={{ color: "red", top: "20px" }}>{errors.razaoSocial.message}</span>}
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                id="nomeFantasia"
                name='nomeFantasia'
                label='Nome Fantasia'
                placeholder='Digite o Nome Fantasia'
                autoComplete='off'
                variant="standard"
                fullWidth
                {...register("nomeFantasia", { required: true })}
                value={dataContainer.nomeFantasia || ''}
              />
              {errors.nomeFantasia && <span style={{ color: "red", top: "20px" }}>{errors.nomeFantasia.message}</span>}
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                id="cnae"
                name="cnae"
                label='CNAE Principal'
                placeholder="Digite o CNAE"
                autoComplete='off'
                variant="standard"
                fullWidth
                {...register("cnae", { required: true })}
                value={dataContainer.cnae || ''}
              />
              {errors.cnae && <span style={{ color: "red", top: "20px" }}>{errors.cnae.message}</span>}
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                id="cnaeDescricao"
                name='cnaeDescricao'
                label='CNAE Descrição'
                placeholder='Digite a descrição do CNAE'
                autoComplete='off'
                variant="standard"
                fullWidth
                {...register("cnaeDescricao", { required: true })}
                value={dataContainer.cnaeDescricao || ''}
              />
            </Grid>
          </Grid>

          <h2 className='register-form-title'>
            INFORME SEUS DADOS PF
          </h2>

          <Grid container spacing={3}>

            <Grid item xs={12} sm={6}>
              <TextField
                id="nome"
                name='nome'
                label='Nome completo'
                fullWidth
                placeholder='Digite o seu nome completo'
                autoComplete='off'
                variant="standard"
                {...register("nome", { required: true })}
                value={dataContainer.nome || ''}
                onChange={handleChange}
              />
              {errors.nome && <span style={{ color: "red", top: "20px" }}>{errors.nome.message}</span>}
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                id="cpf"
                name='cpf'
                label='CPF'
                fullWidth
                placeholder='Digite o seu CPF'
                autoComplete='off'
                variant="standard"
                {...register("cpf", { required: true })}
                value={maskCPF(dataContainer.cpf)}
                onChange={handleChange}
              />
              {errors.cpf && <span style={{ color: "red", top: "20px", right: "10px" }}>{errors.cpf.message}</span>}
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                id="telefone"
                name='telefone'
                label='Telefone com DDD'
                placeholder='Ex: (00) 00000-0000'
                autoComplete='off'
                variant="standard"
                fullWidth
                {...register("telefone", { required: true })}
                value={maskPhone(dataContainer.telefone || '')}
                onChange={handleChange}
              />
              {errors.telefone && <span style={{ color: "red", top: "20px" }}>{errors.telefone.message}</span>}
            </Grid>

            <FormControl variant="standard" sx={{ m: 3, minWidth: 310 }} >
              <InputLabel id="cargo">Qual é o seu cargo?</InputLabel>
              <Select
                labelId="cargo"
                id="cargo"
                name='cargo'
                {...register("cargo", { required: true })}
                value={dataContainer.cargo || ''}
                onChange={(e) => {
                  setDataContainer({ ...dataContainer, cargo: e.target.value.toString() });
                }}
                // onChange={handleSelect}
                label="Cargo"
              >
                <MenuItem value={"Administrador"}>Administrador</MenuItem>
                <MenuItem value={"Sócio/Proprietário"}>Sócio/Proprietário</MenuItem>
                <MenuItem value={"Sócio"}>Sócio</MenuItem>
                <MenuItem value={"Controller"}>Controller</MenuItem>
                <MenuItem value={"Gerente"}>Gerente</MenuItem>
              </Select>
              {errors.cargo && <span style={{ color: "red", top: "20px" }}>{errors.cargo.message}</span>}
            </FormControl>

            <Grid item xs={12} sm={6}>
              <TextField
                id="email"
                name='email'
                label='Email'
                placeholder='Digite o seu email'
                autoComplete='off'
                variant="standard"
                fullWidth
                {...register("email", { required: true })}
                value={dataContainer.email || ''}
                onChange={handleChange}
              />
              {errors.email && <span style={{ color: "red", top: "20px" }}>{errors.email.message}</span>}
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                id="confirmEmail"
                name='confirmEmail'
                label='Confirme o seu email'
                placeholder='Digite o seu email novamente'
                autoComplete='off'
                variant="standard"
                fullWidth
                {...register("confirmEmail", { required: true })}
                value={dataContainer.confirmEmail || ''}
                onChange={handleChange}
              />
              {errors.confirmEmail && <span style={{ color: "red", top: "20px" }}>{errors.confirmEmail.message}</span>}
            </Grid>
          </Grid>

          <h2 className='register-form-title'>
            Antes de seguir para os próximos passos, aceite os termos abaixo.
          </h2>

          <Controller
            name="terms"
            control={control}
            defaultValue={isCheckd}
            rules={{ required: true }}
            render={({ field }) =>
              <Checkbox
                {...field}
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            }
          />
          {errors.terms ? <span style={{ color: "red", top: "20px" }}>Declaro que li e concordo com as <a href="https://www.valecard.com.br/politica-de-privacidade/" target="_blank" rel="noreferrer" >Políticas de Privacidade</a></span> : <span style={{ color: "black", top: "20px" }}>Declaro que li e concordo com as <a href="https://www.valecard.com.br/politica-de-privacidade/" target="_blank" rel="noreferrer" >Políticas de Privacidade</a>.</span>}
        </>
      )}
    </>
  )
}
