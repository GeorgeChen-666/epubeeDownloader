const { Chromeless } = require('chromeless');
const schedule = require('node-schedule');
const [,,uid] = process.argv;
async function run() {
  const chromeless = new Chromeless();
  console.log(new Date(),'开始！');
  await chromeless.goto('http://cn.epubee.com/files.aspx?sortkey=addtime&sort=asc&menukey=&menuvalue=&skeyinput=&iskindle=0&aff=0&prom=0').wait(5000);
  const isLogined = await chromeless.wait(1000).exists('a[id="gvBooks_gvBooks_child_0_hpdownload_0"]');
  let isAdVisable = false;
  if(!isLogined) {
    console.log(new Date(),'准备登录！');
    await chromeless.wait(5000).type('380465530@qq.com', 'input[id="retrieve_id"]');
    await chromeless.wait(5000).click('input[id="retrieve_btn"]').wait(20000);
  } else {
    console.log(new Date(),'不用登陆！');
  }
  isAdVisable = await chromeless.exists('a[id="TB_closeWindowButton"]')
  if (isAdVisable) {
    console.log(new Date(),'发现广告，关闭！');
    await chromeless.click('a[id="TB_closeWindowButton"]').wait(1000);
  }
  const isBookExist = await chromeless.wait(1000).exists('a[id="gvBooks_gvBooks_child_0_hpdownload_0"]')
  if(isBookExist) {
    console.log(new Date(),'发现电子书，准备下载！');
    await chromeless.click('a[id="gvBooks_gvBooks_child_0_hpdownload_0"]').wait(1000);
    isAdVisable = await chromeless.wait(1000).exists('a[id="TB_closeWindowButton"]')
    if (isAdVisable) {
      console.log(new Date(),'下载失败出现警告');
      await chromeless.click('a[id="TB_closeWindowButton"]').wait(1000);
    } else {
      console.log(new Date(),'删除第一条！');
      await chromeless.click('input[id="gvBooks_gvBooks_child_0_chk_child_0"]').wait(1000)
      .click('a[id="linkDelete"]').wait(1000)
      console.log(new Date(),'任务执行完毕，等待下载！');
      await chromeless.wait(1800000);
    }
  } else {
    console.log(new Date(),'未发现电子书！');
  }
  console.log(new Date(),'准备退出！');
  await chromeless.end();
}
//run().catch(console.error.bind(console))
schedule.scheduleJob('1 1 2-4 * * *',()=>{
  console.log('schedule:' + new Date());
  run().catch(console.error.bind(console))
});
