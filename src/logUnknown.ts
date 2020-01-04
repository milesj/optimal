export default function logUnknown(unknownFields: object, pathPrefix?: string) {
  const unknownKeys = Object.keys(unknownFields);

  if (unknownKeys.length > 0) {
    const message = pathPrefix ? `Unknown "${pathPrefix}" fields` : 'Unknown fields';

    throw new Error(`${message}: ${unknownKeys.join(', ')}.`);
  }
}
