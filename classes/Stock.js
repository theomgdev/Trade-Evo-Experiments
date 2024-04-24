/*
    Stock class
    This class is responsible for creating a stock object in the market
    Holds the stock's symbol and price
*/

class Stock {
    constructor(symbol, price) {
        this.symbol = symbol;
        this.price = price;
    }

    // Update stock price
    updatePrice(newPrice) {
        this.price = newPrice;
    }

    // Rise
    rise(percentage) {
        this.price *= 1 + percentage;
    }

    // Fall
    fall(percentage) {
        this.price *= 1 - percentage;
    }

    // Get stock price
    getPrice() {
        return this.price;
    }

    // Get stock symbol
    getSymbol() {
        return this.symbol;
    }

    // Set stock price
    setPrice(price) {
        this.price = price;
    }

    // Set stock symbol
    setSymbol(symbol) {
        this.symbol = symbol;
    }

    // Get stock information
    getInfo() {
        return {
            symbol: this.symbol,
            price: this.price
        };
    }

    // Set stock information
    setInfo(symbol, price) {
        this.symbol = symbol;
        this.price = price;
    }

    // Clone stock
    clone() {
        return new Stock(this.symbol, this.price);
    }

    // Compare stock
    equals(stock) {
        return this.symbol === stock.getSymbol() && this.price === stock.getPrice();
    }
    
    // Debug
    debug() {
        console.log(`Stock: ${this.symbol} Price: ${this.price}`);
    }
}

module.exports = Stock;