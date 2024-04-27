//Jest
const {getChangedFilesForRoots} = require('jest-changed-files');
const {diff} = require('jest-diff');
const {getType} = require('jest-get-type');
const {format: prettyFormat} = require('pretty-format');

//Classes
Stock = require('./classes/Stock.js');
StockList = require('./classes/StockList.js');
Strategy = require('./classes/Strategy.js');
Agent = require('./classes/Agent.js');

describe('Core Functionality', () => {
    describe('StockList', () => {
        test('StockList should add a stock to the list', () => {
            let stockList = new StockList();
            stockList.addStock(new Stock('AAPL', 100));
            expect(stockList.getStock('AAPL').getPrice()).toBe(100);
        });

        test('StockList should remove a stock from the list', () => {
            let stockList = new StockList();
            stockList.addStock(new Stock('AAPL', 100));
            stockList.removeStock('AAPL');
            expect(stockList.getStock('AAPL')).toBe(undefined);
        });

        test('StockList should update a stock price', () => {
            let stockList = new StockList();
            stockList.addStock(new Stock('AAPL', 100));
            stockList.updateStockPrice('AAPL', 200);
            expect(stockList.getStock('AAPL').getPrice()).toBe(200);
        });

        test('StockList should clone a stock list', () => {
            let stockList = new StockList();
            stockList.addStock(new Stock('AAPL', 100));
            stockList.addStock(new Stock('GOOGL', 200));
            let clonedStockList = stockList.clone();
            expect(clonedStockList.equals(stockList)).toBe(true);
        });
    });

    describe('Agent', () => {
        test('Agent should buy stock worth a certain amount of cash', () => {
            let stockList = new StockList();
            stockList.addStock(new Stock('AAPL', 100));
            let testAgent = new Agent(1000, {}, Strategy.randomStrategy);
            testAgent.buyStockWorth(stockList.getStock('AAPL'), 500);
            expect(testAgent.getPortfolio()).toStrictEqual({ AAPL: 5 });
        });

        test('Agent should sell stock worth a certain amount of cash', () => {
            let stockList = new StockList();
            stockList.addStock(new Stock('AAPL', 100));
            let testAgent = new Agent(1000, { AAPL: 5 }, Strategy.randomStrategy);
            testAgent.sellStockWorth(stockList.getStock('AAPL'), 500);
            expect(testAgent.getPortfolio()).toStrictEqual({});
        });

        test('Agent should get total value of portfolio', () => {
            let stockList = new StockList();
            stockList.addStock(new Stock('AAPL', 100));
            let testAgent = new Agent(1000, { AAPL: 5 }, Strategy.randomStrategy);
            expect(testAgent.getPortfolioValue(stockList)).toBe(1500);
        });

        test('Agent should adjust stock amount in portfolio to a certain number', () => {
            let stockList = new StockList();
            stockList.addStock(new Stock('AAPL', 100));
            stockList.addStock(new Stock('GOOGL', 200));
            let testAgent = new Agent(1000, { AAPL: 4, GOOGL: 3 }, Strategy.randomStrategy);
            testAgent.adjustStockPercentage(stockList.getStock('AAPL'), 0.5, stockList);
            testAgent.adjustStock(stockList.getStock('GOOGL'), 5, stockList);
            expect(testAgent.getPortfolio()).toStrictEqual({ AAPL: 10, GOOGL: 5 });
        });

        test('Agent should adjust stock amount in portfolio to a certain percentage of total portfolio value', () => {
            let stockList = new StockList();
            stockList.addStock(new Stock('AAPL', 100));
            stockList.addStock(new Stock('GOOGL', 200));
            let testAgent = new Agent(1200, {}, Strategy.randomStrategy);
            testAgent.adjustStockPercentage(stockList.getStock('AAPL'), 0.5, stockList);
            expect(testAgent.getPortfolio()).toStrictEqual({ AAPL: 6 });
            testAgent.adjustStockPercentage(stockList.getStock('GOOGL'), 0.5, stockList);
            expect(testAgent.getPortfolio()).toStrictEqual({ AAPL: 6, GOOGL: 3 });
        });
    });

    describe('Stock', () => {
        test('Stock should update price', () => {
            let testStock = new Stock('AAPL', 100);
            testStock.updatePrice(200);
            expect(testStock.getPrice()).toBe(200);
        });

        test('Stock should rise', () => {
            let testStock = new Stock('AAPL', 100);
            testStock.rise(0.5);
            expect(testStock.getPrice()).toBe(150);
        });

        test('Stock should fall', () => {
            let testStock = new Stock('AAPL', 100);
            testStock.fall(0.5);
            expect(testStock.getPrice()).toBe(50);
        });

        test('Stock should set price', () => {
            let testStock = new Stock('AAPL', 100);
            testStock.setPrice(200);
            expect(testStock.getPrice()).toBe(200);
        });

        test('Stock should set symbol', () => {
            let testStock = new Stock('AAPL', 100);
            testStock.setSymbol('GOOGL');
            expect(testStock.getSymbol()).toBe('GOOGL');
        });

        test('Stock should get info', () => {
            let testStock = new Stock('AAPL', 100);
            expect(testStock.getInfo()).toStrictEqual({ symbol: 'AAPL', price: 100 });
        });

        test('Stock should set info', () => {
            let testStock = new Stock('AAPL', 100);
            testStock.setInfo('GOOGL', 200);
            expect(testStock.getInfo()).toStrictEqual({ symbol: 'GOOGL', price: 200 });
        });

        test('Stock should clone', () => {
            let testStock = new Stock('AAPL', 100);
            let clonedStock = testStock.clone();
            expect(clonedStock.equals(testStock)).toBe(true);
        });

        test('Stock should compare', () => {
            let testStock = new Stock('AAPL', 100);
            let testStock2 = new Stock('AAPL', 100);
            expect(testStock.equals(testStock2)).toBe(true);
        });
    });
});

describe('Strategies', () => {
    test('Random strategy should buy random amounts of each stock', () => {
        let stockList = new StockList();
        stockList.addStock(new Stock('AAPL', 100));
        stockList.addStock(new Stock('GOOGL', 200));
        stockList.addStock(new Stock('MSFT', 50));

        let testAgent = new Agent(1200, {}, Strategy.randomStrategy);

        for (let i = 0; i < 100; i++) {
            testAgent.executeStrategy(stockList);
        }

        testAgent.debug();

        expect(Object.keys(testAgent.getPortfolio()).length).toBeGreaterThanOrEqual(1);
    });

    test('Equal buy and adjust strategy should equally(based on total portfolio value) buy and adjust equal amounts of each stock', () => {
        let stockList = new StockList();
        stockList.addStock(new Stock('AAPL', 100));
        stockList.addStock(new Stock('GOOGL', 200));
        stockList.addStock(new Stock('MSFT', 50));

        let testAgent = new Agent(1200, {}, Strategy.equalBuyAndAdjustStrategy);
        testAgent.executeStrategy(stockList);

        expect(testAgent.getPortfolio()).toStrictEqual({ AAPL: 4, GOOGL: 2, MSFT: 8 });
    });
});

