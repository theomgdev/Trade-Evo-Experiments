Stock = require('./classes/Stock.js');
StockList = require('./classes/StockList.js');
Strategy = require('./classes/Strategy.js');
Agent = require('./classes/Agent.js');

// Create stock list
let stockList = new StockList();
stockList.addStock(new Stock('AAPL', 100));
stockList.addStock(new Stock('GOOGL', 200));
stockList.addStock(new Stock('MSFT', 150));

let testAgent = new Agent(1000, {}, Strategy.randomStrategy);
testAgent.executeStrategy(stockList);

stockList.debug();
testAgent.debug();