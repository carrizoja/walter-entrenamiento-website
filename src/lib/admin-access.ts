const ADMIN_EMAIL_ALLOWLIST = ['walterentrenamiento.web@gmail.com'];

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) {
    return false;
  }

  const normalizedEmail = normalizeEmail(email);
  return ADMIN_EMAIL_ALLOWLIST.some((allowedEmail) => normalizeEmail(allowedEmail) === normalizedEmail);
}
