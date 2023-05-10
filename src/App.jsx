/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import ContainerPage from "./components/ContainerPage";

// const formTemplate = {
//   cnpj: "",
//   razaoSocial: "",
//   nomeFantasia: "",
//   cnae: "",
//   cnaeDescricao: "",
//   nome: "",
//   email: "",
//   telefone: "",
//   descricao_situacao_cadastral: "",
// }

function App() {
  // const [dataApp, setDataApp] = useState(formTemplate);
  // const { currentStep, currentComponent } = useForm(formComponents);

  // const updateFieldHandler = (key, value) => {
  //   setDataApp((prevState) => {
  //     return { ...prevState, [key]: value }
  //   })
  // }

  // const formComponents = [
  //   <RegisterForm dataApp={dataApp} updateFieldHandler={updateFieldHandler} />,
  //   <ReviewForm dataApp={dataApp} updateFieldHandler={updateFieldHandler} />,
  //   <Thanks dataApp={dataApp} updateFieldHandler={updateFieldHandler} />,
  // ]

  return (
    <>
      <ContainerPage />
    </>
  )
}

export default App
