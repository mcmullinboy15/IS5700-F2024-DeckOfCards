import { useForm } from "../context/FormProvider";

type TextInputProps = {
  label: string;
  name: string;
  type?: "text" | "password" | "email";
  labelClass: string;
  inputClass: string;
};

export const TextInput: React.FC<TextInputProps> = ({
  label,
  name,
  type,
  labelClass,
  inputClass,
}) => {
  const form = useForm();

  return (
    <label className={labelClass}>
      {label}
      <input
        type={type}
        name={name}
        className={inputClass}
        onChange={(e) => {
          form.setValue(name, e.target.value);
        }}
      />
    </label>
  );
};
