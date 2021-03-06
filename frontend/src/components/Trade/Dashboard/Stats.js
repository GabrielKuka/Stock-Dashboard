import React from "react";
import Helper from "../../../services/Helper";

const Stats = ({ data }) => {
  if (!data) {
    return null;
  }
  return (
    <div className="container-fluid">
      <div className="row">
        {data?.sharesOutstanding && (
          <div className="col-sm">
            <label>
              <b>Shares Outstanding</b>
            </label>
            <p>{Helper.formatNumber(data.sharesOutstanding)}</p>
          </div>
        )}
        {data?.peRatio && (
          <div className="col-sm">
            <label>
              <b>PE Ratio</b>
            </label>
            <p>{parseFloat(data.peRatio).toFixed(1)}</p>
          </div>
        )}
        {data?.ttmEPS && (
          <div className="col-sm">
            <label>
              <b>EPS</b>
            </label>
            <p>{data.ttmEPS}</p>
          </div>
        )}
      </div>
      <div className="row">
        {data?.marketcap && (
          <div className="col-sm">
            <label>
              <b>Market Cap</b>
            </label>
            <p>${Helper.formatNumber(data.marketcap)}</p>
          </div>
        )}
        {data?.week52high && (
          <div className="col-sm">
            <label>
              <b>52 Week High</b>
            </label>
            <p>${data.week52high}</p>
          </div>
        )}
        {data?.week52low && (
          <div className="col-sm">
            <label>
              <b>52 Week Low</b>
            </label>
            <p>${data.week52low}</p>
          </div>
        )}
      </div>
      <div className="row">
        {data?.dividendYield && (
          <div className="col-sm">
            <label>
              <b>Divident Yield</b>
            </label>
            <p>{parseFloat(data.dividendYield * 100).toFixed(3)}%</p>
          </div>
        )}
        {data?.nextDividendDate && (
          <div className="col-sm">
            <label>
              <b>Next Dividend Date</b>
            </label>
            <p>{data.nextDividendDate}</p>
          </div>
        )}
        {data.exDividendDate && (
          <div className="col-sm">
            <label>
              <b>exDividendDate</b>
            </label>
            <p>{data.exDividendDate}</p>
          </div>
        )}
      </div>
      <div className="row">
        {data?.day200MovingAvg && (
          <div className="col-sm">
            <label>
              <b>200 Day Moving Avg</b>
            </label>
            <p>${data.day200MovingAvg}</p>
          </div>
        )}
        {data?.day50MovingAvg && (
          <div className="col-sm">
            <label>
              <b>50 Day Moving Avg</b>
            </label>
            <p>${data.day50MovingAvg}</p>
          </div>
        )}
        {data?.ytdChangePercent && (
          <div className="col-sm">
            <label>
              <b>Change YTD</b>
            </label>
            <p>{parseFloat(data.ytdChangePercent).toFixed(2)}%</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stats;
