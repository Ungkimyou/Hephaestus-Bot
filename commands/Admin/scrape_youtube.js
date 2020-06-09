const puppeteer = require('puppeteer')

module.exports = {
    name: 'admin-youtube-scrape',
    description: 'Launches YouTube Scraper',
    cooldown: 5,
    async execute(message, args) {

        const req_song = args.join()

        const browser = await puppeteer.launch()
        const page = await browser.newPage();

        await page.goto("https://www.youtube.com")

        try {

            await page.type('#search-form #search', req_song)
            console.log("Searching...")
            await page.click('#search #search-icon-legacy')
            await page.waitForSelector('.style-scope ytd-video-renderer')
            console.log('Loaded Results')
            const videos = await page.$$('.style-scope ytd-video-renderer')
            await videos[1].click()
            await page.waitForSelector('#player')
            console.log('Song Found')
            message.channel.send(`SONG FOUND: ${page.url()}`)
            await browser.close()

        } catch (e) {
            console.log(e)
        }
    }
};
