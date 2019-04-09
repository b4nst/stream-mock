import { WARNINGS } from '../constant';

import Warning from './Warning';

const warned: { [code: string]: boolean } = {};

export default (warning: Warning) => {
  if (!warned[warning.code]) {
    warned[warning.code] = true;
    process.emitWarning(warning.message, warning.name);
  }
};
