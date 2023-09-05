
import z from 'zod';

const quantityValidation = z.object({
  price: z.number().min(1),
});

export default quantityValidation;
