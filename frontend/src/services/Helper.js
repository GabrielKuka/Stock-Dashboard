import cts from "check-ticker-symbol";
import tradeService from "../services/trade";

const Alpaca = require("@alpacahq/alpaca-trade-api");

const Helper = {
  formatChangePercent: (change) => {
    return Number(100 * change).toFixed(2);
  },
  formatNumber: (number, dec = 2) => {
    if (!number) {
      return "-";
    } else {
      return Number(number)
        .toFixed(dec)
        .toLocaleString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  },
  formatDateTime: (date) => {
    return new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    }).format(date);
  },
  formatBirthday: (date) => {
    let p = new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
      .formatToParts(date)
      .reduce((acc, part) => {
        acc[part.type] = part.value;
        return acc;
      }, {});

    return `${p.year}-${p.month}-${p.day}`;
  },
  getChange: (currPrice, prevPrice) => {
    return currPrice - prevPrice;
  },
  getYear: (date) => {
    return new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
    }).format(date);
  },
  getMonth: (date) => {
    return new Intl.DateTimeFormat("en-GB", {
      month: "long",
    }).format(date);
  },
  range: (start, stop, step = 1) => {
    return Array(stop - start)
      .fill(start)
      .map((x, y) => x + y * step);
  },
  isStockValid: (stock) => {
    return cts.valid(stock);
  },
  getStockIssueType: async (ticker) => {
    const response = await tradeService.getTickerIssueType(ticker);
    return response;
  },
  isListEmpty: (list) => {
    return true ? list.length === 0 : false;
  },
  isTitleValid: async (title) => {
    if (title.length === 0) return false;

    const result = await tradeService.listAction("CHECK_TITLE", title);
    return result.status;
  },
  formatIssueType: (issueType) => {
    switch (issueType) {
      case "et":
        return "ETF";
      case "cs":
        return "Common Stock";
      case "ps":
        return "Preferred Stock";
      case "wt":
        return "Warrant";
      case "struct":
        return "Structured Product";
      case "ut":
        return "Unit";
      case "ad":
        return "ADR";
      case "cef":
        return "Closed End Fund";
      case "oef":
        return "Open Ended Fund";
      case "rt":
        return "Right";
      default:
        return "";
    }
  },
  Market: {
    isMarketOpen: () => {
      const alpaca = new Alpaca();
      alpaca.getClock().then((clock) => {
        return clock.is_open;
      });
    },
  },
};

export default Helper;
