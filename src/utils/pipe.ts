function pipe(...funcs: ((...args: any[]) => any)[]): any {
  return function (value: any) {
    for (const func of funcs) {
      value = func(value);
    }
    return value;
  }
}

export default pipe;