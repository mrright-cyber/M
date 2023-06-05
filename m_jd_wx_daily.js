let mode = __dirname.includes('magic')
const { Env } = mode ? require('../magic') : require('./magic')
const $ = new Env('M每日抢好礼');
$.activityUrl = process.env.M_WX_DAILY_URL
    ? process.env.M_WX_DAILY_URL
    : '';

if (mode) {
    $.activityUrl = 'https://cjhy-isv.isvjcloud.com/activity/daily/wx/indexPage?activityId=160701b656ed4091ae7dd54b2331ccd4'
    // $.activityUrl = 'https://lzkj-isv.isvjcloud.com/activity/daily/wx/indexPage?activityId=f067e2cc054c439db5b9b40ae3f2ad6f'
}
$.activityUrl = $.match(
    /(https?:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|])/,
    $.activityUrl)
$.domain = $.match(/https?:\/\/([^/]+)/, $.activityUrl)
$.activityId = $.getQueryString($.activityUrl, 'activityId')
$.actTimeStr = ''
$.content = ''
$.logic = async function () {
    if (!$.activityId || !$.activityUrl) {
        $.expire = true;
        $.putMsg(`activityId|activityUrl不存在`);
        return
    }
    $.domain = $.match(/https?:\/\/([^/]+)/, $.activityUrl)
    $.log(`活动地址: ${$.activityUrl}`)
    $.UA = $.ua();

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

    let { data } = await $.request($.activityUrl, { 'User-Agent': $.UA });
    $.actTimeStr = $.match(/(?<=actTimeStr\"[\s]value\=\")\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}\s至\s\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}(?=\"\>)/, data)[0];

    let actTimeStrs = $.actTimeStr.split(" 至 ");
    let startDate = new Date(actTimeStrs[0] + ":00");
    let endDate = new Date(actTimeStrs[1] + ":00");

    let giftJson = $.match(/(?<=giftJson\"[\s]value\=\')\{.*\}(?=\'\>)/, data)[0];
    $.content = JSON.parse(giftJson);
    if ($.timestamp() > endDate.getTime()) {
        $.putMsg(`活动已结束`);
        $.expire = true;
        return;
    }

    if ($.timestamp() < startDate.getTime()) {
        $.putMsg(`活动未开始`);
        $.expire = true;
        return;
    }

    let token = await $.isvObfuscator();
    if (token.code !== '0') {
        $.putMsg(`获取Token失败`);
        return
    }
    $.Token = token?.token;
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

    let draw = await $.api(`activity/daily/wx/grabGift`, `actId=${$.activityId}&pin=${$.Pin}&token=${$.Token}`);
    if (draw.isOk) {
        $.putMsg(`${draw?.gift?.gift?.name || draw?.gift?.gift?.giftName || '空气'}`);
    } else {
        $.putMsg(draw.msg)
        if(draw.msg.includes('您来晚了')){
            $.expire = true;
            return;
        }
    }
}

$.after = async function () {
    $.msg.push(`\n${(await $.getShopInfo())?.shopName || "未知"}`);
    $.msg.push(`${$.content.gift.giftName} 共${$.content.total}份`);
    $.msg.push(`活动时间：${$.actTimeStr}`);
    $.msg.push(`开抢时间：${$.content.hours}:${$.content.minutes}`);
    $.msg.push(`\nexport M_WX_DAILY_URL="${$.activityUrl}"`);
}
$.run({ whitelist: ['1-7'] }).catch(reason => $.log(reason));
