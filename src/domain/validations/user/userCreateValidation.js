
import z from 'zod';

const userCreateValidation = z.object({
  email: z.string().email(),
  firstName: z.string().min(3).max(35),
  lastName: z.string().max(35),
  password: z.string().min(5),
});

export default userCreateValidation;