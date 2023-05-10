/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { Box, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Tooltip } from '@mui/material'
import { makeStyles, createStyles } from '@mui/styles';
import { DropzoneArea } from 'material-ui-dropzone';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import _ from "lodash";
import axios from 'axios'
import { useFormContext } from "react-hook-form";
import { maskPhone } from '../Masks/maskPhone'
import { maskNumbers } from '../Masks/numberMask'
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import InfoIcon from '@mui/icons-material/Info';

const useStyles = makeStyles((theme) =>
  createStyles({
    previewChip: {
      minWidth: 160,
      maxWidth: 210,
    },
  }),
);


export default function Complements() {
  // const { register, formState: { errors }, setValue, watch } = useFormContext();
  const methods = useFormContext();
  const capturaData = JSON.parse(localStorage.getItem('meioCaptura')) || {};
  const [captura, setCaptura] = useState(capturaData.captura || '');
  const [pv, setPv] = useState(capturaData.pv || '');
  const [stoneCode, setStoneCode] = useState(capturaData.stoneCode || '');
  const [contactName, setContactName] = useState(capturaData.contactName || '');
  const [contactPhone, setContactPhone] = useState(capturaData.contactPhone || '');
  const [showFields, setShowFields] = useState(capturaData.captura === 'Tef' || '');
  const [showFieldsCielo, setShowFieldsCielo] = useState(
    capturaData.captura === 'Cielo' || ''
  );
  const [showFieldsStone, setShowFieldsStone] = useState(
    capturaData.captura === 'Stone'
  );
  const [codeBank, setCodeBank] = useState({ code: '', fullName: '', error: '' });
  const [accountNumber, setAccountNumber] = useState("");
  const [domicilioBancario, setDomicilioBancario] = useState({});
  const [dropImages, setDropImages] = useState(() => {
    try {
      const storedImages = localStorage.getItem("comprovantes");
      return storedImages ? JSON.parse(storedImages) : [];
    } catch (error) {
      console.log(error);
      return [];
    }
  });

  const watchPv = methods.watch('pv');
  const watchStoneCode = methods.watch('stoneCode');
  const watchContactName = methods.watch('contactName');
  const watchContactPhone = methods.watch('contactPhone');
  const watchContactEmail = methods.watch('contactEmail');


  function handleInputBlur(e) {
    const { name, value } = e.target;
    if (name === 'code' && value.length <= 3) {
      fetchCepData(value.replace('.', '') || value.replace('-', ''));
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    methods.setValue(name, value);
  }

  const fetchCepData = _.debounce(async (code) => {
    try {
      setCodeBank(prevState => ({ ...prevState, error: "" }));
      if (code) {
        const response = await axios.get(`https://brasilapi.com.br/api/banks/v1/${code}`, { validateStatus: false });
        if (response.status === 404) {
          methods.setValue('fullName', '');
          setCodeBank({ error: "Código bancário não encontrado" });
        } else {
          const { data } = response;
          methods.setValue('fullName', data.fullName);
          setCodeBank(prevState => ({ ...prevState, code: data.code, fullName: data.fullName, error: "" }));
        }
      } else {
        methods.setValue('fullName', '');
        setCodeBank({ error: "" });
      }
    } catch (error) {
      methods.setValue('fullName', '');
      setCodeBank({ error: "Código bancário não encontrado" });
    }
  }, 500)

  function handleFullNameChange(e) {
    const { value } = e.target;
    setCodeBank(prevState => ({ ...prevState, fullName: value }));
  }

  useEffect(() => {
    try {
      const serializedState = JSON.stringify(dropImages);
      localStorage.setItem("comprovantes", serializedState);
    } catch (error) {
      console.log(error);
    }
  }, [dropImages]);

  const handleImageChange = (files) => {
    const filesData = files.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setDropImages(filesData);
  };

  const code = methods.watch("code");
  const fullName = methods.watch("fullName");
  const agency = methods.watch("agency");
  const account = methods.watch("account");
  const digit = methods.watch("digit");

  useEffect(() => {
    if (account && digit) {
      setAccountNumber(`${account}-${digit}`);
    } else if (account) {
      setAccountNumber(account);
    } else {
      setAccountNumber("");
    }
  }, [account, digit]);

  useEffect(() => {
    setDomicilioBancario({
      code,
      fullName,
      agency,
      account: accountNumber,
    });
  }, [code, fullName, agency, accountNumber]);

  useEffect(() => {
    localStorage.setItem("domicilioBancario", JSON.stringify(domicilioBancario));
  }, [domicilioBancario]);

  useEffect(() => {
    setPv(watchPv);
    setStoneCode(watchStoneCode);
    setContactName(watchContactName);
    setContactPhone(watchContactPhone);
  }, [watchPv, watchStoneCode, watchContactName, watchContactPhone]);

  useEffect(() => {
    let capturaData;

    if (captura === 'Cielo') {
      capturaData = {
        captura: captura,
        pv: pv || ''
      };
    } else if (captura === 'Stone') {
      capturaData = {
        captura: captura,
        stoneCode: stoneCode || ''
      };
    } else if (captura === 'Tef') {
      capturaData = {
        captura: captura,
        contactName: contactName,
        contactPhone: contactPhone,
        contactEmail: watchContactEmail
      };
    } else if (captura === 'Get Net' || captura === 'Global Payment') {
      capturaData = {
        captura: captura
      };
    }
    if (capturaData) {
      localStorage.setItem('meioCaptura', JSON.stringify(capturaData));
    }
  }, [captura, pv, stoneCode, contactName, contactPhone, watchContactEmail]);


  const handleChange = (e) => {
    setCaptura(e.target.value);
    setShowFields(e.target.value === 'Tef');
    setShowFieldsCielo(e.target.value === 'Cielo');
    setShowFieldsStone(e.target.value === 'Stone');
  };

  const classes = useStyles();

  return (
    <>
      <br />
      <h2 className='form-dados-complementares-title1'>
        Agora informe para qual meio de captura deseja a habilitação e também o domícilio bancário para repasse de suas transações!
      </h2>
      <Box
        component="form"
        sx={{
          '& > :not(style)': { m: 1, width: '24ch' },
        }}
        noValidate
        autoComplete="off"
      >

        <FormControl variant="standard">
          <InputLabel id="captura">Meio de captura</InputLabel>
          <Select
            labelId="captura"
            id="captura"
            name={captura}
            value={captura}
            label="Meio de captura"
            onChange={handleChange}
          >
            <MenuItem value={"Cielo"}>Cielo</MenuItem>
            <MenuItem value={"Stone"}>Stone</MenuItem>
            <MenuItem value={"Tef"}>Tef</MenuItem>
            <MenuItem value={"Get Net"}>Get Net</MenuItem>
            <MenuItem value={"Global Payment"}>Global Payment</MenuItem>
          </Select>
        </FormControl>
        {(showFieldsCielo) && (
          <FormControl variant="standard" sx={{ m: 2, minWidth: 250 }}>
            <Tooltip title="O código PV (Ponto de Venda) Cielo é um número de identificação exclusivo atribuído pela Cielo para cada estabelecimento que utiliza seus serviços de processamento de pagamentos. O código PV Cielo é composto por 15 dígitos e não inclui caracteres alfabéticos ou especiais.">
              <Grid item xs={12} md={9}>
                <TextField
                  fullWidth
                  required
                  id="pv"
                  name="pv"
                  label="PV"
                  placeholder="Digite o PV"
                  helperText="Este é código de identificação do seu estabelecimento junto a Cielo"
                  InputProps={{
                    inputProps: {
                      maxLength: 15,
                      pattern: "[0-9]*",
                    },
                  }}
                  variant="standard"
                  {...methods.register('pv', { required: true })}
                />
              </Grid>
            </Tooltip>
          </FormControl>
        )}
        {(showFieldsStone) && (
          <>
            <FormControl variant="standard" sx={{ m: 2, minWidth: 250 }}>
              <Tooltip title="O Stone Code é composto por 32 caracteres alfanuméricos e serve como uma identificação exclusiva para o estabelecimento dentro do sistema da Stone Co.">
                <Grid item xs={12} md={9}>
                  <TextField
                    fullWidth
                    required
                    id="stoneCode"
                    name="stoneCode"
                    label="Stone Code"
                    placeholder="Digite o Stone Code"
                    helperText="O Stone Code é um número de identificação exclusivo atribuído pela empresa Stone"
                    InputProps={{
                      inputProps: {
                        maxLength: 32,
                        pattern: "[0-9]*",
                      },
                    }}
                    variant="standard"
                    {...methods.register('stoneCode', { required: true })}
                  />
                </Grid>
              </Tooltip>
            </FormControl>
          </>
        )}

        {showFields && (
          <>
            <TextField
              id="contactName"
              name="contactName"
              label="Nome"
              placeholder="Digite o nome para contato"
              fullWidth
              required
              variant="standard"
              {...methods.register('contactName', { required: true })}
            />
            <TextField
              id="contactPhone"
              name="contactPhone"
              placeholder="Ex: (00) 00000-0000"
              label="Telefone"
              fullWidth
              variant="standard"
              {...methods.register('contactPhone', { required: true })}
              value={maskPhone(contactPhone)}
            />
            <TextField
              id="email"
              name="contactEmail"
              label="Email"
              placeholder="Digite o email para contato"
              fullWidth
              variant="standard"
              {...methods.register('contactEmail', { required: true })}
            />
            {methods.formState.errors.email && <span style={{ color: "red", top: "20px" }}>{methods.formState.errors.contactEmail.message}</span>}
          </>
        )}
      </Box>

      <h2 className='form-dados-complementares-title2'>
        Informe seu domícilio bancário
      </h2>
      {/* INICIO */}
      <>
        <Grid container spacing={3}>
          <Grid item xs={12} md={2}>
            <TextField
              required
              id="code"
              name="code"
              label="Cod. Banco"
              InputProps={{
                inputProps: {
                  maxLength: 3,
                  pattern: "[0-9]*",
                },
              }}
              fullWidth
              variant="standard"
              {...methods.register('code')}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
            />
          </Grid>

          <Grid item xs={12} md={5}>
            <TextField
              required
              id="fullName"
              name='fullName'
              label="Descrição Banco"
              fullWidth
              variant="standard"
              {...methods.register('fullName')}
              value={methods.watch('fullName') || ''}
              onChange={handleFullNameChange}
            />
            {codeBank.error && <span style={{ color: "red", top: "20px", fontSize: "12" }}>{codeBank.error}</span>}
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              required
              id="agency"
              name='agency'
              label="Agência"
              InputProps={{
                inputProps: {
                  maxLength: 5,
                  pattern: "[0-9]*",
                },
              }}
              fullWidth
              variant="standard"
              {...methods.register('agency', { required: true })}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              required
              id="account"
              name='account'
              label="Conta corrente"
              InputProps={{
                inputProps: {
                  maxLength: 9,
                  pattern: "[0-9]*",
                },
              }}
              fullWidth
              variant="standard"
              {...methods.register('account', { required: true })}
            />
          </Grid>

          <Grid item xs={12} md={1}>
            <TextField
              required
              id="digit"
              name='digit'
              label="Dígito"
              InputProps={{
                inputProps: {
                  maxLength: 2,
                  pattern: "[0-9]*",
                },
              }}
              fullWidth
              variant="standard"
              {...methods.register('digit', { required: true })}
            />
          </Grid>
        </Grid>
      </>

      {/* FIM */}
      <br />
      <br />
      <DropzoneArea
        onChange={handleImageChange}
        initialFiles={dropImages}
        Icon={AddPhotoAlternateOutlinedIcon}
        acceptedFiles={['image/*']}
        showPreviews={true}
        showPreviewsInDropzone={false}
        useChipsForPreview
        filesLimit={4}
        maxFileSize={24971520}
        showAlerts={false}
        dropzoneClass={classes.dropZone}
        dropzoneText={"Clique aqui e anexe os comprovantes de domicilio bancario"}
        previewGridProps={{ container: { spacing: 1, direction: 'row' } }}
        previewChipProps={{ classes: { root: classes.previewChip } }}
        previewText="Comprovantes anexados"
      />
      <br />
    </>
  );
}
