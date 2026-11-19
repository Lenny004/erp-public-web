import { z } from "zod";

/** Conserva letras Unicode y signos habituales de nombres sin alterar lo escrito. */
const PERSON_NAME_REGEX = /^[\p{L}\p{M}][\p{L}\p{M} .'-]*$/u;

export const personNameSchema = (
  fieldName: string,
  minLength: number,
  maxLength: number,
) =>
  z
    .string()
    .trim()
    .min(minLength, `${fieldName}: mínimo ${minLength} caracteres`)
    .max(maxLength, `${fieldName}: máximo ${maxLength} caracteres`)
    .regex(PERSON_NAME_REGEX, `${fieldName}: solo letras y espacios`);

export const optionalPersonNameSchema = (fieldName: string, maxLength: number) =>
  z
    .string()
    .trim()
    .max(maxLength, `${fieldName}: máximo ${maxLength} caracteres`)
    .refine(
      (value) => value === "" || PERSON_NAME_REGEX.test(value),
      `${fieldName}: solo letras y espacios`,
    );
