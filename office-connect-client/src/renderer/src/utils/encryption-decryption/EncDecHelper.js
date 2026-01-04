const encoder = new TextEncoder()
const decoder = new TextDecoder()

const currentUserId = await window.store.get('userId');

const toBase64 = (bytes) =>
  btoa(String.fromCharCode(...bytes))

const fromBase64 = (base64) =>
  Uint8Array.from(atob(base64), c => c.charCodeAt(0))

const generateKey = async (password) => {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password+currentUserId),
    'PBKDF2',
    false,
    ['deriveKey']
  )

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('fixed-salt'), // can improve later
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

export const encryptMessage = async (message, password) => {
  const iv = crypto.getRandomValues(new Uint8Array(12)) // 96-bit IV
  const key = await generateKey(password)

  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(message)
  )

  const encryptedBytes = new Uint8Array(encryptedBuffer)

  // Combine IV + encrypted data
  const combined = new Uint8Array(iv.length + encryptedBytes.length)
  combined.set(iv)
  combined.set(encryptedBytes, iv.length)

  // Return as Base64 string
  return toBase64(combined)
}

export const decryptMessage = async (encryptedString, password) => {
  const combinedBytes = fromBase64(encryptedString)

  // Extract IV & ciphertext
  const iv = combinedBytes.slice(0, 12)
  const encryptedBytes = combinedBytes.slice(12)

  const key = await generateKey(password)

  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    encryptedBytes
  )

  return decoder.decode(decryptedBuffer)
}
