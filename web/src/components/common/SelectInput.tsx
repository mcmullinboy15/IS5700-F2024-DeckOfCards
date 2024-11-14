import { useForm } from "../../context/FormProvider";
import { useEffect } from "react";

type SelectInputProps = {
  label: string;
  name: string;
  option: string[];
};

export const SelectInput: React.FC<SelectInputProps> = ({
  label,
  name,
  option,
}) => {
  const { state, setValue } = useForm();

  //this runs to allow the default value to be set into state
  useEffect(() => {
    if (!state[name]) {
      setValue(name, option[0]);
    }
  }, [state, name, option, setValue]);

  return (
    <label>
      <span>{label}</span>
      <select name={name} onChange={(e) => setValue(name, e.target.value)}>
        {option.map((value, index) => (
          <option key={index} value={value}>
            {value}
          </option>
        ))}
      </select>
    </label>
  );
};
