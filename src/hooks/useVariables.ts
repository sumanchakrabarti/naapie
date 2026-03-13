import { useState, useCallback, useEffect } from 'react';

export interface Variable {
  key: string;
  value: string;
}

const STORAGE_KEY = 'naaipe-variables';
const KEY_PATTERN = /^[a-zA-Z0-9.]+$/;

function load(): Variable[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(vars: Variable[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vars));
}

export function isValidVariableKey(key: string): boolean {
  return KEY_PATTERN.test(key);
}

/**
 * Replaces all `{{key}}` placeholders in a string with variable values.
 * Keys are constrained to alphanumerics and `.`
 */
export function substituteVariables(input: string, vars: Variable[]): string {
  if (!input) return input;
  return input.replace(/\{\{([a-zA-Z0-9.]+)\}\}/g, (match, key) => {
    const found = vars.find((v) => v.key === key);
    return found ? found.value : match;
  });
}

export default function useVariables() {
  const [variables, setVariables] = useState<Variable[]>(load);

  useEffect(() => {
    save(variables);
  }, [variables]);

  const setVariable = useCallback((idx: number, field: 'key' | 'value', val: string) => {
    setVariables((prev) =>
      prev.map((v, i) => (i === idx ? { ...v, [field]: val } : v)),
    );
  }, []);

  const addVariable = useCallback(() => {
    setVariables((prev) => [...prev, { key: '', value: '' }]);
  }, []);

  const removeVariable = useCallback((idx: number) => {
    setVariables((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  return { variables, setVariable, addVariable, removeVariable };
}
