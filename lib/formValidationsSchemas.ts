import z from "zod";

//student schema
export const studentSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  phone: z.string().min(1).optional().or(z.literal("")),
  address: z.string().min(1, { message: "Address is required!" }),
  bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  birthday: z.date({ message: "Birthday is required!" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
  subjects: z.array(z.number()).optional(),
  departmentId: z.number().min(1, { message: "Department is required!" }),
});

export type StudentSchema = z.infer<typeof studentSchema>;

//building schema
export const buildingSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "Hall name is required!" }),
});

export type BuildingSchema = z.infer<typeof buildingSchema>;

//lecturer schema
export const lecturerSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  phone: z.string().min(1, { message: "Phone is required!" }),
  address: z.string().min(1, { message: "Address is required!" }),
  bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  birthday: z.date({ message: "Birthday is required!" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
  subjects: z.array(z.number()).optional(),
  departmentId: z.number().min(1, { message: "Department is required!" }),
});

export type LecturerSchema = z.infer<typeof lecturerSchema>;

//lectureRoom schema
export const lectureRoomSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(3, { message: "Name is required!" }),
  hallId: z.number().min(1, { message: "Hall is required!" }),
  maxCapacity: z.number().min(1, { message: "Max capacity is required!" }),
});

export type LectureRoomSchema = z.infer<typeof lectureRoomSchema>;

//department schema
export const departmentSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(3, { message: "Name is required!" }),
});

export type DepartmentSchema = z.infer<typeof departmentSchema>;

//subject schema
export const subjectSchema = z.object({
  id: z.number().optional(),
  code: z.string().min(3, { message: "Subject code is required!" }),
  name: z.string().min(3, { message: "Subject name is required!" }),
});

export type SubjectSchema = z.infer<typeof subjectSchema>;
