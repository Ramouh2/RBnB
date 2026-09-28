/**
 * Formatage numérique RBnB (fr-FR) déterministe : identique côté serveur et client,
 * indépendant des données ICU de l'environnement (aucune erreur d'hydratation).
 */
const GROUP_SEPARATOR = " "; // espace fine insécable
const DECIMAL_SEPARATOR = ",";

export function formatNumberFr(value: number, fractionDigits = 0): string {
  const negative = value < 0;
  const fixed = Math.abs(value).toFixed(fractionDigits);
  const [integer, decimals] = fixed.split(".");
  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, GROUP_SEPARATOR);
  return `${negative ? "−" : ""}${grouped}${decimals ? DECIMAL_SEPARATOR + decimals : ""}`;
}

export function formatCurrencyFr(value: number, currency = "€", fractionDigits = 0): string {
  return `${formatNumberFr(value, fractionDigits)} ${currency}`;
}
