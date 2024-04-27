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
    describe('StockList Class', () => {
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

        test('StockList should compare two stock lists', () => {
            let stockList = new StockList();
            stockList.addStock(new Stock('AAPL', 100));
            stockList.addStock(new Stock('GOOGL', 200));
            let stockList2 = new StockList();
            stockList2.addStock(new Stock('AAPL', 100));
            stockList2.addStock(new Stock('GOOGL', 200));
            expect(stockList.equals(stockList2)).toBe(true);
        });

        test('StockList should get all stocks', () => {
            let stockList = new StockList();
            stockList.addStock(new Stock('AAPL', 100));
            stockList.addStock(new Stock('GOOGL', 200));
            expect(Object.keys(stockList.getAllStocks()).length).toBe(2);
        });

        test('StockList should get a stock by symbol', () => {
            let stockList = new StockList();
            stockList.addStock(new Stock('AAPL', 100));
            stockList.addStock(new Stock('GOOGL', 200));
            expect(stockList.getStock('AAPL').getPrice()).toBe(100);
        });

        test('StockList should update a stock price', () => {
            let stockList = new StockList();
            stockList.addStock(new Stock('AAPL', 100));
            stockList.updateStockPrice('AAPL', 200);
            expect(stockList.getStock('AAPL').getPrice()).toBe(200);
        });

        test('StockList should clone', () => {
            let stockList = new StockList();
            stockList.addStock(new Stock('AAPL', 100));
            stockList.addStock(new Stock('GOOGL', 200));
            let clonedStockList = stockList.clone();
            expect(clonedStockList.equals(stockList)).toBe(true);
        });
    });

    describe('Agent Class', () => {
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

        test('Agent should execute trading strategy', () => {
            let stockList = new StockList();
            stockList.addStock(new Stock('AAPL', 100));
            stockList.addStock(new Stock('GOOGL', 200));
            let testAgent = new Agent(1200, {}, Strategy.equalBuyAndAdjustStrategy);
            testAgent.executeStrategy(stockList);
            expect(Object.keys(testAgent.getPortfolio()).length).toBeGreaterThanOrEqual(1);
        });

        test('Agent should clone', () => {
            let stockList = new StockList();
            stockList.addStock(new Stock('AAPL', 100));
            stockList.addStock(new Stock('GOOGL', 200));
            let testAgent = new Agent(1200, { AAPL: 6, GOOGL: 3 }, Strategy.randomStrategy);
            let clonedAgent = testAgent.clone();
            expect(clonedAgent.equals(testAgent)).toBe(true);
        });

        test('Agent should compare', () => {
            let stockList = new StockList();
            stockList.addStock(new Stock('AAPL', 100));
            stockList.addStock(new Stock('GOOGL', 200));
            let testAgent = new Agent(1200, { AAPL: 6, GOOGL: 3 }, Strategy.randomStrategy);
            let testAgent2 = new Agent(1200, { AAPL: 6, GOOGL: 3 }, Strategy.randomStrategy);
            let testAgent3 = new Agent(7878, { AAPL: 6, GOOGL: 3 }, Strategy.randomStrategy);
            let testAgent4 = new Agent(1200, { AAPL: 6, GOOGL: 3, MSFT: 3 }, Strategy.randomStrategy);
            let testAgent5 = new Agent(1200, { AAPL: 6, GOOGL: 3 }, Strategy.equalBuyAndAdjustStrategy);
            expect(testAgent.equals(testAgent2)).toBe(true);
            expect(testAgent.equals(testAgent3)).toBe(false);
            expect(testAgent.equals(testAgent4)).toBe(false);
            expect(testAgent.equals(testAgent5)).toBe(false);
        });
    });

    describe('Stock Class', () => {
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

    describe('Strategy Class', () => {
        test('Strategy should execute', () => {
            let stockList = new StockList();
            stockList.addStock(new Stock('AAPL', 100));
            stockList.addStock(new Stock('GOOGL', 200));
            let testAgent = new Agent(1200, {}, Strategy.randomStrategy);

            for (let i = 0; i < 1000; i++) {
                testAgent.executeStrategy(stockList);
            }
            
            expect(Object.keys(testAgent.getPortfolio()).length).toBeGreaterThanOrEqual(1);
        });

        test('Strategy should set strategy function', () => {
            let testStrategy = new Strategy(() => {});
            testStrategy.setStrategyFunction(() => {});
            expect(getType(testStrategy.getStrategyFunction())).toBe('function');
        });

        test('Strategy should get strategy function', () => {
            let testStrategy = new Strategy(() => {});
            expect(getType(testStrategy.getStrategyFunction())).toBe('function');
        });

        test('Strategy should clone', () => {
            let testStrategy = new Strategy(() => {});
            let clonedStrategy = testStrategy.clone();
            expect(clonedStrategy.equals(testStrategy)).toBe(true);
        });

        test('Strategy should compare', () => {
            let testStrategy = new Strategy(() => {return 1;});
            let testStrategy2 = new Strategy(() => {return 2;});
            expect(testStrategy.equals(testStrategy2)).toBe(false);

            let testStrategy3 = new Strategy(() => {return 1;});
            let testStrategy4 = new Strategy(() => {return 1;});
            expect(testStrategy3.equals(testStrategy4)).toBe(true);
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

        for (let i = 0; i < 1000; i++) {
            testAgent.executeStrategy(stockList);
        }

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

describe('Flow', () => {
    describe('Strategy Flow', () => {
        test('Agents should not have the same portfolio after executing random strategy', () => {
            let stockList = new StockList();
            stockList.addStock(new Stock('AAPL', 100));
            stockList.addStock(new Stock('GOOGL', 200));
            stockList.addStock(new Stock('MSFT', 50));

            let testAgent = new Agent(1200, {}, Strategy.randomStrategy);

            for (let i = 0; i < 1000; i++) {
                testAgent.executeStrategy(stockList);
            }

            let testAgent2 = new Agent(1200, {}, Strategy.randomStrategy);
            for (let i = 0; i < 1000; i++) {
                testAgent2.executeStrategy(stockList);
            }

            expect(testAgent.equals(testAgent2)).toBe(false);
        });

        test('Agents should have the same portfolio after executing equal buy and adjust strategy', () => {
            let stockList = new StockList();
            stockList.addStock(new Stock('AAPL', 100));
            stockList.addStock(new Stock('GOOGL', 200));
            stockList.addStock(new Stock('MSFT', 50));

            let testAgent = new Agent(1200, {}, Strategy.equalBuyAndAdjustStrategy);
            testAgent.executeStrategy(stockList);

            let testAgent2 = new Agent(1200, {}, Strategy.equalBuyAndAdjustStrategy);
            testAgent2.executeStrategy(stockList);

            expect(testAgent.equals(testAgent2)).toBe(true);
        });
    });

    describe('Agent Flow', () => {
        test('Clone should not act same as original agent', () => {
            let stockList = new StockList();
            stockList.addStock(new Stock('AAPL', 100));
            stockList.addStock(new Stock('GOOGL', 200));
            stockList.addStock(new Stock('MSFT', 50));

            let testAgent = new Agent(1200, {}, Strategy.randomStrategy);

            for (let i = 0; i < 1000; i++) {
                testAgent.executeStrategy(stockList);
            }

            let clonedAgent = testAgent.clone();

            for (let i = 0; i < 1000; i++) {
                clonedAgent.executeStrategy(stockList);
            }

            expect(testAgent.equals(clonedAgent)).toBe(false);
        });
    });

    describe('Stock Flow', () => {
        test('Stock should not act same as original stock after updating price', () => {
            let testStock = new Stock('AAPL', 100);
            testStock.updatePrice(200);

            let clonedStock = testStock.clone();
            clonedStock.updatePrice(300);

            expect(testStock.equals(clonedStock)).toBe(false);
        });

        test('Stock should act same as original stock after setting info', () => {
            let testStock = new Stock('AAPL', 100);
            testStock.setInfo('GOOGL', 200);

            let clonedStock = testStock.clone();
            clonedStock.setInfo('GOOGL', 200);

            expect(testStock.equals(clonedStock)).toBe(true);
        });

        test('Stock should not act same as original stock after setting symbol', () => {
            let testStock = new Stock('AAPL', 100);
            testStock.setSymbol('GOOGL');

            let clonedStock = testStock.clone();
            clonedStock.setSymbol('MSFT');

            expect(testStock.equals(clonedStock)).toBe(false);
        });

        test('Stock should not act same as original stock after setting price', () => {
            let testStock = new Stock('AAPL', 100);
            testStock.setPrice(200);

            let clonedStock = testStock.clone();
            clonedStock.setPrice(300);

            expect(testStock.equals(clonedStock)).toBe(false);
        });
    });
});
