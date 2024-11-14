import { useForm } from "../../context/FormProvider";

type TextInputProps = {
  label: string;
  name: string;
  type?: "number";
};

export const NumberInput: React.FC<TextInputProps> = ({
  label,
  name,
  type = "number",
}) => {
  const form = useForm();

  return (
    <label>
      {label}
      <input
        type={type}
        name={name}
        onChange={(e) => form.setValue(name, e.target.value)}
      />
    </label>
  );
};
