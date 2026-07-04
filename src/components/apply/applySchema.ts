import { z } from "zod";

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export const applySchema = z.object({
  fullName: z.string().trim().min(1, "apply.errors.required"),
  email: z.string().trim().min(1, "apply.errors.required").email("apply.errors.invalidEmail"),
  phone: z.string().trim().optional(),
  cv: z
    .custom<FileList>()
    .refine((files) => files && files.length > 0, "apply.errors.cvRequired")
    .refine((files) => !files?.[0] || ACCEPTED_TYPES.includes(files[0].type), "apply.errors.cvType")
    .refine((files) => !files?.[0] || files[0].size <= MAX_SIZE_BYTES, "apply.errors.cvSize"),
  coverNote: z.string().trim().optional(),
});

export type ApplyFormValues = z.infer<typeof applySchema>;
