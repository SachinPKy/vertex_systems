import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
    
    await new Promise(r => setTimeout(r, 5000));
    const title = await page.title();
    console.log('PAGE TITLE:', title);
    
    const rootHtml = await page.$eval('#root', el => el.innerHTML);
    console.log('ROOT INNHERHTML LENGTH:', rootHtml.length);
    
    await browser.close();
})();
