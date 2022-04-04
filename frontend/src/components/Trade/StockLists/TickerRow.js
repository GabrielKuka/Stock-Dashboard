import React, { useEffect, useState, useContext, useRef } from "react";
import { WebSocketContext } from "../../Test/websocket";
import { useSelector } from "react-redux";
import Helper from "../../../services/Helper";
import tradeService from "../../../services/trade";
import useTicker from "../../../hooks/useSocket";

const TickerRow = ({ ticker, edit, listAction }) => {
  const tickerData = useTicker(ticker);

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
