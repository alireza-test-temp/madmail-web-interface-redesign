export function generateRandomString(length: number = 10): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    result += chars.charAt(array[i] % chars.length);
  }
  return result;
}
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      textArea.style.top = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    }
  } catch (err) {
    console.error('Copy to clipboard failed:', err);
    return false;
  }
}
export function formatEmail(user: string, domain: string): string {
  const cleanUser = user.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanDomain = domain.trim().toLowerCase();
  return `${cleanUser}@${cleanDomain}`;
}
export interface DcLoginParams {
  email: string;
  password?: string;
  ssl?: boolean;
}
export function createDcLoginLink({ email, password, ssl = true }: DcLoginParams): string {
  const url = new URL(`dclogin:${email}`);
  if (password) url.searchParams.set('password', password);
  url.searchParams.set('ssl', ssl ? '1' : '0');
  return url.toString();
}
export async function tryOpenProtocol(uri: string): Promise<boolean> {
  return new Promise((resolve) => {
    let hasBlurred = false;
    const onBlur = () => { hasBlurred = true; };
    window.addEventListener('blur', onBlur);
    window.location.href = uri;
    setTimeout(() => {
      window.removeEventListener('blur', onBlur);
      resolve(hasBlurred);
    }, 1500);
  });
}