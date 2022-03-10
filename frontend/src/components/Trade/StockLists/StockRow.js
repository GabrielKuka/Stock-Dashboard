import React, { useEffect, useState, useRef, useContext } from "react";
import { useSelector } from "react-redux";
import { WebSocketContext } from "../../Test/websocket";
import tradeService from "../../../services/trade";
import Helper from "../../../services/Helper";
import "./style.css";

const StockRow = ({ ticker }) => {
  const ws = useContext(WebSocketContext);
  const stock = useSelector(({ socket }) => socket);

  const [tickerData, setTickerData] = useState();
  const prevClose = useRef();

  useEffect(() => {
    const fetchInitialPrice = async () => {
      const response = await tradeService.getTickerPrice(ticker);
      setTickerData(response);
      prevClose.current = response.previousClose;
    };

    fetchInitialPrice();
    ws.subscribe(ticker);

    return () => ws.unsubscribe(ticker);
  }, []);

  // Check socket updates
  useEffect(() => {
    if (stock.ticker === ticker) {
      const change = Helper.getChange(stock.price, prevClose.current);
      setTickerData({
        price: stock.price,
        change: change,
        changePercent: Helper.formatChangePercent(change / prevClose.current),
      });
    }
  }, [stock.price]);

  const changeStyle = () => {
    const changeColor = tickerData.changePercent > 0 ? "green" : "red";

    return { color: changeColor, fontSize: "0.8rem" };
  };

  return (
    <div className="row stock-row">
      <div className="col-sm">{ticker}</div>
      {tickerData && tickerData.price && tickerData.changePercent && (
        <>
          <div className="col-sm">${tickerData.price}</div>
          <div className="col-sm" style={changeStyle()}>
            {tickerData.changePercent}%
          </div>
        </>
      )}
    </div>
  );
};

export default StockRow;
