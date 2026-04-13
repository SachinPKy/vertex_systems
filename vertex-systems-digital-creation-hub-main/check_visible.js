import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('https://vertexsystemservices.web.app/', { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 6000));
    
    try {
        const text = await page.$eval('body', el => el.innerText);
        console.log('BODY TEXT LENGTH:', text.length);
        console.log('BODY TEXT PREVIEW:', text.substring(0, 500));
    } catch(e) {
        console.log('EVAL ERROR:', e.message);
    }
    
    await browser.close();
})();
