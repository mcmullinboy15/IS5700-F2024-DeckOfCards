import { createContext, useContext, useState } from "react";

type FormContextType = {
  state: Record<string, any>;
  setState: (state: Record<string, any>) => void;
  setValue: (name: string, value: any) => void;
  errors: Record<string, any>;
  setErrors: (errors: Record<string, any>) => void;
  handleSubmit: () => void;
};

const FormContext = createContext<FormContextType | undefined>(undefined);

type FormProviderProps = {
  onSubmit: (state: Record<string, any>) => void;
  children: React.ReactNode;
};

export const FormProvider = ({ onSubmit, children }: FormProviderProps) => {
  const [state, setState] = useState({});
  const [errors, setErrors] = useState({});

  const handleSubmit = () => {
    onSubmit(state);
  };

  const setValue = (name: string, value: any) => {
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
