import React from "react";
import Helper from "../../../services/Helper";
import useTicker from "../../../hooks/useSocket";
import "./stockrow.scss";

const StockRow = ({ ticker }) => {
  const tickerData = useTicker(ticker);

  const changeStyle = () => {
    const changeColor = tickerData?.changePercent > 0 ? "green" : "red";

    return { color: changeColor, fontSize: "0.8rem" };
  };

  return (
    <div className={"stockrow-wrapper"}>
      <div className={"stockrow-wrapper__ticker"}>{ticker}</div>
      {tickerData && (
        <>
          <div className={"stockrow-wrapper__price"}>
            ${Helper.formatNumber(tickerData?.price)}
          </div>
          <div className={"stockrow-wrapper__percent"} style={changeStyle()}>
            {tickerData?.changePercent}%
          </div>
        </>
      )}
    </div>
  );
};

export default StockRow;
