import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

    await page.goto('https://vertex-systems-e46a5.web.app/', { waitUntil: 'load' });
    
    await new Promise(r => setTimeout(r, 5000));
    const title = await page.title();
    console.log('PAGE TITLE:', title);
    
    try {
        const rootHtml = await page.$eval('#root', el => el.innerHTML);
        console.log('ROOT INNHERHTML LENGTH:', rootHtml.length);
        console.log('ROOT CONTENT:', rootHtml.substring(0, 500));
    } catch(e) {
        console.log('EVAL ERROR:', e.message);
    }
    
    await browser.close();
})();
