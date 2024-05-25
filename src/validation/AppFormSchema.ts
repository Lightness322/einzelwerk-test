import { z } from "zod";

const optionSchema = z.object({
  label: z.string(),
  value: z.any(),
});

export const appFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Field is required" })
    .min(4, { message: "Name must be at least 4 characters" }),
  phone: z
    .string()
    .min(1, { message: "Field is required" })
    .regex(/^\+?\(?\d{3}\)?[-\s.]?\d{3}[-\s.]?\d{4,6}$/, {
      message: "Incorrect phone number format",
    }),
  email: z
    .string()
    .min(1, { message: "Field is required" })
    .email("Incorrect email format"),
  skills: z.array(optionSchema).min(1, { message: "Field is required" }),
  files: z.custom<FileList>((value: FileList) => value.length > 0, {
    message: "You haven't added documents",
  }),
  agreement: z.boolean().refine((bool) => bool === true, {
    message: "Your agreement is required",
  }),
});
