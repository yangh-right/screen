export default (promise) => {
    if (!promise || !(promise instanceof Promise)) {
        return new Promise((resolve, reject) => {
            reject(new Error("requires promises as the param"));
        }).catch((err) => {
            return [err, null];
        });
    }
    return promise.then(function() {
        return [null, ...arguments];
    }).catch(err => {
        return [err, null];
    });
};
