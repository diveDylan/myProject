const puppeteer = require('puppeteer');
(async () => {

  const browser = await puppeteer.launch({headless: false, args: [ '--window-size=1920,1080']});
  const page = await browser.newPage();
  // 全局请求过滤
  await page.on('response', response => {
    if(response.request().resourceType() !== 'xhr') return;
    let url = response.url();
    let isOk = response.ok() ? '[ok]' : '[fail]';
    if(isOk === '[fail') {
      response.text()
        .then(res => {
          console.log('fail', url, res);
        })
    }else {
      console.log('ok', url);
    }
  })
  const BaseUrl = 'http://localhost:3000/#/'
  page.setViewport({
    width: 1920,
    height: 1080,
    // isLandscape: true
  });

  //  登录
  await page.goto(`${BaseUrl}login`);
  // admin
  await page.type('[name="username"]', '1127574914@qq.com');
  // 会员机构
  // await page.type('[name="username"]', '949440946@qq.com');
  // 报关机构
  // await page.type('[name="username"]', 'dylan_zeng92@qq.com');
  await page.type('[name="password"]', '12345678a', { delay: 100});
  await page.click('.el-button--primary');
  // 钻石管理
  await page.waitFor(1000);
  await page.click('#tab-2')
  await page.waitFor(1000);
  let urlList = [
    { url: 'contract', click: [{ btn: 0, tab: false},{btn: 1, tab: true}],},
    { url: 'diamond', click: [{btn: 0, tab: true}], }, 
    { url: 'audit', click: [{btn: 0}],  }, 
    { url: 'account' },
    { url: 'userIndex' }
  ]

  for(let index = 0; index < urlList.length; index++){
    let { url, click=null } = urlList[index]
    console.log('b',index, click)
    if(click)
     {
      //  btnIndex.forEach(async(i, index) => {
      for(let i = 0; i < click.length; i ++) {
        let clickIndex = click[i].btn
        let tab = click[i].tab
        await page.goto(`${BaseUrl}${url}`,{ waitUntil: ['networkidle2', 'load', 'domcontentloaded'] });
        await page.waitForSelector('.el-button--text');
        
        // 处理el-button的点击详情
        await page.$$('.el-button--text');
        await page.waitFor(1000);
        if(await page.$$('.el-button--text')) {
          console.log(i,'222')
          await (await page.$$('.el-button--text'))[clickIndex].click()
          await page.waitFor(1000);
        }
        // 处理tab详情
        console.log('tab', tab)
        if(tab) {
          await page.waitForSelector('.el-tabs__item');
          await page.waitFor(1000);
          console.log(await page.$$('.el-tabs__item'))
          if(await page.$$('.el-tabs__item')){
            for(let index = 0; index < (await page.$$('.el-tabs__item')).length; index++) {
              if(index !== 0) {
                await (await page.$$('.el-tabs__item'))[index].click()
                await page.waitFor(1000)
              }
            }
          }
        }
        
      }
    }else {
      // console.log(index)
      await page.goto(`${BaseUrl}${url}`,{ waitUntil: ['networkidle2', 'load', 'domcontentloaded'] });
      await page.waitFor(1000)
    }
  }


})()



