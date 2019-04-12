/**
 * @module helpers
 */
import Warning from './Warning';

const warned: { [code: string]: boolean } = {};

const warnOnce = (warning: Warning) => {
  if (!warned[warning.code]) {
    warned[warning.code] = true;
    process.emitWarning(warning.message, warning.name);
  }
};

export default warnOnce;
