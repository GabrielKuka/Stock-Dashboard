import React, { useEffect, useState } from "react";
import tradeService from "../../../services/trade";
import Helper from "../../../services/Helper";
import useTicker from "../../../hooks/useTicker";
import "./toplist.scss";

const TopListItem = ({ ticker, issueType }) => {
  const [tickerData] = useTicker(ticker);

  const changeStyle = () => {
    const changeColor = tickerData?.changePercent > 0 ? "#4cbb17" : "red";
    return { color: changeColor, fontSize: "0.7rem" };
  };

  const itemBorder = () => {
    const color = tickerData?.changePercent > 0 ? "#4cbb17" : "red";
    return { border: `1px solid ${color}` };
  };

  return (
    <div className="toplist__item" style={itemBorder()}>
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
            {tickerData.changePercent}%
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
      setListItems(response?.stocks);
    };
    fetchTopList();
  }, []);

  return (
    <div className="toplist">
      {listItems?.map?.((stock) => {
        return (
          <TopListItem
            key={stock?.ticker}
            ticker={stock?.ticker}
            issueType={stock?.issueType}
          />
        );
      })}
    </div>
  );
};

export default TopList;
