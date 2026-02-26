export function generateRandomCredential(length: number = 10): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
export function generateRandomSlug(length: number = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
export function formatEmail(user: string, domain: string): string {
  return `${user}@${domain}`;
}
export interface DcLoginParams {
  email: string;
  password?: string;
  ssl?: boolean;
}
export function createDcLoginLink({ email, password, ssl = true }: DcLoginParams): string {
  const url = new URL(`dclogin:${email}`);
  if (password) url.searchParams.set('password', password);
  // 0 = no ssl, 1 = ssl (default)
  url.searchParams.set('ssl', ssl ? '1' : '0');
  return url.toString();
}
/**
 * Attempts to detect if a protocol handler is available by checking window focus.
 * This is a heuristic and not 100% reliable in all browsers.
 */
export async function tryOpenProtocol(uri: string): Promise<boolean> {
  return new Promise((resolve) => {
    let hasBlurred = false;
    const onBlur = () => {
      hasBlurred = true;
    };
    window.addEventListener('blur', onBlur);
    window.location.href = uri;
    setTimeout(() => {
      window.removeEventListener('blur', onBlur);
      resolve(hasBlurred);
    }, 1500);
  });
}