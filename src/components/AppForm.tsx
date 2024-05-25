import { createContext, useContext, useRef } from "react";
import {
  FieldErrors,
  FieldValues,
  UseFormRegister,
  UseFormSetValue,
  useForm,
} from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { appFormSchema } from "../validation/AppFormSchema";

import Input from "./UI/Input";
import DropZone from "./UI/DropZone";
import FieldWithError from "./UI/FieldWithError";
import Button from "./UI/Button";
import Checkbox from "./UI/Checkbox";
import Multiselect from "./UI/Multiselect";

const allowedExtensions = [".png", ".pdf", ".docx"];
const selectOptions = [
  { value: "Junior", label: "Junior" },
  { value: "Middle", label: "Middle" },
  { value: "Senior", label: "Senior" },
  { value: "Lead", label: "Lead" },
  { value: "CTO", label: "CTO" },
];

type AppFormInputs = z.infer<typeof appFormSchema>;

type ContextType<T extends FieldValues> = {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  setFormValue: UseFormSetValue<T>;
  formRef: React.RefObject<HTMLFormElement>;
};

const AppFormContext = createContext<ContextType<AppFormInputs> | null>(null);

type AppFormProps = {
  children: React.ReactNode;
};

const AppForm = ({ children }: Readonly<AppFormProps>) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<AppFormInputs>({
    resolver: zodResolver(appFormSchema),
  });

  const onSubmit = (data: AppFormInputs) => {
    console.log(data);
  };

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <AppFormContext.Provider
      value={{ register, errors, setFormValue: setValue, formRef }}
    >
      <form
        className="relative max-w-[640px] rounded-[32px] p-10 shadow-xl"
        ref={formRef}
        onSubmit={handleSubmit(onSubmit)}
      >
        {children}
      </form>
    </AppFormContext.Provider>
  );
};

const AppFormHeading = () => {
  return (
    <div className="ar mb-8 flex flex-col gap-4">
      <h1 className="font- text-4xl font-semibold text-gray-950">
        Drop us a line
      </h1>
      <p className="text-xl text-gray-700">
        Our documentary campaigns feature leading figures, organisations and
        leaders, in open and candid discussions.
      </p>
    </div>
  );
};

const AppFormNameInput = () => {
  const { register, errors } = useContext(AppFormContext)!;

  return (
    <FieldWithError errorMessage={errors.name?.message}>
      <Input
        label="name"
        isError={!!errors.name}
        placeholder="Name"
        type="text"
        {...register("name")}
      />
    </FieldWithError>
  );
};

const AppFormPhoneInput = () => {
  const { register, errors } = useContext(AppFormContext)!;

  return (
    <FieldWithError errorMessage={errors.phone?.message}>
      <Input
        label="phone"
        isError={!!errors.phone}
        placeholder="Phone"
        type="text"
        {...register("phone")}
      />
    </FieldWithError>
  );
};

const AppFormEmailInput = () => {
  const { register, errors } = useContext(AppFormContext)!;

  return (
    <FieldWithError errorMessage={errors.email?.message}>
      <Input
        label="email"
        isError={!!errors.email}
        placeholder="E-mail"
        type="text"
        {...register("email")}
      />
    </FieldWithError>
  );
};

const AppFormSkillsSelect = () => {
  const { register, errors, setFormValue } = useContext(AppFormContext)!;

  return (
    <FieldWithError errorMessage={errors.skills?.message}>
      <Multiselect
        options={selectOptions}
        name="skills"
        isError={!!errors.skills}
        register={register}
        setFormValue={setFormValue}
      />
    </FieldWithError>
  );
};

const AppFormDropZone = () => {
  const { register, errors, setFormValue, formRef } =
    useContext(AppFormContext)!;

  return (
    <DropZone>
      <div className="flex gap-4 px-[1px]">
        <div className="flex flex-col gap-3">
          <DropZone.Text>
            <div className="flex flex-col gap-3">
              <h3 className="font-medium text-gray-950">Dokument hochladen</h3>
              <p className="text-xs text-gray-400">
                Klicken Sie auf die Schaltfläche oder ziehen Sie ein Dokument im
                PDF-, DOCX-, PNG.
              </p>
            </div>
          </DropZone.Text>
          <DropZone.FileList name={"files"} setFormValue={setFormValue} />
        </div>
        <div className="flex w-full min-w-[125px] max-w-[234px] flex-col gap-1">
          <DropZone.Area
            triggerRef={formRef}
            name="files"
            register={register}
            error={errors.files}
            allowedExtensions={allowedExtensions}
          />
          <DropZone.ErrorMessage error={errors.files} />
        </div>
      </div>
    </DropZone>
  );
};

const AppFormCheckbox = () => {
  const { register, errors } = useContext(AppFormContext)!;

  return (
    <FieldWithError errorMessage={errors.agreement?.message}>
      <Checkbox
        label="I’m agree with every data you collect"
        isError={!!errors.agreement}
        {...register("agreement")}
      />
    </FieldWithError>
  );
};

const AppFormButton = () => {
  return (
    <Button className="w-full" type="submit">
      Send
    </Button>
  );
};

AppForm.Heading = AppFormHeading;
AppForm.NameInput = AppFormNameInput;
AppForm.PhoneInput = AppFormPhoneInput;
AppForm.EmailInput = AppFormEmailInput;
AppForm.SkillsSelect = AppFormSkillsSelect;
AppForm.DropZone = AppFormDropZone;
AppForm.Checkbox = AppFormCheckbox;
AppForm.Button = AppFormButton;

export default AppForm;
