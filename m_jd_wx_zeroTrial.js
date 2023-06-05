let mode = __dirname.includes('magic')
const { Env } = mode ? require('../magic') : require('./magic')
const $ = new Env('M0元试用');
$.activityUrl = process.env.M_WX_ZEROTRIAL_URL
    ? process.env.M_WX_ZEROTRIAL_URL
    : '';

if (mode) {
    $.activityUrl = 'https://cjhy-isv.isvjcloud.com/mc/zeroTrialView/wx/activity/forC/indexPage?venderId=1000002586&activityId=6667282875c54dff9159f63607630d7a&sid=5ae9c5bfa43454205fbbbdf581623dfw&un_area=1_2901_55561_0'
}
$.activityUrl = $.match(
    /(https?:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|])/,
    $.activityUrl)
$.domain = $.match(/https?:\/\/([^/]+)/, $.activityUrl)
$.activityId = $.getQueryString($.activityUrl, 'activityId')
$.activityType = $.getQueryString($.activityUrl, 'activityType')
$.actTimeStr = ''
$.content = ''
$.log(`活动地址: ${$.activityUrl}`)
const fs = require('fs');
let accountFile = './account.json';
let AccountFileexists = fs.existsSync(accountFile);
$.TempAccount = [];
if (AccountFileexists) {
    console.log("检测到account.json文件，载入...");
    $.TempAccount = fs.readFileSync(accountFile, 'utf-8');
    if ($.TempAccount) {
        $.TempAccount = $.TempAccount.toString();
        $.TempAccount = JSON.parse($.TempAccount);
    }
}
$.zeroTrialGoodsOutVOList = []

$.logic = async function () {
    if (!$.activityId || !$.activityUrl) {
        $.expire = true;
        $.putMsg(`activityId|activityUrl不存在`);
        return
    }
    $.UA = $.ua();
    let token = await $.isvObfuscator();
    if (token.code !== '0') {
        $.putMsg(`获取Token失败`);
        return
    }
    $.Token = token?.token
    let actInfo = await $.api('customer/getSimpleActInfoVo',
        `activityId=${$.activityId}`);
    if (!actInfo.result) {
        $.putMsg(`获取活动信息失败`);
        return
    }
    if (!actInfo.data) {
        $.putMsg(`活动已结束`);
        $.expire = true;
        return
    }
    $.venderId = actInfo.data.venderId;
    $.shopId = actInfo.data.shopId;
    $.activityType = actInfo.data.activityType;

    let myPing = await $.api('customer/getMyPing',
        `userId=${$.venderId}&token=${$.Token}&fromType=APP`)
    if (!myPing.result) {
        $.putMsg(`获取pin失败`);
        return
    }
    $.Pin = $.domain.includes('cjhy') ? encodeURIComponent(
        encodeURIComponent(myPing.data.secretPin)) : encodeURIComponent(
            myPing.data.secretPin);

    await $.api(
        `common/${$.domain.includes('cjhy') ? 'accessLog'
            : 'accessLogWithAD'}`,
        `venderId=${$.venderId}&code=${$.activityType}&pin=${$.Pin}&activityId=${$.activityId}&pageUrl=${encodeURIComponent(
            $.activityUrl)}&subType=app&adSource=`);
    if (!$.content) {
        $.content = await $.api(`mc/zeroTrial/wx/getActivityContent?activityId=${$.activityId}&pin=${$.Pin}`, '');
        $.actTimeStr = $.content.data.startTime + "至" + $.content.data.endTime;
        $.zeroTrialGoodsOutVOList = $.content.data.zeroTrialGoodsOutVOList;
    }
    for (let goods of $.zeroTrialGoodsOutVOList || []) {
        $.log(`申请试用：${goods.name}`)
        let applyTrial = await $.api(`mc/zeroTrial/wx/applyTrial`, `activityId=${$.activityId}&pin=${$.Pin}&goodsId=${goods.goodsId}&venderId=${$.venderId}&nickName=${encodeURIComponent(myPing.data.nickname)}`);
        // $.log(applyTrial);
        if (applyTrial.result) {
            let success = false;
            for (let p of $.TempAccount || []) {
                if (p.address && $.cookie.includes(p.pt_pin)) {
                    let result = await $.api(`wxAddress/save`, `generateId=${applyTrial.data}&venderId=${$.venderId}&pin=${$.Pin}&activityId=${$.activityId}&actType=111&prizeName=${encodeURIComponent(goods.name)}&isFollow=false&receiver=${encodeURIComponent(p.address.receiver)}&phone=${p.address.phone}&province=${encodeURIComponent(p.address.province)}&city=${encodeURIComponent(p.address.city)}&county=${encodeURIComponent(p.address.county)}&address=${encodeURIComponent(p.address.address)}&postalCode=${p.address.postalCode}`);
                    if (result.result) {
                        success = true;
                    }
                    else{
                        $.log(result);
                    }
                    break;
                }
            }
            if (success) {
                $.putMsg('申请成功');
            }
            else {
                $.putMsg('申请失败，可能未配置地址。');
                return;
            }
        }
        else {
            $.putMsg(applyTrial.errorMessage);
            if (applyTrial.errorMessage.includes('未开始') || applyTrial.errorMessage.includes('已结束')) {
                $.expire = true;
            }
            return;
        }
    }
}

$.after = async function () {
    $.msg.push(`\n${(await $.getShopInfo())?.shopName || "未知"}`);
    $.msg.push(`活动时间：${$.actTimeStr}`)
    $.zeroTrialGoodsOutVOList.forEach(p => {
        $.msg.push(`${p.name}，${p.price}元，共${p.sendNum}份`);
    });
    $.msg.push(`\nexport M_WX_ZEROTRIAL_URL="${$.activityUrl}"`);
}
$.run({ whitelist: ['1-5'], wait: [2000, 5000] }).catch(reason => $.log(reason));

