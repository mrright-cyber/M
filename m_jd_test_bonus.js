let mode = __dirname.includes('magic')
const {Env} = require('./magic');
const $ = new Env('M中奖测试');

$.logic = async function () {
    if ($.index === 1) {
        console.log($.accounts);
    }
    console.log($.username)
    console.log($.accounts[$.username]?.address);
};
$.run({whitelist: ["1-7"]}).then(value => {
}).catch(reason => {
})
