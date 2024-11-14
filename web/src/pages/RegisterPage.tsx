import { FormProvider } from "../context/FormProvider";
import { TextInput } from "../components/common/TextInput";
import { SelectInput } from "../components/common/SelectInput";
import { SubmitButton } from "../components/common/SubmitButton";
import { useState } from "react";
import { validatePassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { showToast } from "../components/CustomToast";
import { useNavigate } from "react-router-dom";
import { register } from "../firebase/auth";

type RegisterUser = {
  email: string;
  password: string;
  confirmPassword: string;
  access: string;
};

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [shake, setShake] = useState("");

  //regex provides basic level verification
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const handleSubmit = async (input: RegisterUser) => {
    console.log(input);

    if (input.password !== input.confirmPassword) {
      setError("Passwords do not match.");
      setShake("shake");
      return;
    }

    const passwordStatus = await validatePassword(auth, input.password);
    if (!passwordStatus.isValid) {
      setError(JSON.stringify(passwordStatus));
      setShake("shake");
      return;
    }

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

    register(input.email, input.password)
      .then((user) => {
        console.log("Registered user:", user);
        showToast("User registered successfully.", "success");
        setError("");
        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Error registering user:", errorCode, errorMessage);
        setError(errorMessage);
        setShake("shake");
      });
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
          name="confirmPassword"
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
