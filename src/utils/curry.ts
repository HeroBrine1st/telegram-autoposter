
/**
 * Bind function to arguments. Any arguments to returned function will be added to the end of bound arguments
 * TODO: replace with lambdas
 * @param func function
 * @returns function which should be called in place with arguments to bind and which returns function with bound arguments
 */
function curry(func) {
  return function curried(...args) {
    if (args.length >= func.length) {
      return func.apply(this, args);
    } else {
      return function(...argsNext) {
        return curried.apply(this, args.concat(argsNext));
      }
    }
  }
}

export default curry;