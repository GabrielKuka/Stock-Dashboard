import React, { useEffect, useState, useContext, useRef } from "react";
import { useSelector } from "react-redux";
import tradeService from "../../../services/trade";
import { WebSocketContext } from "../../Test/websocket";
import Helper from "../../../services/Helper";
import "./toplist.scss";

const TopListItem = ({ ticker, issueType }) => {
  const ws = useContext(WebSocketContext);
  const stock = useSelector(({ socket }) => socket);

  const [tickerData, setTickerData] = useState();
  const prevClose = useRef();

  const changeStyle = () => {
    const changeColor = tickerData.changePercent > 0 ? "green" : "red";
    return { color: changeColor, fontSize: "0.9rem" };
  };

  // Retrieve initial data
  useEffect(() => {
    const fetchPrice = async () => {
      const response = await tradeService.getTickerPrice(ticker);
      setTickerData(response);
      prevClose.current = response.previousClose;
    };

    fetchPrice();

    ws.subscribe(ticker);

    return () => {
      setTickerData([]);
      ws.unsubscribe(ticker);
    };
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

  return (
    <div className="toplist__item">
      <div className="item-container">
        <span className="ticker">{ticker}</span>
        <span className="issuetype">{Helper.formatIssueType(issueType)}</span>
      </div>
      {tickerData && (
        <div className="item-container">
          <span className={"stock-price"}>
            ${tickerData && tickerData.price}
          </span>
          <span className={"percent-change"} style={changeStyle()}>
            {tickerData && tickerData.changePercent}%
          </span>
        </div>
      )}
    </div>
  );
};

const TopList = () => {
  const [listItems, setListItems] = useState([]);

  // Retrive toplist data
  useEffect(() => {
    const fetchTopList = async () => {
      const response = await tradeService.topListAction("GET");
      setListItems(response.stocks);
    };
    fetchTopList();
  }, []);

  return (
    <div className="toplist">
      {listItems &&
        listItems.map((stock) => {
          return (
            <TopListItem
              key={stock.ticker}
              ticker={stock.ticker}
              issueType={stock.issueType}
            />
          );
        })}
    </div>
  );
};

export default TopList;
