export function serial(...func: (Function | undefined)[]) {
  return function (...args: any[]) {
    func.forEach((func, idx) => {
      try {
        func?.apply(null, args);
      } catch (err) {
        console.error(
          `The error happened at serial function, name: ${func.name} idx: ${idx}`,
          err,
        );
      }
    });
  };
}
