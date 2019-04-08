export enum WARNING_TYPES {
  DEPRECATED = 'DeprecationWarning'
}

export default class Warning extends Error {
  code: string;
  constructor(msg: string, name: WARNING_TYPES, code: string) {
    super(msg);
    this.name = name;
    this.code = code;
  }
}
