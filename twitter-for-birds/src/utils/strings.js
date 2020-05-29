import dompurify from 'dompurify';

export function stripNonNumeric(value) {
  if (!value) return '';
  return value.replace(/\D+/g, '');
}

export function formatPhoneNumber(phoneNumber) {
  if (!phoneNumber) return '';

  return stripNonNumeric(phoneNumber)
    .replace(/^(\d{3})(\d{3})(\d{4})$/, '($1) $2-$3');
}

export function sanitizeHTML(html) {
  const sanitizer = dompurify.sanitize;
  return sanitizer(html);
}
