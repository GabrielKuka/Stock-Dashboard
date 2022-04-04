import React, { useEffect } from "react";

import tradeService from "../../services/trade";

import "./style.css";

const Homepage = ({ user }) => {
  useEffect(() => {
    const fetchQuote = async () => {
      const data = await tradeService.getTickerQuote("AAPL");
    };

    fetchQuote();
  }, []);

  return <div>Hey</div>;
};

export default Homepage;
