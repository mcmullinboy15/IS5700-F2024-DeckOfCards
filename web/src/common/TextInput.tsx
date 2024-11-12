import { useForm } from "../context/FormProvider";


type TextInputProps = {
  label: string;
  name: string;
  type?: "text" | "password";
};

export const TextInput: React.FC<TextInputProps> = ({
  label,
  name,
  type = "text",
}) => {
  const form = useForm();

  return (
    <label>
      {label}
      <input
        type={type}
        name={name}
        onChange={(e) => {
          form.setValue(name, e.target.value);
        }}
      />
    </label>
  );
};
