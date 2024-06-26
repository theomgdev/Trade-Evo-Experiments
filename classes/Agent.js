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
    buyStock(stock, quantity, integer = false) {
        if (quantity <= 0) {
            return;
        }

        if (integer) {
            quantity = Math.floor(quantity);
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
    sellStock(stock, quantity, integer = false) {
        if (quantity <= 0) {
            return;
        }

        if (integer) {
            quantity = Math.floor(quantity);
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
    buyStockWorth(stock, cash, integer = false) {
        if (cash <= 0) {
            return;
        }

        let quantity = integer ? Math.floor(cash / stock.getPrice()) : cash / stock.getPrice();
        this.buyStock(stock, quantity, integer);
    }

    // Sell stock worth a certain amount of cash
    sellStockWorth(stock, cash, integer = false) {
        if (cash <= 0) {
            return;
        }
        
        let quantity = integer ? Math.floor(cash / stock.getPrice()) : cash / stock.getPrice();
        this.sellStock(stock, quantity, integer);
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
    adjustStock(stock, quantity, direction = 0, integer = false) {
        if (this.hasStock(stock)) {
            let difference = quantity - this.getStockQuantity(stock);
            if (difference > 0) {
                if(direction == 0 || direction == 1) {
                    this.buyStock(stock, difference, integer);
                }
            } else {
                if(direction == 0 || direction == -1) {
                    this.sellStock(stock, -difference, integer);
                }
            }
        } else {
            if(direction == 0 || direction == 1) {
                this.buyStock(stock, quantity, integer);
            }
        }
    }

    // Set stock amount in portfolio(buy/sell) to a certain percentage of total portfolio value
    adjustStockPercentage(stock, percentage, stockList, direction = 0, integer = false) {
        let totalValue = this.getPortfolioValue(stockList);
        let stockValue = stockList.getStock(stock.getSymbol()).getPrice() * this.getStockQuantity(stock);
        let targetValue = totalValue * percentage;
        let difference = targetValue - stockValue;
        if (difference > 0) {
            if(direction == 0 || direction == 1) {
                this.buyStockWorth(stock, difference, integer);
            }
        } else {
            if(direction == 0 || direction == -1) {
                this.sellStockWorth(stock, -difference, integer);
            }
        }
    }

    // Execute trading strategy
    executeStrategy(stockList) {
        this.strategy.execute(this, stockList);
    }

    // Clone
    clone() {
        return new Agent(this.cash, this.portfolio, this.strategy.clone());
    }

    // Equals
    equals(agent) {
        if(this.cash != agent.cash) {
            return false;
        }

        if(Object.keys(this.portfolio).length != Object.keys(agent.portfolio).length) {
            return false;
        }

        for(let symbol in this.portfolio) {
            if(this.portfolio[symbol] != agent.portfolio[symbol]) {
                return false;
            }
        }

        return this.strategy.equals(agent.strategy);
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