import { FormProvider } from "../context/FormProvider";
import { TextInput } from "../common/TextInput";
import { SelectInput } from "../common/SelectInput";
import { SubmitButton } from "../common/SubmitButton";
import { useState } from "react";

export const RegisterPage: React.FC = () => {
  const [error, setError] = useState("");
  const [shake, setShake] = useState("");

  //regex provides basic level verification
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const handleSubmit = (input: Record<string, any>) => {
    console.log(input);
    const result = regex.test(input.email);

    if (!result) {
      setError("Invaild email address.");
      setShake("shake");
      return;
    }

    //you could use this to check domains
    // see /src/backend/domain-check.ts
    // verifyDomain(input.email, (response: boolean) => {
    //   console.log(response);
    // });
  };

  const labelClass = "p-3 text-2xl mx-auto w-full";
  const inputClass = "my-4 mx-0 border block w-full";

  return (
    <div className="my-4 mx-auto text-black-500 p-4 w-1/2 grid grid-col-2 shadow-lg">
      <h2 className="mx-auto text-3xl my-4">Register Page</h2>
      <span className={`text-red-500 mx-auto ${shake} block`}>{error}</span>
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
