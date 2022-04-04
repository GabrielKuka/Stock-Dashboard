import React, { useEffect } from "react";
import useTicker from "../../../hooks/useTicker";

import { useSelector } from "react-redux";
import "./header.css";

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
    <div className="card-title">
      <img className={"logo"} alt="Logo" src={props.header.logo} />
      <span className="company-name">{props.header.name}</span>
      <div className={"realtime-price-container"}>
        <b>${tickerData?.price}</b>
        <span style={changeStyle()}>{tickerData?.changePercent}%</span>
      </div>
    </div>
  );
};

export default Header;
