import React from "react";
import Helper from "../../../services/Helper";
import useTicker from "../../../hooks/useTicker";
import Button from "../../Core/button";

const TickerRow = ({ ticker, edit, listAction }) => {
  const [tickerData] = useTicker(ticker);

  const changeStyle = () => {
    const changeColor = tickerData?.changePercent > 0 ? "green" : "red";

    return { color: changeColor, fontSize: "0.8rem" };
  };

  return (
    <>
      {tickerData && (
        <tr>
          <td>{ticker}</td>
          <td>${tickerData.price}</td>
          <td style={changeStyle()}>
            {tickerData.changePercent}% (
            {Helper.formatNumber(tickerData.change)})
          </td>
          {edit && (
            <td>
              <Button
                onClick={() =>
                  listAction({ type: "REMOVE_STOCK", data: ticker })
                }
                className="danger"
                text={"X"}
              />
            </td>
          )}
        </tr>
      )}
    </>
  );
};

export default TickerRow;
