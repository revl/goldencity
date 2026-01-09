import { makeValidator, type Spec, type ValidatorSpec } from "envalid";

export type BoundedIntSpec<T extends number> = Spec<T> & {
  min: number;
  max: number;
};

const parseBoundedInt = (min: number, max: number) => (raw: string) => {
  const numericValue = Number(raw);

  if (!Number.isInteger(numericValue)) {
    throw new Error("must be an integer");
  }

  if (numericValue < min || numericValue > max) {
    throw new Error(`must be between ${min} and ${max}`);
  }

  return numericValue;
};

export const boundedIntSpec = <T extends number>({
  min,
  max,
  ...spec
}: BoundedIntSpec<T>): ValidatorSpec<T> => {
  const validator = makeValidator<number>(parseBoundedInt(min, max));

  return validator(spec as Spec<number>) as ValidatorSpec<T>;
};

export type CsvSpec<T> = Spec<Array<T>> & {
  separator?: string;
  transform?: (value: string) => T;
};

export const csvSpec = <T = string>({
  separator = ",",
  transform = (value: string) => value.trim() as T,
  ...spec
}: CsvSpec<T> = {}): ValidatorSpec<Array<T>> => {
  const validator = makeValidator<Array<T>>((raw: string) => {
    if (raw.trim() === "") throw new Error("must not be empty");

    return raw.split(separator).map(transform);
  });

  return validator(spec as Spec<Array<T>>);
};
