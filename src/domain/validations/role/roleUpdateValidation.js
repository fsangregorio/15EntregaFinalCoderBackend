
import z from 'zod';
import idValidation from '../common/idValidation.js';
import roleCreateValidation from './roleCreateValidation.js';

const roleUpdateValidation = z.union([idValidation, roleCreateValidation]);

export default roleUpdateValidation;
