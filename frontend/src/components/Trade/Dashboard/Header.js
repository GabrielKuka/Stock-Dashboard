import React, { useEffect } from "react";
import useTicker from "../../../hooks/useTicker";
import Chart from "../../Core/chart/chart";

import { useSelector } from "react-redux";
import "./header.scss";

const Header = (props) => {
  const ticker = useSelector(({ trade }) => trade.ticker);

  const [tickerData, setTickerInput] = useTicker(ticker);

  useEffect(() => {
    setTickerInput(ticker);
  }, [ticker]);

  const changeStyle = () => {
    const changeColor = tickerData?.changePercent > 0 ? "green" : "red";

    return { color: changeColor, fontSize: "0.8rem" };
  };

  return (
    <div className="wrapper">
      <h3 className={"tickerview"}>{props.tickerView}</h3>
      <div className={"wrapper__info"}>
        <div className={"company-info"}>
          <div className="company-name">{props.header.name}</div>
          <span className={"ticker"}>{ticker}</span>
          <div className={"realtime-price-container"}>
            <span className={"price"}>${tickerData?.price}</span>
            <span className={"percent"} style={changeStyle()}>
              {tickerData?.changePercent}%
            </span>
          </div>
        </div>
      </div>
      <Chart ticker={ticker} />
    </div>
  );
};

export default Header;
