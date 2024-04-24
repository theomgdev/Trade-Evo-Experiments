/*
    Strategy class
    This class is responsible for defining a trading strategy
*/

class Strategy {
    constructor(strategyFunction) {
        this.strategyFunction = strategyFunction;
    }

    // Execute strategy
    execute(agent, stockList) {
        this.strategyFunction(agent, stockList);
    }

    // Set strategy function
    setStrategyFunction(strategyFunction) {
        this.strategyFunction = strategyFunction;
    }

    // Get strategy function
    getStrategyFunction() {
        return this.strategyFunction;
    }

    // Random strategy
    static randomStrategy = new Strategy((agent, stockList) => {
        let stocks = stockList.getAllStocks();
        for (let stock in stocks) {
            if (Math.random() < 0.5) {
                agent.buyStock(stock, Math.floor(Math.random() * 10));
            } else {
                agent.sellStock(stock, Math.floor(Math.random() * 10));
            }
        }
    });

    // Buy and adjust strategy
    static buyAndAdjustStrategy = new Strategy((agent, stockList) => {
        let stocks = stockList.getAllStocks();
        for (let stock in stocks) {
            agent.adjustStockPercentage(stocks[stock], 1 / Object.keys(stocks).length, stockList);
        }
    });
    
    // Clone
    clone() {
        return new Strategy(this.strategyFunction);
    }

    // Equals
    equals(strategy) {
        return this.strategyFunction === strategy.getStrategyFunction();
    }

    // Debug
    debug() {
        console.log(this.strategyFunction);
    }
}

module.exports = Strategy;