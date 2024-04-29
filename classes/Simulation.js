StockList = require('./StockList.js');
/*
Simulation class
This class is responsible for managing a simulation of the stock market(using StockList and Agent)
A simulation consists of time, a list of stocks and a list of agents
Each time step, the simulation updates the stock prices and executes the agents' strategies
Each simulation has Its own price update function
Simulations can be run for a specified number of time steps
At the end of the simulation, the final state of the agents and stocks can be retrieved
Also, the simulation can be cloned, compared, and debugged
*/
class Simulation {
    constructor(priceUpdateFunction = (time, stockList) => {
        let stocks = stockList.getAllStocks();
        for (let symbol in stocks) {
            stocks[symbol].rise(Math.random() * 0.1 - 0.05);
        }
    }, stockList = new StockList(), agents = [], time = 0) {
        this.priceUpdateFunction = priceUpdateFunction;
        this.stockList = stockList;
        this.agents = agents;
        this.time = time;
    }

    // Run simulation
    run() {
        for (let i = 0; i < this.time; i++) {
            for (let agent of this.agents) {
                agent.getStrategy().execute(agent, this.stockList);
            }
            this.time++;
            this.priceUpdateFunction(this.time, this.stockList);
        }
    }

    // Get final state
    getFinalState() {
        return {
            stockList: this.stockList,
            agents: this.agents
        };
    }

    // Clone
    clone() {
        let agents = [];
        for (let agent of this.agents) {
            agents.push(agent.clone());
        }
        return new Simulation(this.priceUpdateFunction, this.stockList.clone(), agents, this.time);
    }

    // Equals
    equals(simulation) {
        return this.time == simulation.time && this.stockList.equals(simulation.stockList) && this.agents.equals(simulation.agents) && this.hash() == simulation.hash();
    }

    // Debug
    debug() {
        console.log('Simulation:');
        console.log('Time:', this.time);
        console.log('Stock List:', this.stockList.debug());
        console.log('Agents:', this.agents.debug());
    }

    // Strategy Hash Code (for performance optimised comparison)
    hash() {
        let hash = 0;
        let string = this.priceUpdateFunction.toString();
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

    // Get time
    getTime() {
        return this.time;
    }

    // Get stock list
    getStockList() {
        return this.stockList;
    }

    // Get agents
    getAgents() {
        return this.agents;
    }

    // Set time
    setTime(time) {
        this.time = time;
    }

    // Set stock list
    setStockList(stockList) {
        this.stockList = stockList;
    }

    // Set agents
    setAgents(agents) {
        this.agents = agents;
    }

    // Set price update function
    setPriceUpdateFunction(priceUpdateFunction) {
        this.priceUpdateFunction = priceUpdateFunction;
    }

    // Get price update function
    getPriceUpdateFunction() {
        return this.priceUpdateFunction;
    }

    // Add agent
    addAgent(agent) {
        this.agents.push(agent);
    }

    // Remove agent
    removeAgent(agent) {
        let index = this.agents.indexOf(agent);
        if (index > -1) {
            this.agents.splice(index, 1);
        }
    }

    // Add stock
    addStock(stock) {
        this.stockList.addStock(stock);
    }

    // Remove stock
    removeStock(symbol) {
        this.stockList.removeStock(symbol);
    }

    // Update stock price
    updateStockPrice(symbol, newPrice) {
        this.stockList.updateStockPrice(symbol, newPrice);
    }

    // Get agent by index
    getAgent(index) {
        return this.agents[index];
    }

    // Get stock by symbol
    getStock(symbol) {
        return this.stockList.getStock(symbol);
    }

    // Get all stocks
    getAllStocks() {
        return this.stockList.getAllStocks();
    }

    // Get agent count
    getAgentCount() {
        return this.agents.length;
    }

    // Get stock count
    getStockCount() {
        return Object.keys(this.stockList.getAllStocks()).length;
    }

    // Get agent index
    getAgentIndex(agent) {
        return this.agents.indexOf(agent);
    }

    // Get stock index
    getStockIndex(stock) {
        return this.stockList.getAllStocks().indexOf(stock);
    }
}

module.exports = Simulation;