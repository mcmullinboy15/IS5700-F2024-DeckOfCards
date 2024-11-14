import { createContext, useContext, useState } from "react";

type FormContextType<T> = {
  state: T;
  setState: (state: T) => void;
  setValue: (name: string, value: any) => void;
  errors: T;
  setErrors: (errors: T) => void;
  handleSubmit: () => void;
};

const FormContext = createContext<FormContextType<any> | undefined>(undefined);

type FormProviderProps<T> = {
  onSubmit: (state: T) => void;
  children: React.ReactNode;
};

export const FormProvider = <T,>({
  onSubmit,
  children,
}: FormProviderProps<T>) => {
  const [state, setState] = useState<T>({} as T);
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
