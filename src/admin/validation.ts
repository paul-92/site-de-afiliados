import { PRODUCT_STATUSES, type ProductStatus } from "@/catalog/domain";

export class AdminValidationError extends Error {}

export function required(value: FormDataEntryValue | null, field: string, max = 200) {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text) throw new AdminValidationError(`${field} é obrigatório.`);
  if (text.length > max) throw new AdminValidationError(`${field} excede ${max} caracteres.`);
  return text;
}

export function optional(value: FormDataEntryValue | null, max = 2000) {
  const text = typeof value === "string" ? value.trim() : "";
  if (text.length > max) throw new AdminValidationError(`Campo excede ${max} caracteres.`);
  return text || null;
}

export function slug(value: FormDataEntryValue | null) {
  const text = required(value, "Slug", 120);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(text)) throw new AdminValidationError("Slug deve usar letras minúsculas, números e hífens.");
  return text;
}

export function httpsUrl(value: FormDataEntryValue | null, field: string, optionalValue = false) {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text && optionalValue) return null;
  try {
    const url = new URL(text);
    if (text.length > 2048 || url.protocol !== "https:" || url.username || url.password || !url.hostname) throw new Error();
    if (url.hostname === "localhost" || url.hostname.endsWith(".localhost") || /^(?:127\.|10\.|192\.168\.|169\.254\.|0\.|\[?::1\]?$)/i.test(url.hostname)) throw new Error();
    const private172 = url.hostname.match(/^172\.(\d{1,3})\./);
    if (private172 && Number(private172[1]) >= 16 && Number(private172[1]) <= 31) throw new Error();
    return url.toString();
  } catch { throw new AdminValidationError(`${field} deve ser uma URL HTTPS pública.`); }
}

export function uuid(value: FormDataEntryValue | null, field: string) {
  const text = required(value, field, 36);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(text)) throw new AdminValidationError(`${field} inválido.`);
  return text;
}

export function status(value: FormDataEntryValue | null): ProductStatus {
  const text = required(value, "Status") as ProductStatus;
  if (!PRODUCT_STATUSES.includes(text)) throw new AdminValidationError("Status inválido.");
  return text;
}

export function money(value: FormDataEntryValue | null) {
  const text = required(value, "Preço", 20).replace(",", ".");
  if (!/^\d{1,10}(?:\.\d{1,2})?$/.test(text) || Number(text) <= 0) throw new AdminValidationError("Preço deve ser um valor positivo com até duas casas decimais.");
  return Number(text).toFixed(2);
}
