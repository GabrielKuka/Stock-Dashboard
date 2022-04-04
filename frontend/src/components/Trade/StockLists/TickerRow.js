import React from "react";
import Helper from "../../../services/Helper";
import useTicker from "../../../hooks/useTicker";

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
          <td>$ {tickerData.price}</td>
          <td style={changeStyle()}>
            {tickerData.changePercent}% (
            {Helper.formatNumber(tickerData.change)})
          </td>
          {edit && (
            <td>
              <button
                onClick={() =>
                  listAction({ type: "REMOVE_STOCK", data: ticker })
                }
                className="btn btn-danger"
              >
                X
              </button>
            </td>
          )}
        </tr>
      )}
    </>
  );
};

export default TickerRow;
