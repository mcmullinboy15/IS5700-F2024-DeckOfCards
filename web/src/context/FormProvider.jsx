import { createContext, useContext, useState } from "react";

const FormContext = createContext();

export const FormProvider = ({ onSubmit, children }) => {
  const [state, setState] = useState({});
  const [errors, setErrors] = useState({});

  const handleSubmit = () => {
    onSubmit(state);
  };

  const setValue = (name, value) => {
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <FormContext.Provider
      value={{
        state,
        setState,
        setValue,
        errors,
        setErrors,
        handleSubmit,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useForm = () => {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error("useForm must be used with the provider.");
  }

  return context;
};
