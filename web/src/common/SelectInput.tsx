import { useForm } from "../context/FormProvider";

type SelectMenuProps = {
  label: string;
  name: string;
  option: string[];
};

export const SelectMenu: React.FC<SelectMenuProps> = ({
  label,
  name,
  option,
}) => {
  const form = useForm();

  return (
    <label>
      {label}
      <select name={name} onChange={(e) => form.setValue(name, e.target.value)}>
        {option.map((value) => (
          <option value={value}>{value}</option>
        ))}
      </select>
    </label>
  );
};
