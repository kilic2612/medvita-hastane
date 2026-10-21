import { useState } from 'react';

type Values = Record<string, string | boolean>;
type Errors<T> = Partial<Record<keyof T, string>>;

/**
 * Hafif form yönetimi: hatalar her değişiklikte yeniden hesaplanır,
 * ancak alan bir kez "dokunulduktan" (blur) sonra kullanıcıya gösterilir.
 */
export function useForm<T extends Values>(initial: T, validate: (values: T) => Errors<T>) {
  const [values, setValues] = useState<T>(initial);
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const errors = validate(values);
  const isValid = Object.keys(errors).length === 0;

  return {
    values,
    errors,
    isValid,
    set: <K extends keyof T>(key: K, value: T[K]) => setValues((v) => ({ ...v, [key]: value })),
    touch: (key: keyof T) => setTouched((t) => ({ ...t, [key]: true })),
    touchAll: () =>
      setTouched(Object.fromEntries(Object.keys(initial).map((k) => [k, true])) as Partial<Record<keyof T, boolean>>),
    error: (key: keyof T) => (touched[key] ? errors[key] : undefined),
    reset: () => {
      setValues(initial);
      setTouched({});
    },
  };
}

export type FormApi<T extends Values> = ReturnType<typeof useForm<T>>;
