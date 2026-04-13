import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1536, height: 730 });

    try {
        await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 4000));
        await page.screenshot({ path: 'local_screenshot.png' });
        console.log('SCREENSHOT SAVED');
    } catch(e) {
        console.log('ERROR:', e.message);
    }
    
    await browser.close();
})();
