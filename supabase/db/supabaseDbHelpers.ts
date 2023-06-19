export function getValuesFromKeys(keys: any, object: any) {
  return keys
    .map((key: any) => {
      const value = object[key];
      return typeof value == 'object' ? JSON.stringify(value) : value;
    })
    .map((it: any) => `'${it}'`);
}
