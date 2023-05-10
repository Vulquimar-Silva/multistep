/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-undef */
import { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Check from '@mui/icons-material/Check';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import RequestPageIcon from '@mui/icons-material/RequestPage';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DescriptionIcon from '@mui/icons-material/Description';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'

import RegisterForm from '../components/FormRegister/RegisterForm';
import FeesAndInterestiewForm from '../components/FormFeesAndInterest/FeesAndInterestiewForm';
import AddressForm from '../components/FormAddress/AddressForm';
import Complements from '../components/FormComplements/Complements';

import logoValeCard from '../assets/img/logo-valecard.png';
import ButtonContext from '../context/ButtonContext'
import GifAcordo from '../assets/img/concluido.gif'

import "./ContainerPage.scss"

const steps = ['Cadastro', 'Condições', 'Endereço', 'Complementos'];

const theme = createTheme();

const formTemplate = {
  cnpj: "",
  razaoSocial: "",
  nomeFantasia: "",
  cnae: "",
  cnaeDescricao: "",
  terms: false,
  nome: "",
  telefone: "",
  cpf: "",
  cargo: "",
  email: "",
  confirmEmail: "",
  descricao_situacao_cadastral: "",
  logradouro: "",
  cep: "",
  numero: "",
  complemento: "",
  municipio: "",
  uf: "",
}

// const validateFormComplements = z.object({
//   contactEmail: z.string()
//     .nonempty('O email é obrigatório')
//     .email('Digite um email válido'),
// });

const validaFormRegister = z.object({
  cnpj: z.string()
    .nonempty('O cnpj é obrigatório'),
  razaoSocial: z.string()
    .nonempty('A Razão Social é obrigatório'),
  cnae: z.string()
    .nonempty('O CNAE é obrigatório'),
  cnaeDescricao: z.string()
    .nonempty('A Descrição do CNAE é obrigatório'),
  nome: z.string()
    .nonempty("O nome é obrigatório"),
  telefone: z.string()
    .nonempty('O telefone é obrigatório'),
  cpf: z.string()
    .nonempty('CPF inválido'),
  cargo: z.string()
    .nonempty('O cargo é obrigatório'),
  email: z.string()
    .nonempty('O email é obrigatório')
    .email('Digite um email válido'),
  confirmEmail: z.string(),
  terms: z.coerce.boolean()
})
  .refine((fields) => fields.email === fields.confirmEmail, {
    path: ['confirmEmail'],
    message: "Os emails precisam ser iguais"
  })
  .refine((fields) => fields.terms === true, {
    path: ['terms'],
    message: "É necessario aceitar as políticas de privacidade para prosseguir"
  })

export default function ContainerPage() {

  const [activeStep, setActiveStep] = useState(0);
  const [buttonStatus, setButtonStatus] = useState(true);
  const [dataContainer, setDataContainer] = useState(formTemplate);
  const [output, setOutput] = useState([]);
  const methods = useForm({
    criteriaMode: 'all',
    mode: 'all',
    resolver: zodResolver(validaFormRegister),
  });

  function getStepContent(step) {
    switch (step) {
      case 0:
        return <RegisterForm dataContainer={dataContainer} setDataContainer={setDataContainer} />;
      case 1:
        return <FeesAndInterestiewForm dataContainer={dataContainer} setDataContainer={setDataContainer} />;
      case 2:
        return <AddressForm dataContainer={dataContainer} setDataContainer={setDataContainer} output={output} />;
      case 3:
        return <Complements dataContainer={dataContainer} setDataContainer={setDataContainer} output={output} />;
      default:
        throw new Error('Erro ao carregar a página!');
    }
  }

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  function QontoStepIcon(props) {
    const { active, completed, className } = props;

    return (
      <QontoStepIcon ownerState={{ active }} className={className}>
        {completed ? (
          <Check className="QontoStepIcon-completedIcon" />
        ) : (
          <div className="QontoStepIcon-circle" />
        )}
      </QontoStepIcon>
    );
  }

  QontoStepIcon.propTypes = {
    /**
     * Whether this step is active.
     * @default false
     */
    active: PropTypes.bool,
    className: PropTypes.string,
    /**
     * Mark the step as completed. Is passed to child components.
     * @default false
     */
    completed: PropTypes.bool,
  };

  const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 25,
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage:
          'linear-gradient( 95deg, #F2F2F2 0%, #0F468C 50%, #0D3973 100%)',
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage:
          'linear-gradient( 95deg, #F2F2F2 0%, #0F468C 50%, #0D3973 100%)',
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      height: 4,
      border: 0,
      backgroundColor:
        theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
      borderRadius: 1,
    },
  }));

  const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    ...(ownerState.active && {
      backgroundImage:
        'linear-gradient( 136deg, #F2F2F2 0%, #0F468C 50%, #0D3973 100%)',
      boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    }),
    ...(ownerState.completed && {
      backgroundImage:
        'linear-gradient( 136deg, #F2F2F2 0%, #0F468C 50%, #0D3973 100%)',
    }),
  }));

  function ColorlibStepIcon(props) {
    const { active, completed, className } = props;

    const icons = {
      1: <HowToRegIcon />,
      2: <TrendingUpIcon />,
      3: <DescriptionIcon />,
      4: <RequestPageIcon />,
    };

    return (
      <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
        {icons[String(props.icon)]}
      </ColorlibStepIconRoot>
    );
  }

  ColorlibStepIcon.propTypes = {
    /**
     * Whether this step is active.
     * @default false
     */
    active: PropTypes.bool,
    className: PropTypes.string,
    /**
     * Mark the step as completed. Is passed to child components.
     * @default false
     */
    completed: PropTypes.bool,
    /**
     * The label displayed in the step icon.
     */
    icon: PropTypes.node,
  };
  // const { cnpj, razaoSocial, nomeFantasia, cnae, cnaeDescricao, terms, nome, telefone, email, confirmEmail, cep, logradouro, numero, complemento, municipio } = data;
  const handleFormSubmit = (data) => {
    setActiveStep(activeStep + 1);
    const { cnpj, razaoSocial, nomeFantasia, cnae, cnaeDescricao, terms, nome, telefone, cpf, cargo, email } = data;
    const output = { cnpj, razaoSocial, nomeFantasia, cnae, cnaeDescricao, terms: terms ? "aceito" : "não aceito", nome, telefone, cpf, cargo, email };
    setOutput([JSON.stringify(output, null, 2)]);
    console.log(output);
    const serializedState = JSON.stringify(output);
    localStorage.setItem('cadastro', serializedState);
  };

  const handleRealoadPage = () => {
    window.location.reload(true)
  }

  return (
    <ButtonContext.Provider value={{ buttonStatus, setButtonStatus }}>
      <FormProvider {...methods}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppBar
            position="absolute"
            color="default"
            elevation={0}
            sx={{
              position: 'relative',
              borderBottom: (t) => `2px solid ${t.palette.divider}`,
            }}>

            {/* target="_blank" rel="noreferrer"  */}

            <Toolbar className='colorToolbar'></Toolbar>
            <a href="https://www.valecard.com.br/" className='logoValeCard' >
              <img src={logoValeCard} alt="Logo da ValeCard" />
            </a>
          </AppBar>
          <Container component="main">
            <Paper variant="outlined" sx={{ my: { xs: 16, md: 12 }, p: { xs: 1, md: 6 } }} className='indexForm'>
              <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              {activeStep === steps.length ? (
                <div>
                  <h2 className='title-concluido-step'>
                    Dados enviado com sucesso, logo entraremos em contato com você. Obrigado!!!
                  </h2>
                  <div className='gif-acordo'>
                    <img src={GifAcordo} alt="Gif de acordo conluido" />
                  </div>
                  {/* {output.map((item, index) => (
                    <pre className='preContainer' key={index}>{item}</pre>
                  ))} */}
                  <Button onClick={handleRealoadPage} sx={{ mt: 2, ml: 1 }} variant="contained">
                    Voltar ao início
                  </Button>
                </div>
              ) : (
                <>
                  {getStepContent(activeStep)}
                  <Box
                    component="form"
                    onSubmit={methods.handleSubmit(handleFormSubmit)}
                    sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {activeStep !== 0 && (
                      <Button onClick={handleBack} sx={{ mt: 2, mr: 5 }}>
                        Voltar
                      </Button>
                    )}
                    <Button
                      type='submit'
                      disabled={buttonStatus}
                      variant="contained"
                      sx={{ mt: 2, mr: -2 }}
                    >
                      {activeStep === 0 ? 'Simular taxas e tarifas' : activeStep === steps.length - 1 ? 'Enviar' : 'Avançar'}
                    </Button>
                  </Box>
                </>
              )}
            </Paper>
          </Container>
        </ThemeProvider>
      </FormProvider>
    </ButtonContext.Provider>
  );
}
