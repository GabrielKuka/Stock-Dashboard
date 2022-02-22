import React, { useEffect, useState, useContext, useRef } from "react";
import { WebSocketContext } from "../../Test/websocket";
import tradeService from "../../../services/trade";
import Helper from "../../../services/Helper";

import { useSelector } from "react-redux";
import "./header.css";

const Header = (props) => {
  const stock = useSelector(({ socket }) => socket);
  const ticker = useSelector(({ trade }) => trade.ticker);
  const ws = useContext(WebSocketContext);

  const [tickerData, setTickerData] = useState([]);
  const prevClose = useRef();

  const changeStyle = () => {
    const changeColor = tickerData.changePercent > 0 ? "green" : "red";

    return { color: changeColor, fontSize: "0.8rem" };
  };

  // Retrieve initial data
  useEffect(() => {
    const fetchData = async () => {
      const response = await tradeService.getTickerPrice(ticker);
      // Save change percent, price, and prev price
      setTickerData(response);
      prevClose.current = response.previousClose;
    };

    fetchData();

    ws.subscribe(ticker);

    return () => {
      setTickerData([]);
      ws.unsubscribe(ticker);
    };
  }, [ticker]);

  // Check socket updates
  useEffect(() => {
    if (stock.ticker === ticker) {
      const change = Helper.formatNumber(stock.price - prevClose.current);
      setTickerData({
        price: stock.price,
        change: change,
        changePercent: Helper.formatChangePercent(change / prevClose.current),
      });
    }
  }, [stock.price, ticker]);

  return (
    <div className="card-title">
      <img className={"logo"} alt="Logo" src={props.header.logo} />
      <span className="company-name">{props.header.name}</span>
      <div className={"realtime-price-container"}>
        <b>${tickerData.price}</b>
        <span style={changeStyle()}>{tickerData.changePercent}%</span>
      </div>
    </div>
  );
};

export default Header;
