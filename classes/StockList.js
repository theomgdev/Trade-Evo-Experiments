/*
    StockList class
    This class is responsible for managing a list of stocks in the market
*/

class StockList {
    constructor() {
        this.stocks = {};
    }

    // Add a stock to the list
    addStock(stock) {
        this.stocks[stock.getSymbol()] = stock;
    }

    // Remove a stock from the list
    removeStock(symbol) {
        delete this.stocks[symbol];
    }

    // Get a stock from the list by symbol
    getStock(symbol) {
        return this.stocks[symbol];
    }

    // Get all stocks
    getAllStocks() {
        return this.stocks;
    }

    // Update a stock's price
    updateStockPrice(symbol, newPrice) {
        if (this.stocks[symbol]) {
            this.stocks[symbol].updatePrice(newPrice);
        }
    }

    // Clone
    clone() {
        let stockList = new StockList();
        for (let symbol in this.stocks) {
            stockList.addStock(this.stocks[symbol]);
        }
        return stockList;
    }

    // Equals
    equals(stockList) {
        let stocks = stockList.getAllStocks();
        if (Object.keys(this.stocks).length !== Object.keys(stocks).length) {
            return false;
        }
        for (let symbol in this.stocks) {
            if (!stocks[symbol] || this.stocks[symbol].getPrice() !== stocks[symbol].getPrice()) {
                return false;
            }
        }
        return true;
    }

    // Debug
    debug() {
        console.log(this.stocks);
    }
}

module.exports = StockList;