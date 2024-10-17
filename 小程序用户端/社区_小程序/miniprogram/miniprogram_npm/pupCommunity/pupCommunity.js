let pup = require("puppeteer");


(async()=>{
    const browser = await pup.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto("https://369cha.com/list/shequ"); //到达页面

    //开始模拟输入和点击事件
    let searchValue='广东省深圳市罗湖区东湖街道鹏城花园'
    await page.evaluate((searchValue) => {
        document.getElementsByClassName('form-control form-control-lg input-content mb-2')[0].value=searchValue;
        document.getElementsByClassName('btn btn-block btn-primary btn-lg')[0].click();
      },searchValue);
      await page.waitForTimeout(1000);
    //等待一会
    const shequName= await page.evaluate(() => {
        const shequ=document.getElementsByClassName('widget-box')[1].getElementsByTagName('P')[1].getElementsByTagName('a')[0].text;
        return shequ
       
      });
    
    //获取数据
    console.log(shequName)

})();
