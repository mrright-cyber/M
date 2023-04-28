//1 12,16,20,21,22,23 3-8 3 * m_jd_redbag.js

let mode = __dirname.includes('magic')
const {Env} = require('./magic');
const $ = new Env('M红包雨');
$.logic = async function () {
    const url = `https://api.m.jd.com/?functionId=wheelsLottery&body={%22linkId%22:%227m_tf2OArtOndOSDV7IWeQ%22}&t=1678278162003&appid=activities_platform&client=ios&clientVersion=11.6.3&h5st=20230308202242005%3B8103164417678297%3Bbd6c8%3Btk02w991a1ba718n9JT9HsVyNfcdemlNVr1krTCF02y5Q2lATxnp5jnP4HgJAJ8NP01%2BJcpnt%2FrzDUUu5K5pll6VENrW%3Be339ca23e0eb6605403426e8f3cb0cced5859970726d814ab6f8a23be07d49bc%3B3.1%3B1678278162005%3B7414c4e56278580a133b60b72a30beb2764d2e61c66a5620e8e838e06644d1bf3581033e4e2698056d1ea7a7f14277e3e6eba18ac8ac0c77d31828476a80a929cf3b2efeb2a79b4474b6e5b00f763f6313b4d83d2f8435ee3a30d9ae4e91e8692d410e6935060d29c593dd008e8d131e5049f3aa5d62703b829478be32d586d4&cthr=1&uuid=70492ed7d2e0f3c29baa49e8f4a45a3812d922a3&build=168563&screen=390*844&networkType=wwan&d_brand=iPhone&d_model=iPhone13,2&lang=zh_CN&osVersion=16.2&partner=&eid=eidIde5c812183sbwkZEkK6%2FTCezMUyGy3rdu8JGRgfcBCAt40UcQi3vl8KucZUDXY9IDHh3YGNPj%2BnDWMIUs19jQaju%2FLkzCeIe030URPX5cdlBMNhF`;
const headers = {
'Accept-Encoding' : `gzip, deflate, br`,
'Origin' : `https://prodev.m.jd.com`,
'Cookie' : `__jd_ref_cls=Babel_dev_expo_other_partydraw_prizemodal; mba_muid=16643663934891248679810.2940.1678278158651; mba_sid=2940.113; joyya=1678277905.1678278148.49.0kjf8f7; unpl=JF8EALRnNSttDUgABxIFTEVCS1tRW1pYGB9TPDJXU1hdHAZSHlIcEhV7XlVdXxRKFR9uZRRUXlNPVQ4fBysSEHtdVV9dAU0XC2xkNVRZUUM6BRwKdRIgSFxUXl4MSxULa1cGVG1Ze1QCHQYeGxRKVVxdXwBLEApoYgRcWl5IZAQrAhMVIHttVW5dC04XA19mNQIzWEpVBBkAGRoZThBUWVsMTh4Hbm8NV19QS1MMHAcaGhdNXmRfbQs%7CJF8EAOBnNSttXkhdBhoFHUAXGF9cW14OQ0dUaG4AA15YG1cFSVBJFUJ7XlVdXxRKFx9vYBRXXVNIXQ4bAysSFHteVV1ZCkMXA2tvNVRVWkxUABIEKxIVSTNWWVgAQxIEaGNrVF02e1cFKwMrFBFOVVcKCA4eFFduMAcGXlAYBFUeCk8bR04NUVoNCkIXADpvBlcNWntVNRIDKxIRSlpXXlkKShAHbmEMZG1Ze1U1GjJafBBOXldYX0VNFgZnZFEBWw1IAARMAEkRGBgNBFtVXEJABj9iAQRfUUtXUBMBGEISe1xkXg; joyytokem=babel_2iKbfCXwhMX2SVuGDFEcKcDjbtUCMDFzVEVyRjk5MQ==.QmJySnREY3xCcEplcQxwRmAgHjRDYy1KOEJ4c153X2U7QDhCKitGHAA7djF1PhYdQhcJFgg4LDE9FRwXDSo=.5bb8fa7c; shshshfpb=n4Zso3C3MBX0QzBMJjBiPnQ; __jda=122270672.16643663934891248679810.1664366393.1678274082.1678277893.812; __jdb=122270672.4.16643663934891248679810|812.1678277893; __jdc=122270672; __jdv=122270672%7Ckong%7Ct_1001871922_1589_169_1%7Cjingfen%7Cd2e386ffc17446ab9abdc644fcf4a614%7C1677819055233; pre_seq=1; pre_session=70492ed7d2e0f3c29baa49e8f4a45a3812d922a3|13950; shshshfp=e4bda1c92831dc9004f133bf1396e0f6; shshshfpa=a9ecb964-b769-4f74-9e8b-243812d9e7fa-1648739411; shshshfpv=JD0111d47dVYfR9Kggk0167827789106603Bb35fTmE3aOWdu9VWy5ROQzBitdwiCDP3uGzZ0KOIyFVGVc0ZD5yDrL8MU0Bdg2fn2ZEuTlWHBxmyV2HuBRx0P1GD0tS5CAa19ldi-9cheQ0k56zhn~yUzWCso5+b+aExnsJ75CMl+GdvzpdnOi/1hAPGA/Id0WvpomuzismniEZG3M1k6y1Ag67QamaThuVu9Y9sdb2Aw==; shshshfpx=a9ecb964-b769-4f74-9e8b-243812d9e7fa-1648739411; shshshsID=2edbebe86e54a5ec21cf626a4a9d76f5_1_1678277905929; ${$.cookie}; sid=8dc6cffa0553f15ff1bae3405a72058w; 3AB9D23F7A4B3C9B=RBEJYYRTASB6C6YQO4YBCJ3WE6GNLWOX4UVR2IHQRC6BSSORDUIO6E3YCLA4BVI4FZORN67OCG2ZTR4VXCSCVYSL4Q; qid_ls=1678187043039; qid_ts=1678194099304; qid_vis=5; wxa_level=1; _gia_s_local_fingerprint=fad08c994276a0babe47083786658c1d; BATQW722QTLYVCRD={"tk":"jdd012L7TBEC72CQWSGNH6O5LKOQA7IAPGTPAY4YW5SZCJFKUH4DHR7JWRKPX6HFC2UOFVUKSKFRTSSMQTSHGO7V7TH6OYUVHJYPVMTAFLWA01234567","t":1678192343001}; ipLoc-djd=1_72_55678_0; qid_fs=1676864319014; qid_uid=d2c496ce-8449-4f30-b841-ce0958d20565; __wga=1676430653745.1676430653745.1675520527773.1672809063215.1.11; cid=8; retina=1; visitkey=3872475373335930; jcap_dvzw_fp=GMsJLJOTCwuSojJnD1YQLeKRT5jwY1Cdoqh94vYx8tzWj4B2LLO0euOqUZeSCat3Grdh8A==; webp=1; b_avif=1; cartLastOpTime=; cartNum=3; b_dh=844; b_dpr=3; b_dw=390; b_webp=1; abtest=20221018125606348_49; TrackID=1b37lYKjRc675ebRCo-lBoKcVe_smbwQd4nbDSbgyZOBzOzq_IPEGz11_4WoBD7JwUjZ6PUZ8rl7Y83ofjVWs2UiWmMF19oJiyqvb3NnrIpIH3wjcUHywqFGpFM6QCmHi; pinId=L2NgiCzuHKY`,
'Connection' : `keep-alive`,
'Accept' : `application/json, text/plain, */*`,
'Host' : `api.m.jd.com`,
'User-Agent' : `jdapp;iPhone;11.6.3;;;M/5.0;appBuild/168563;jdSupportDarkMode/1;ef/1;ep/%7B%22ciphertype%22%3A5%2C%22cipher%22%3A%7B%22ud%22%3A%22DzK0EJTvZNduCwUmZtDtCtvsYWO0EWU4ZtHrDNVrCzqnCwG5CtTrCm%3D%3D%22%2C%22sv%22%3A%22CJYkCq%3D%3D%22%2C%22iad%22%3A%22%22%7D%2C%22ts%22%3A1678277902%2C%22hdid%22%3A%22JM9F1ywUPwflvMIpYPok0tt5k9kW4ArJEU3lfLhxBqw%3D%22%2C%22version%22%3A%221.0.3%22%2C%22appname%22%3A%22com.360buy.jdmobile%22%2C%22ridx%22%3A-1%7D;Mozilla/5.0 (iPhone; CPU iPhone OS 16_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;`,
'Referer' : `https://prodev.m.jd.com/mall/active/2iKbfCXwhMX2SVuGDFEcKcDjbtUC/index.html?tttparams=jIkbm3IeyJnTGF0IjoiMzkuODc3MjMiLCJ1bl9hcmVhIjoiMV8yODA5XzUxMjMwXzAiLCJkTGF0IjoiIiwicHJzdGF0ZSI6IjAiLCJhZGRyZXNzSWQiOiIxMzc2Njg2MTgiLCJsYXQiOiIzOS45MDk4NjkiLCJwb3NMYXQiOiIzOS44NzcyMyIsInBvc0xuZyI6IjExNi43MDQxNSIsImdwc19hcmVhIjoiMV83Ml81NTY3OF8wIiwibG5nIjoiMTE2LjU3NTIwMyIsImdMbmciOiIxMTYuNzA0MTUiLCJtb2RlbCI6ImlQaG9uZTEzLDIiLCJkTG5nIjoiIn70%3D&babelChannel=ttt2&jumpFrom=1`,
'Accept-Language' : `zh-CN,zh-Hans;q=0.9`,
'request-from' : `native`
};
   let a=0
   while(a<100){
      a++
    let {data} = await $.request(url, headers, "");

        $.log(data)}
    
};
$.run({whitelist: ["1-7"]}).then(value => {
}).catch(reason => {
})
