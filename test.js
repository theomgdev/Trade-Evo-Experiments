Stock = require('./classes/Stock.js');
StockList = require('./classes/StockList.js');
Strategy = require('./classes/Strategy.js');
Agent = require('./classes/Agent.js');

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

test('Agent should set stock amount in portfolio to a certain number', () => {
    let stockList = new StockList();
    stockList.addStock(new Stock('AAPL', 100));
    let testAgent = new Agent(1000, { AAPL: 4 }, Strategy.randomStrategy);
    testAgent.adjustStockPercentage(stockList.getStock('AAPL'), 0.5, stockList);
    expect(testAgent.getPortfolio()).toStrictEqual({ AAPL: 7 });
});

test('Agent should set stock amount in portfolio to a certain percentage of total portfolio value', () => {
    let stockList = new StockList();
    stockList.addStock(new Stock('AAPL', 100));
    stockList.addStock(new Stock('GOOGL', 200));
    let testAgent = new Agent(1200, {}, Strategy.randomStrategy);
    testAgent.adjustStockPercentage(stockList.getStock('AAPL'), 0.5, stockList);
    testAgent.adjustStockPercentage(stockList.getStock('GOOGL'), 0.5, stockList);
    expect(testAgent.getPortfolio()).toStrictEqual({ AAPL: 6, GOOGL: 3 });
});

test('Buy and hold strategy should buy and hold equal amounts of each stock', () => {
    let stockList = new StockList();
    stockList.addStock(new Stock('AAPL', 100));
    stockList.addStock(new Stock('GOOGL', 200));
    stockList.addStock(new Stock('MSFT', 50));

    let testAgent = new Agent(1200, {}, Strategy.buyAndHoldStrategy);
    testAgent.executeStrategy(stockList);

    expect(testAgent.getPortfolio()).toStrictEqual({ AAPL: 4, GOOGL: 2, MSFT: 8 });
});