export const utf8ByteLength = (value) => new TextEncoder().encode(String(value)).byteLength;
