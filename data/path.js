import { isValidStringProperty } from "../validation/string";

export function buildObjectsPath(id, className) {
  let path = `/objects`;
  if (isValidStringProperty(className)) {
    path = `${path}/${className}`;
  }
  return `/${path}/${id}`;
}
