function pipe(...funcs: ((...args: any[]) => any)[]): any {
  return function (value: any) {
    for (let func of funcs) {
      value = func(value);
    }
    return value;
  }
}

export default pipe;