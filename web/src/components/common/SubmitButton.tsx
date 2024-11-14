import { useForm } from "../../context/FormProvider";

type SubmitButtonProps = {
  children: React.ReactNode;
};

export const SubmitButton: React.FC<SubmitButtonProps> = ({ children }) => {
  const form = useForm();

  return (
    <button
      type="submit"
      onClick={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      {children}
    </button>
  );
};
