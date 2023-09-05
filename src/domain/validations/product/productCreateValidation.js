
import z from 'zod';

export const createProductValidation = z.object({
  code: z.string().nonempty().trim(),
  title: z.string().nonempty().trim(),
  description: z.string().nonempty().trim(),
  price: z.number().nonnegative(),
  status: z.boolean(),
  stock: z.number(),
  category: z.string().nonempty().trim(),
});

export default createProductValidation;
