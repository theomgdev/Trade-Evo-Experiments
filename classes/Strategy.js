/*
    Strategy class
    This class is responsible for defining a trading strategy
*/

class Strategy {
    constructor(strategyFunction) {
        this.strategyFunction = strategyFunction;
    }

    // Random strategy
    static randomStrategy = new Strategy((agent, stockList) => {
        let stocks = stockList.getAllStocks();
        for (let stock in stocks) {
            if (Math.random() <= 0.5) {
                agent.buyStock(stocks[stock], Math.random() * 10);
            } else {
                agent.sellStock(stocks[stock], Math.random() * 10);
            }
        }
    });

    // Buy and adjust strategy
    static equalBuyAndAdjustStrategy = new Strategy((agent, stockList) => {
        let stocks = stockList.getAllStocks();
        for (let stock in stocks) {
            agent.adjustStockPercentage(stocks[stock], 1 / Object.keys(stocks).length, stockList, -1);
        }
        for (let stock in stocks) {
            agent.adjustStockPercentage(stocks[stock], 1 / Object.keys(stocks).length, stockList, 1);
        }
    });

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
    
    // Clone
    clone() {
        return new Strategy(this.strategyFunction);
    }

    // Equals
    equals(strategy) {
        // Compare strategy functions
        return this.hash() == strategy.hash();
    }

    // Debug
    debug() {
        console.log(this.strategyFunction);
    }

    // Strategy Hash Code (for performance optimised comparison)
    hash() {
        let hash = 0;
        let string = this.strategyFunction.toString();
        if (string.length == 0) return hash;
        for (let i = 0; i < string.length; i++) {
            let char = string.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
            //Secret key to make hash more unique and secure
            hash = hash ^ "g00Dth1nGsCOm3Ify0uN3v3RST0P!";
        }
        return hash;
    }
}

module.exports = Strategy;