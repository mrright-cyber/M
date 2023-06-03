let mode = __dirname.includes('magic')
const {Env} = mode ? require('../magic') : require('./magic')
const $ = new Env('M签到有礼');
$.activityUrl = process.env.M_WX_SHOP_SIGN_URL
    ? process.env.M_WX_SHOP_SIGN_URL
    : '';

if (mode) {
    $.activityUrl = 'https://lzkj-isv.isvjcloud.com/sign/signActivity2?activityId=bfafaaa4961b441a8e2bcb4b7de6bdf1#venderId=1000006201'
    $.activityUrl = 'https://cjhy-isv.isvjcloud.com/sign/signActivity?activityId=e4a77379ca4043b7b20fe09f006b7588&venderId=16888'
    $.activityUrl = 'https://lzkj-isv.isvjcloud.com/sign/signActivity2?activityId=bfafaaa4961b441a8e2bcb4b7de6bdf1&venderId=1000006201'
    $.activityUrl = 'https://lzkj-isv.isvjcloud.com/sign/sevenDay/signActivity?activityId=9997107887f249c489d1492a43e3e329&venderId=1000004641&adsource=tg_xuanFuTuBiao'
    $.activityUrl = 'https://lzkj-isv.isvjcloud.com/sign/signActivity2?activityId=6d58dc7941a8427e8d2220cbfdc7da60'
    $.activityUrl = 'https://cjhy-isv.isvjcloud.com/sign/sevenDay/signActivity?activityId=93d218e5d3c049f6ba168495c6244d7b'
    $.activityUrl = 'https://cjhy-isv.isvjcloud.com/sign/sevenDay/signActivity?activityId=7f2d8fd87672470083b64549ae2a0e3c&shopid=1000398820'
    $.activityUrl = 'https://cjhydz-isv.isvjcloud.com/sign/haier/signActivity?activityId=eab9078c8f814c93b8fbd5c80f69b4c0&venderId=1000001782'
    $.activityUrl = 'https://lzkj-isv.isvjcloud.com/sign/signActivity2?activityId=40c4db29ca18469bb951effbf699800d&shopid=1000000157'
    // $.activityUrl = 'https://cjhy-isv.isvjcloud.com/sign/signActivity?activityId=65d74b9b031f44b389560df48b907ff4&venderId=10497126'
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
    $.activityId = $.getQueryString($.activityUrl, 'activityId')
    $.domain = $.match(/https?:\/\/([^/]+)/, $.activityUrl)
    $.sevenDay = $.activityUrl.includes('sevenDay')
    $.log(`活动地址: ${$.activityUrl}`)
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
        `venderId=${$.venderId}&code=${$.activityType}&pin=${
            $.Pin}&activityId=${$.activityId}&pageUrl=${encodeURIComponent(
            $.activityUrl)}&subType=app&adSource=`);

    let activityContent = await $.api(
        `sign/${$.sevenDay ? 'sevenDay/' : ''}wx/getActivity`,
        `actId=${$.activityId}&venderId=${$.venderId}`);
    if (!activityContent.isOk) {
        $.putMsg(activityContent.msg || '活动可能已结束')
        $.expire = true;
        return
    }

    if ($.timestamp() > activityContent.act.endTime) {
        $.putMsg('签到活动已结束')
        $.expire = true;
        return;
    }
    
    $.actTimeStr = activityContent.act.actTimeStr;

    if (!$.content) {
        let gf = []
        if ($.sevenDay) {
            for (let giftCondition of
            activityContent.act?.giftBean?.giftConditions || []) {
                if (giftCondition.gift) {
                    giftCondition.gift.dayNum = giftCondition.dayNum
                    gf.push(giftCondition.gift);
                }
            }
        } else {
            //每日
            if (activityContent.act.wxSignActivityGiftBean.hasGiftEveryDay
                === 'y') {
                gf.push(activityContent.act.wxSignActivityGiftBean.gift);
            }

            //条件
            if (activityContent.act.wxSignActivityGiftBean.giftConditions.length
                > 0) {
                for (let giftCondition of
                    activityContent.act.wxSignActivityGiftBean.giftConditions) {
                    if (giftCondition.gift) {
                        giftCondition.gift.dayNum = giftCondition.dayNum
                        gf.push(giftCondition.gift);
                    }
                }
            }
        }
        $.content = gf;
    }

    let signInfo = await $.api(
        `sign/${$.sevenDay ? 'sevenDay/' : ''}wx/getSignInfo`,
        `venderId=${$.venderId}&pin=${$.Pin}&actId=${$.activityId}`)
    let countSign = $.sevenDay ? signInfo.contiSignDays
        : signInfo.signRecord.contiSignNum
    //没签
    if (($.sevenDay && signInfo.isSign === 'n') || (!$.sevenDay
        && signInfo.signRecord.lastSignDate !== $.now('yyyyMMdd') * 1)) {
        let signUp = await $.api(
            `sign/${$.sevenDay ? 'sevenDay/' : ''}wx/signUp`,
            `actId=${$.activityId}&pin=${$.Pin}`)
        if (signUp.isOk) {
            $.putMsg(
                `${signUp?.gift?.giftName || signUp?.signResult?.gift?.giftName
                || '空气'}`);
            countSign++;
        } else {
            $.log("签到成功");
            $.putMsg(signUp.msg)
        }
    }
    $.putMsg(`已签${countSign}天`)
}
let kv = {
    1: '券',
    6: '京豆',
    7: '实物',
    9: '积分',
    10: '券',
    17: '券',
}
$.after = async function () {
    $.msg.push(`\n${(await $.getShopInfo())?.shopName || "未知"}`);
    let message = ``;
    for (let ele of $.content || []) {
        message += `\n    ${ele?.dayNum
        || '每'}天 ${ele.giftName} ${!kv[ele?.giftType]
            ? ele?.giftType : ''}`
    }
    $.msg.push(message)
    $.msg.push(`活动时间：${$.actTimeStr}`)
    $.msg.push(`\nexport M_WX_SHOP_SIGN_URL="${$.activityUrl}"`);
}
$.run({whitelist: ['1-5'], wait: [2000, 5000]}).catch(reason => $.log(reason));

