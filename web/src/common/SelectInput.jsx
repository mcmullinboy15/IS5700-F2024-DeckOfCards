import { useForm } from "../context/FormProvider";

// option should be type array
export const SelectMenu = ({ label, name, option }) => {
  const form = useForm();

  //this should work but I didn't test it
  return (
    <label>
      {label}
      <select
        name={name}
        onChange={(e) => {
          form.setValue(name, e.target.value);
        }}
      >
        {option.map((value) => {
          <option value={value}>{value}</option>;
        })}
      </select>
    </label>
  );
};
