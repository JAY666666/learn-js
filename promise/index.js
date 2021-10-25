function PromiseTest(executor) {
  this.PromiseState = "pending";
  this.PromiseResult = null;

  this.resolveCallbacks = [];
  this.rejectCallbacks = [];

  const self = this;

  function resolve(data) {
    if (self.PromiseState !== "pending") return;
    self.PromiseState = "fulfilled";
    self.PromiseResult = data;
    setTimeout(() => {
      self.resolveCallbacks.forEach((fn) => {
        fn.onResolved(data);
      });
    }, 0);
  }

  function reject(data) {
    if (self.PromiseState !== "pending") return;
    self.PromiseState = "rejected";
    self.PromiseResult = data;
    setTimeout(() => {
      self.rejectCallbacks.forEach((fn) => {
        fn.onRejected(data);
      });
    }, 0);
  }
  try {
   executor(resolve, reject);
  } catch (error) {
    reject(error)
  }
}

PromiseTest.prototype.then = function (onResolved, onRejected) {
  const self = this;
  if (typeof onRejected !== "function") {
    onRejected = (reason) => {
      throw reason;
    };
  }

  if (typeof onResolved !== "function") {
    onResolved = (value) => value;
  }

  return new PromiseTest((resolve, reject) => {
    function callback(type) {
      try {
        let result = type(self.PromiseResult);
        // 判断是否是promise实例
        if (result instanceof PromiseTest) {
          result.then(
            (v) => {
              resolve(v);
            },
            (r) => {
              reject(r);
            }
          );
        } else {
          resolve(result);
        }
      } catch (error) {
        reject(error);
      }
    }
    if (this.PromiseState === "fulfilled") {
      setTimeout(() => {
        callback(onResolved);
      }, 0);
    }
    if (this.PromiseState === "rejected") {
      setTimeout(() => {
        callback(onRejected);
      }, 0);
    }
    if (this.PromiseState === "pending") {
      this.resolveCallbacks.push({
        onResolved: function () {
          callback(onResolved);
        }
      });
      this.rejectCallbacks.push({
        onRejected: function () {
          callback(onRejected);
        }
      });
    }
  });
};

PromiseTest.prototype.catch = function (onRejected) {
  return this.then(undefined, onRejected);
};

// 返回一个fulfilled状态的promise
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

// 直接返回一个reject(reason)
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