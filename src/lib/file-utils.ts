export async function readFileAsText(file: File) {
  return file.text();
}

export async function fileToBase64(file: File) {
  const buffer = await file.arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(buffer);

  for (let index = 0; index < bytes.length; index += 1) {
    binary += String.fromCharCode(bytes[index]);
  }

  return btoa(binary);
}

export async function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export async function hashFile(file: File) {
  const digest = await crypto.subtle.digest("SHA-256", await file.arrayBuffer());
  const bytes = Array.from(new Uint8Array(digest));

  return bytes.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function encodeUtf8Base64(value: string) {
  const encoded = new TextEncoder().encode(value);
  let binary = "";

  encoded.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary);
}
