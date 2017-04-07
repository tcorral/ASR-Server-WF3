/* */ 
const stringify = require('json-stringify-safe');
const apiCheckUtil = require('./api-check-util');
const {each,
  isError,
  t,
  arrayify,
  getCheckerDisplay,
  typeOf,
  getError} = apiCheckUtil;
const checkers = require('./checkers');
const apiCheckApis = getApiCheckApis();
module.exports = getApiCheckInstance;
module.exports.VERSION = VERSION;
module.exports.utils = apiCheckUtil;
module.exports.globalConfig = {
  verbose: false,
  disabled: false
};
const apiCheckApiCheck = getApiCheckInstance({output: {prefix: 'apiCheck'}});
module.exports.internalChecker = apiCheckApiCheck;
each(checkers, (checker, name) => module.exports[name] = checker);
function getApiCheckInstance(config = {}, extraCheckers = {}) {
  if (apiCheckApiCheck && arguments.length) {
    apiCheckApiCheck.throw(apiCheckApis.getApiCheckInstanceCheckers, arguments, {prefix: 'creating an apiCheck instance'});
  }
  const additionalProperties = {
    throw: getApiCheck(true),
    warn: getApiCheck(false),
    getErrorMessage,
    handleErrorMessage,
    config: {
      output: config.output || {
        prefix: '',
        suffix: '',
        docsBaseUrl: ''
      },
      verbose: config.verbose || false,
      disabled: config.disabled || false
    },
    utils: apiCheckUtil
  };
  each(additionalProperties, (wrapper, name) => apiCheck[name] = wrapper);
  const disabled = apiCheck.disabled || module.exports.globalConfig.disabled;
  each(checkers.getCheckers(disabled), (checker, name) => apiCheck[name] = checker);
  each(extraCheckers, (checker, name) => apiCheck[name] = checker);
  return apiCheck;
  function apiCheck(api, args, output) {
    if (apiCheck.config.disabled || module.exports.globalConfig.disabled) {
      return {
        apiTypes: {},
        argTypes: {},
        passed: true,
        message: '',
        failed: false
      };
    }
    checkApiCheckApi(arguments);
    if (!Array.isArray(api)) {
      api = [api];
      args = [args];
    } else {
      args = Array.prototype.slice.call(args);
    }
    let messages = checkEnoughArgs(api, args);
    if (!messages.length) {
      messages = checkApiWithArgs(api, args);
    }
    const returnObject = getTypes(api, args);
    returnObject.args = args;
    if (messages.length) {
      returnObject.message = apiCheck.getErrorMessage(api, args, messages, output);
      returnObject.failed = true;
      returnObject.passed = false;
    } else {
      returnObject.message = '';
      returnObject.failed = false;
      returnObject.passed = true;
    }
    return returnObject;
  }
  function checkApiCheckApi(checkApiArgs) {
    const api = checkApiArgs[0];
    const args = checkApiArgs[1];
    const isArrayOrArgs = Array.isArray(args) || (args && typeof args === 'object' && typeof args.length === 'number');
    if (Array.isArray(api) && !isArrayOrArgs) {
      throw new Error(getErrorMessage(api, [args], ['If an array is provided for the api, an array must be provided for the args as well.'], {prefix: 'apiCheck'}));
    }
    const errors = checkApiWithArgs(apiCheckApis.checkApiCheckApi, checkApiArgs);
    if (errors.length) {
      const message = apiCheck.getErrorMessage(apiCheckApis.checkApiCheckApi, checkApiArgs, errors, {prefix: 'apiCheck'});
      apiCheck.handleErrorMessage(message, true);
    }
  }
  function getApiCheck(shouldThrow) {
    return function apiCheckWrapper(api, args, output) {
      const result = apiCheck(api, args, output);
      apiCheck.handleErrorMessage(result.message, shouldThrow);
      return result;
    };
  }
  function handleErrorMessage(message, shouldThrow) {
    if (shouldThrow && message) {
      throw new Error(message);
    } else if (message) {
      console.warn(message);
    }
  }
  function getErrorMessage(api, args, messages = [], output = {}) {
    const gOut = apiCheck.config.output || {};
    const prefix = getPrefix();
    const suffix = getSuffix();
    const url = getUrl();
    const message = `apiCheck failed! ${messages.join(', ')}`;
    const passedAndShouldHavePassed = '\n\n' + buildMessageFromApiAndArgs(api, args);
    return `${prefix} ${message} ${suffix} ${url || ''}${passedAndShouldHavePassed}`.trim();
    function getPrefix() {
      let p = output.onlyPrefix;
      if (!p) {
        p = `${gOut.prefix || ''} ${output.prefix || ''}`.trim();
      }
      return p;
    }
    function getSuffix() {
      let s = output.onlySuffix;
      if (!s) {
        s = `${output.suffix || ''} ${gOut.suffix || ''}`.trim();
      }
      return s;
    }
    function getUrl() {
      let u = output.url;
      if (!u) {
        u = gOut.docsBaseUrl && output.urlSuffix && `${gOut.docsBaseUrl}${output.urlSuffix}`.trim();
      }
      return u;
    }
  }
  function buildMessageFromApiAndArgs(api, args) {
    let {apiTypes,
      argTypes} = getTypes(api, args);
    const copy = Array.prototype.slice.call(args || []);
    const replacedItems = [];
    replaceFunctionWithName(copy);
    const passedArgs = getObjectString(copy);
    argTypes = getObjectString(argTypes);
    apiTypes = getObjectString(apiTypes);
    return generateMessage();
    function replaceFunctionWithName(obj) {
      each(obj, (val, name) => {
        if (replacedItems.indexOf(val) === -1) {
          replacedItems.push(val);
          if (typeof val === 'object') {
            replaceFunctionWithName(obj);
          } else if (typeof val === 'function') {
            obj[name] = val.displayName || val.name || 'anonymous function';
          }
        }
      });
    }
    function getObjectString(types) {
      if (!types || !types.length) {
        return 'nothing';
      } else if (types && types.length === 1) {
        types = types[0];
      }
      return stringify(types, null, 2);
    }
    function generateMessage() {
      const n = '\n';
      let useS = true;
      if (args && args.length === 1) {
        if (typeof args[0] === 'object' && args[0] !== null) {
          useS = !!Object.keys(args[0]).length;
        } else {
          useS = false;
        }
      }
      const types = `type${useS ? 's' : ''}`;
      const newLine = n + n;
      return `You passed:${n}${passedArgs}${newLine}` + `With the ${types}:${n}${argTypes}${newLine}` + `The API calls for:${n}${apiTypes}`;
    }
  }
  function getTypes(api, args) {
    api = arrayify(api);
    args = arrayify(args);
    const apiTypes = api.map((checker, index) => {
      const specified = module.exports.globalConfig.hasOwnProperty('verbose');
      return getCheckerDisplay(checker, {
        terse: specified ? !module.exports.globalConfig.verbose : !apiCheck.config.verbose,
        obj: args[index],
        addHelpers: true
      });
    });
    const argTypes = args.map((arg) => getArgDisplay(arg, []));
    return {
      argTypes,
      apiTypes
    };
  }
}
function checkApiWithArgs(api, args) {
  const messages = [];
  let failed = false;
  let checkerIndex = 0;
  let argIndex = 0;
  let arg,
      checker,
      res,
      lastChecker,
      argName,
      argFailed,
      skipPreviousChecker;
  while ((checker = api[checkerIndex++]) && (argIndex < args.length)) {
    arg = args[argIndex++];
    argName = 'Argument ' + argIndex + (checker.isOptional ? ' (optional)' : '');
    res = checker(arg, 'value', argName);
    argFailed = isError(res);
    lastChecker = checkerIndex >= api.length;
    skipPreviousChecker = checkerIndex > 1 && api[checkerIndex - 1].isOptional;
    if ((argFailed && lastChecker) || (argFailed && !lastChecker && !checker.isOptional && !skipPreviousChecker)) {
      failed = true;
      messages.push(getCheckerErrorMessage(res, checker, arg));
    } else if (argFailed && checker.isOptional) {
      argIndex--;
    } else {
      messages.push(`${t(argName)} passed`);
    }
  }
  return failed ? messages : [];
}
checkerTypeType.type = 'function with __apiCheckData property and `${function.type}` property';
function checkerTypeType(checkerType, name, location) {
  const apiCheckDataChecker = checkers.shape({
    type: checkers.string,
    optional: checkers.bool
  });
  const asFunc = checkers.func.withProperties({__apiCheckData: apiCheckDataChecker});
  const asShape = checkers.shape({__apiCheckData: apiCheckDataChecker});
  const wrongShape = checkers.oneOfType([asFunc, asShape])(checkerType, name, location);
  if (isError(wrongShape)) {
    return wrongShape;
  }
  if (typeof checkerType !== 'function' && !checkerType.hasOwnProperty(checkerType.__apiCheckData.type)) {
    return getError(name, location, checkerTypeType.type);
  }
}
function getCheckerErrorMessage(res, checker, val) {
  let checkerHelp = getCheckerHelp(checker, val);
  checkerHelp = checkerHelp ? ' - ' + checkerHelp : '';
  return res.message + checkerHelp;
}
function getCheckerHelp({help}, val) {
  if (!help) {
    return '';
  }
  if (typeof help === 'function') {
    help = help(val);
  }
  return help;
}
function checkEnoughArgs(api, args) {
  const requiredArgs = api.filter((a) => !a.isOptional);
  if (args.length < requiredArgs.length) {
    return ['Not enough arguments specified. Requires `' + requiredArgs.length + '`, you passed `' + args.length + '`'];
  } else {
    return [];
  }
}
function getArgDisplay(arg, gottenArgs) {
  const cName = arg && arg.constructor && arg.constructor.name;
  const type = typeOf(arg);
  if (type === 'function') {
    if (hasKeys()) {
      const properties = stringify(getDisplayIfNotGotten());
      return cName + ' (with properties: ' + properties + ')';
    }
    return cName;
  }
  if (arg === null) {
    return 'null';
  }
  if (type !== 'array' && type !== 'object') {
    return type;
  }
  if (hasKeys()) {
    return getDisplayIfNotGotten();
  }
  return cName;
  function hasKeys() {
    return arg && Object.keys(arg).length;
  }
  function getDisplayIfNotGotten() {
    if (gottenArgs.indexOf(arg) !== -1) {
      return '[Circular]';
    }
    gottenArgs.push(arg);
    return getDisplay(arg, gottenArgs);
  }
}
function getDisplay(obj, gottenArgs) {
  const argDisplay = {};
  each(obj, (v, k) => argDisplay[k] = getArgDisplay(v, gottenArgs));
  return argDisplay;
}
function getApiCheckApis() {
  const os = checkers.string.optional;
  const checkerFnChecker = checkers.func.withProperties({
    type: checkers.oneOfType([checkers.string, checkerTypeType]).optional,
    displayName: checkers.string.optional,
    shortType: checkers.string.optional,
    notOptional: checkers.bool.optional,
    notRequired: checkers.bool.optional
  });
  const getApiCheckInstanceCheckers = [checkers.shape({
    output: checkers.shape({
      prefix: checkers.string.optional,
      suffix: checkers.string.optional,
      docsBaseUrl: checkers.string.optional
    }).strict.optional,
    verbose: checkers.bool.optional,
    disabled: checkers.bool.optional
  }).strict.optional, checkers.objectOf(checkerFnChecker).optional];
  const checkApiCheckApi = [checkers.typeOrArrayOf(checkerFnChecker), checkers.any.optional, checkers.shape({
    prefix: os,
    suffix: os,
    urlSuffix: os,
    onlyPrefix: os,
    onlySuffix: os,
    url: os
  }).strict.optional];
  return {
    checkerFnChecker,
    getApiCheckInstanceCheckers,
    checkApiCheckApi
  };
}
