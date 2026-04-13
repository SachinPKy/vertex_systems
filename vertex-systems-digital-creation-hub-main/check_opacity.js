import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    await page.goto('https://vertex-systems-e46a5.web.app/', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 6000));
    
    // Check if hero is opacity 0
    try {
        const opacity = await page.evaluate(() => {
            const el = document.querySelector('h1')?.parentElement;
            if (!el) return 'no parent';
            return window.getComputedStyle(el).opacity;
        });
        console.log('HERO OPACITY:', opacity);
    } catch(e) {
        console.log(e);
    }
    
    // Check if splash screen is present
    try {
        const splash = await page.evaluate(() => document.querySelector('.bg-white')?.className);
        console.log('SPLASH CLASS:', splash);
    } catch(e) {
        console.log(e);
    }
    
    await browser.close();
})();
