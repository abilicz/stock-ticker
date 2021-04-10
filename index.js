const yahoo = require('yahoo-stock-prices')

const Max7219 = require('max7219-display');
const controllerCount = 4;

const m = new Max7219({ device: '/dev/spidev0.0', controllerCount })

async function init() {
    for (let i = 0; i < controllerCount; i++) {
        await m.reset(i)
    }
    const data = await getStockData();
    console.log(data)
    await m.scroll(data, { scrollIn: true, loop: true, speed: 100 });
    await m.resetAll();
}

const tickers = ['PLTR', 'GME', 'CRM']

async function getStockData() {
    const results = await Promise.all(tickers.map(t => yahoo.getCurrentPrice(t)));
    const prices = tickers.map((e, index) => `${tickers[index]} - $${results[index]}`).join(' ');
    return `${new Date(Date.now()).toLocaleString('en-US')} ${prices}`
};

async function start() {
    while (true) {
        await init();
        await new Promise(res => setTimeout(res, 1000 * 30));
    }
}

start()
