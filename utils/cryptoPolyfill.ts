// utils/cryptoPolyfill.ts
import * as Crypto from 'expo-crypto';

// Polyfill para crypto.getRandomValues
if (typeof global.crypto !== 'object') {
  global.crypto = {} as any;
}

if (typeof global.crypto.getRandomValues !== 'function') {
  global.crypto.getRandomValues = (array: Uint8Array) => {
    // Genera bytes aleatorios usando expo-crypto
    const randomBytes = Crypto.getRandomBytes(array.length);
    for (let i = 0; i < array.length; i++) {
      array[i] = randomBytes[i];
    }
    return array;
  };
}