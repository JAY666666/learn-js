function PromiseTest(executor) {
  debugger
  this.PromiseState = "pending";
  this.PromiseResult = null;

  this.callbacks = [];

  const self = this;

  function resolve(data) {
    debugger
    if (self.PromiseState !== "pending") return;
    self.PromiseState = "fulfilled";
    self.PromiseResult = data;
    setTimeout(() => {
      self.callbacks.forEach((fn) => {
        fn.onResolved(data);
      });
    });
  }

  function reject(data) {
    debugger
    if (self.PromiseState !== "pending") return;
    self.PromiseState = "rejected";
    self.PromiseResult = data;
    setTimeout(() => {
      self.callbacks.forEach((fn) => {
        fn.onRejected(data);
      });
    });
  }
  executor(resolve, reject);
}

PromiseTest.prototype.then = function (onResolved, onRejected) {
  debugger
  const self = this;
  console.log(typeof onResolved, '成功');
  console.log(typeof onRejected, '失败');
  if (typeof onRejected !== "function") {
    debugger
    onRejected = (reason) => {
      throw reason;
    };
  }

  if (typeof onResolved !== "function") {
    debugger
    onResolved = (value) => value;
  }

  return new PromiseTest((resolve, reject) => {
    debugger
    function callback(type) {
      debugger
      try {
        let result = type(self.PromiseResult);
        if (result instanceof PromiseTest) {
          debugger
          result.then(
            (v) => {
              resolve(v);
            },
            (r) => {
              reject(r);
            }
          );
        } else {
          debugger
          resolve(result);
        }
      } catch (error) {
        debugger
        reject(error);
      }
    }
    if (this.PromiseState === "fulfilled") {
      debugger
      setTimeout(() => {
        callback(onResolved);
      });
    }
    if (this.PromiseState === "rejected") {
      debugger
      setTimeout(() => {
        callback(onRejected);
      });
    }
    if (this.PromiseState === "pending") {
      debugger
      this.callbacks.push({
        onResolved: function () {
          debugger
          callback(onResolved);
        },
        onRejected: function () {
          debugger
          callback(onRejected);
        },
      });
    }
  });
};

PromiseTest.prototype.catch = function (onRejected) {
  debugger
  return this.then(undefined, onRejected);
};

PromiseTest.resolve = function (value) {
  return new PromiseTest((resolve, reject) => {
    if (value instanceof PromiseTest) {
      value.then(
        (v) => {
          resolve(v);
        },
        (r) => {
          reject(r);
        }
      );
    } else {
      resolve(value);
    }
  });
};

PromiseTest.reject = function (reason) {
  return new PromiseTest((resolve, reject) => {
    reject(reason);
  });
};

PromiseTest.all = function (promises) {
  return new PromiseTest((resolve, reject) => {
    let count = 0;
    let arr = [];
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(
        (v) => {
          count++;
          arr[i] = v;
          if (count === promises.length) {
            resolve(arr);
          }
        },
        (r) => {
          reject(r);
        }
      );
    }
  });
};

PromiseTest.race = function (promises) {
  return new PromiseTest((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(
        (v) => {
          resolve(v);
        },
        (r) => {
          reject(r);
        }
      );
    }
  });
};
