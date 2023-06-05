let mode = __dirname.includes('magic')
const { Env } = mode ? require('../magic') : require('./magic')
const $ = new Env('M签到有礼INTERACT');
$.activityUrl = process.env.M_INTERACT_SIGN_URL
    ? process.env.M_INTERACT_SIGN_URL
    : '';

if (mode) {
    $.activityUrl = 'https://lzkj-isv.isvjcloud.com/prod/cc/interactsaas/index?activityType=10040&activityId=1652924296608022530&templateId=20210518190900qrqd011&nodeId=101001&prd=cjwx'
    $.activityUrl = 'https://lzkj-isv.isvjcloud.com/prod/cc/interactsaas/index?activityType=10023&templateId=20210518190900qrqd011&activityId=1650331967728201730&nodeId=101001&prd=cjwx'
    $.activityUrl = 'https://lzkj-isv.isvjcloud.com/prod/cc/interactsaas/index?activityType=10003&templateId=20201228083300ljqdsl011&activityId=1632579375971639297&nodeId=101001001&prd=cjwx'
    $.activityUrl = 'https://lzkj-isv.isvjcloud.com/prod/cc/interactsaas/index?activityType=10002&templateId=20201228083300ljqdsl011&activityId=1632579375971639297&nodeId=101001001&prd=cjwx'
    $.activityUrl = 'https://lzkj-isv.isvjcloud.com/prod/cc/interaction/v1/index?activityType=10003&templateId=20201228083300ljqdsl01&activityId=1656866603170844673&nodeId=101001001&prd=crm'
    $.activityUrl = 'https://lorealjdcampaign-rc.isvjcloud.com/interact/index?activityType=10040&activityId=1549690991705796610&templateId=2020122808330rlqd01&nodeId=101001&prd=crm'
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
$.apiLink = 'prod/cc/interactsaas';
$.signApi = `https://${$.domain}/${$.apiLink}/api/task/daySign/getSignClick`
$.signInfo = `https://${$.domain}/${$.apiLink}/api/task/daySign/activity`
if($.domain.includes('lorealjdcampaign')){
    $.apiLink = 'apps/interact'
    $.signApi = `https://${$.domain}/${$.apiLink}/api/task/daySign/getSignClick`
    $.signInfo = `https://${$.domain}/${$.apiLink}/api/task/daySign/activity`
}
else if($.activityUrl.includes('interaction/v1')){
    $.apiLink = 'prod/cc/interaction/v1'
    $.signApi = `https://${$.domain}/${$.apiLink}/api/task/sign/add`
    $.signInfo = `https://${$.domain}/${$.apiLink}/api/task/sign/activity`
}

if($.activityType == '10003'){
    $.signApi = `https://${$.domain}/${$.apiLink}/api/task/sign/add`
}

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
    $.Token = token?.token;
    let login = await $.api(`${$.apiLink}/api/user-info/login`, { "status": "1", "activityId": $.activityId, "tokenPin": $.Token, "source": "01", "shareUserId": "", "uuid": "" });
    if (!login.data) {
        $.putMsg(`活动已结束`);
        $.expire = true;
        return
    }
    let actToken = login.data.token;
    $.shopId = login.data.shopId;

    if ($.timestamp() > login.data.activityEndTime) {
        $.putMsg('签到活动已结束')
        $.expire = true;
        return;
    }
    $.log(login.data.joinInfo.joinCodeInfo.joinDes);
    if (login.data.joinInfo.joinCodeInfo.joinDes.includes('关注店铺')) {
        //关注店铺才能参与活动哦！
        let followShop = await $.request(`https://${$.domain}/${$.apiLink}/api/task/followShop/follow`, { "token": actToken });
        $.log("关注成功");
    }

    let { data } = await $.request($.signApi, { "token": actToken });
    if (data.data) {
        $.putMsg(data.data?.prizeName || '签到成功')
    }
    else {
        $.putMsg(data.resp_msg);
        if (data.resp_msg?.includes('已结束') || data.resp_msg?.includes('未开始')) {
            $.expire = true;
            return;
        }
    }
    let signInfo = await $.request($.signInfo, { "token": actToken });
    // $.log(signInfo)
    if (signInfo.data.data) {
        $.putMsg(`已签${signInfo.data.data.signNum}天`)
    }
    if (!$.content) {
        let rule = await $.request(`https://${$.domain}/${$.apiLink}/api/active/getRule`, { "token": actToken });
        $.content = rule.data.data;
    }
}

$.after = async function () {
    $.msg.push(`\n${(await $.getShopInfo())?.shopName || "未知"}`);
    $.msg.push($.content.includes('先到先得') ? $.content.split('先到先得')[0] : $.content.split('奖品发放')[0] || $.content)
    $.msg.push(`\nexport M_INTERACT_SIGN_URL="${$.activityUrl}"`);
}
$.run({ whitelist: ['1-5'] }).catch(reason => $.log(reason));

