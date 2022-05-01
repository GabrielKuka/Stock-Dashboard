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
      <div className={"wrapper__info"}>
        <h3 className={"tickerview"}>{props.tickerView}</h3>
        <img className={"logo"} alt="Logo" src={props.header.logo} />
        <div className="company-name">{props.header.name}</div>
        <div className={"realtime-price-container"}>
          <span className={"price"}>${tickerData?.price}</span>
          <span className={"percent"} style={changeStyle()}>
            {tickerData?.changePercent}%
          </span>
        </div>
      </div>
      <Chart ticker={ticker} />
    </div>
  );
};

export default Header;
