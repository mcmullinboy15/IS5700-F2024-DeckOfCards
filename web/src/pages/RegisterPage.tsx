import { FormProvider } from "../context/FormProvider";
import { TextInput } from "../common/TextInput";
import { SelectInput } from "../common/SelectInput";
import { SubmitButton } from "../common/SubmitButton";

export const RegisterPage: React.FC = () => {
  const handleSubmit = (input: Record<string, any>) => {
    console.log(input);
  };

  const labelClass = "p-3 text-2xl mx-auto w-full";
  const inputClass = "my-4 mx-0 border block w-full";

  return (
    <div className="my-4 mx-auto text-black-500 p-4 w-1/2 grid grid-col-2 shadow-lg">
      <h2 className="mx-auto text-3xl my-4">Register Page</h2>
      <FormProvider onSubmit={handleSubmit}>
        <TextInput
          labelClass={labelClass}
          inputClass={inputClass}
          label="Email:"
          type="email"
          name="email"
        />
        <TextInput
          labelClass={labelClass}
          inputClass={inputClass}
          label="Password:"
          type="password"
          name="password"
        />
        <TextInput
          labelClass={labelClass}
          inputClass={inputClass}
          label="Confirm Password:"
          type="password"
          name="confirm-password"
        />
        <SelectInput
          label="Select Access:  "
          option={["Player", "Admin"]}
          name="access"
        />
        <SubmitButton>Register</SubmitButton>
      </FormProvider>
    </div>
  );
};
