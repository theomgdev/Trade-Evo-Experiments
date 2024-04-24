/*
    Agent class
    This class is responsible for creating an agent object to trade in the market
    Holds the agent's cash, portfolio, and trading strategy
*/

class Agent {
    constructor(cash, portfolio, strategy) {
        this.cash = cash;
        this.portfolio = portfolio;
        this.strategy = strategy;
    }

    // Get cash
    getCash() {
        return this.cash;
    }

    // Get portfolio
    getPortfolio() {
        return this.portfolio;
    }

    // Get strategy
    getStrategy() {
        return this.strategy;
    }

    // Set cash
    setCash(cash) {
        this.cash = cash;
    }

    // Set portfolio
    setPortfolio(portfolio) {
        this.portfolio = portfolio;
    }

    // Set strategy
    setStrategy(strategy) {
        this.strategy = strategy;
    }

    // Check if agent has stock
    hasStock(stock) {
        return stock.getSymbol() in this.portfolio;
    }

    // Get portfolio stock quantity
    getStockQuantity(stock) {
        if (this.hasStock(stock)) {
            return this.portfolio[stock.getSymbol()];
        } else {
            return 0;
        }
    }

    // Set stock quantity
    setStockQuantity(stock, quantity) {
        this.portfolio[stock.getSymbol()] = quantity;
    }

    // Buy stock
    buyStock(stock, quantity) {
        if (quantity < 0) {
            return;
        }

        if (this.cash >= stock.getPrice() * quantity) {
            this.cash -= stock.getPrice() * quantity;
            if (this.hasStock(stock)) {
                this.setStockQuantity(stock, this.getStockQuantity(stock) + quantity);
            } else {
                this.setStockQuantity(stock, quantity);
            }
        }

        // remove stock from portfolio if quantity is 0 and stock is in portfolio
        if (this.hasStock(stock) && this.getStockQuantity(stock) <= 0) {
            delete this.portfolio[stock.getSymbol()];
        }
    }

    // Sell stock
    sellStock(stock, quantity) {
        if (quantity < 0) {
            return;
        }

        if (this.hasStock(stock) && this.getStockQuantity(stock) >= quantity) {
            this.cash += stock.getPrice() * quantity;
            this.setStockQuantity(stock, this.getStockQuantity(stock) - quantity);
        }

        // remove stock from portfolio if quantity is 0
        if (this.hasStock(stock) && this.getStockQuantity(stock) <= 0) {
            delete this.portfolio[stock.getSymbol()];
        }
    }

    // Buy stock worth a certain amount of cash
    buyStockWorth(stock, cash) {
        let quantity = Math.floor(cash / stock.getPrice());
        this.buyStock(stock, quantity);
    }

    // Sell stock worth a certain amount of cash
    sellStockWorth(stock, cash) {
        let quantity = Math.floor(cash / stock.getPrice());
        this.sellStock(stock, quantity);
    }

    // Get total value of portfolio
    getPortfolioValue(stockList) {
        let value = this.cash;
        for (let symbol in this.portfolio) {
            value += this.portfolio[symbol] * stockList.getStock(symbol).getPrice();
        }
        return value;
    }

    // Set stock amount in portfolio(buy/sell) to a certain number
    adjustStock(stock, quantity) {
        if (this.hasStock(stock)) {
            let difference = quantity - this.getStockQuantity(stock);
            if (difference > 0) {
                this.buyStock(stock, difference);
            } else {
                this.sellStock(stock, -difference);
            }
        } else {
            this.buyStock(stock, quantity);
        }
    }

    // Set stock amount in portfolio(buy/sell) to a certain percentage of total portfolio value
    adjustStockPercentage(stock, percentage, stockList) {
        let totalValue = this.getPortfolioValue(stockList);
        let stockValue = stockList.getStock(stock.getSymbol()).getPrice() * this.getStockQuantity(stock);
        let targetValue = totalValue * percentage;
        let difference = targetValue - stockValue;
        if (difference > 0) {
            this.buyStockWorth(stock, difference);
        } else {
            this.sellStockWorth(stock, -difference);
        }
    }

    // Execute trading strategy
    executeStrategy(stockList) {
        this.strategy.execute(this, stockList);
    }

    // Clone
    clone() {
        return new Agent(this.cash, this.portfolio, this.strategy);
    }

    // Equals
    equals(agent) {
        return this.cash == agent.cash && this.portfolio == agent.portfolio;
    }

    // Debug
    debug() {
        console.log('Cash: ' + this.cash);
        console.log('Portfolio: ');
        console.log(this.portfolio);
    }
}

// Export Agent class
module.exports = Agent;