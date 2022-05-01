import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { alpaca } from "../../config/alpaca";
import Button from "../Core/button";
import "./test.scss";
import useTicker from "../../hooks/useTicker";
import Helper from "../../services/Helper";

const Alpaca = require("@alpacahq/alpaca-trade-api");

const client = new Alpaca({
  keyId: alpaca.api_token,
  secretKey: alpaca.secret_key,
  paper: true,
});

const getMin = (data) => {
  return Math.floor(
    Math.min.apply(
      null,
      data.map((item) => item.price)
    )
  );
};

const getMax = (data) => {
  return Math.ceil(
    Math.max.apply(
      null,
      data.map((item) => item.price)
    )
  );
};

const Searchfield = ({ makeCall }) => {
  const [input, setInput] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (input.length > 0) {
      makeCall(input);
    }
  };

  return (
    <div className={"searchfield"}>
      <input
        type="search"
        placeholder={"Enter ticker"}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        name={"ticker"}
        required
      />
      <Button
        text={"Search"}
        onClick={(e) => handleSearch(e)}
        className={"success"}
      />
    </div>
  );
};

const Test = () => {
  const defaultTimeFrame = [
    moment().add(-7, "days").format().slice(0, 10),
    moment().add(-2, "days").format().slice(0, 10),
    "1Min",
    "1w",
  ];

  const [data, setData] = useState([]);
  const [ticker, setTicker] = useState("");
  const [timeFrame, setTimeframe] = useState(defaultTimeFrame);
  const wrapper = useRef(null);

  const [tooltipData, setTooltipData] = useState("");

  const [tickerData, setTickerInput] = useTicker(ticker);

  const makeCall = async (t, timeFrame = defaultTimeFrame) => {
    setTicker(t);
    setTickerInput(t);
    let resp = client.getBarsV2(
      t,
      {
        start: timeFrame[0],
        end: timeFrame[1],
        timeframe: timeFrame[2],
        adjustment: "all",
      },
      client.configuration
    );

    const prices = [];

    for await (let b of resp) {
      prices.push({
        highPrice: b.HighPrice,
        lowPrice: b.LowPrice,
        openPrice: b.OpenPrice,
        volume: b.Volume,
        price: b.ClosePrice,
        date: new Date(b.Timestamp).toLocaleDateString("en-US"),
      });
    }
    setData([...prices]);
  };

  const handleTimeFrame = (frame) => {
    const yesterday = moment().add(-2, "days").format().slice(0, 10);
    if (frame === "1w") {
      const weekAgo = moment().add(-7, "days").format().slice(0, 10);
      setTimeframe([...[weekAgo, yesterday, "5Min", "1w"]]);
    }
    if (frame === "1m") {
      const monthAgo = moment().add(-1, "months").format().slice(0, 10);
      setTimeframe([...[monthAgo, yesterday, "30Min", "1m"]]);
    }
    if (frame === "3m") {
      const threeMonths = moment().add(-3, "months").format().slice(0, 10);
      setTimeframe([...[threeMonths, yesterday, "30Min", "3m"]]);
    }
    if (frame === "1y") {
      const yearAgo = moment().add(-1, "years").format().slice(0, 10);
      setTimeframe([...[yearAgo, yesterday, "1Day", "1y"]]);
    }
  };

  useEffect(async () => {
    await makeCall(ticker, timeFrame);
  }, [timeFrame]);

  const percentColor = () => {
    return {
      color: tickerData?.changePercent > 0 ? "green" : "red",
    };
  };

  return (
    <div ref={wrapper} className={"wrapper"} style={{ marginTop: "8%" }}>
      {ticker && timeFrame && (
        <div className={"wrapper__header"}>
          <div className={"ticker"}>{ticker.toUpperCase()}</div>
          <div className={"price"}>${tickerData?.price}</div>
          <div className={"changePercent"} style={percentColor()}>
            {tickerData?.changePercent}%
          </div>
          {tooltipData && (
            <div className={"tooltip-box"}>
              <div>
                <span>
                  <b>Open</b>
                </span>
                <span> ${Helper.formatNumber(tooltipData.openPrice)}</span>
              </div>
              <div>
                <span>
                  <b>Close</b>
                </span>
                <span>${Helper.formatNumber(tooltipData.price)}</span>
              </div>
              <div>
                <span>
                  <b>Low</b>
                </span>
                <span style={{ color: "red" }}>
                  ${Helper.formatNumber(tooltipData?.lowPrice)}
                </span>
              </div>
              <div>
                <span>
                  <b>High</b>
                </span>
                <span style={{ color: "green" }}>
                  ${Helper.formatNumber(tooltipData?.highPrice)}
                </span>
              </div>
              <div>
                <span>
                  <b>Volume</b>
                </span>
                <span>{tooltipData?.volume}</span>
              </div>
              <div>
                <span>
                  <b>Date</b>
                </span>
                <span>{tooltipData?.date}</span>
              </div>
            </div>
          )}
        </div>
      )}
      {data?.length > 0 && (
        <LineChart
          onMouseLeave={() => setTooltipData("")}
          className={"wrapper__chart"}
          width={800}
          height={300}
          data={data}
        >
          <Line dot={false} dataKey="price" stroke="#8884d8" />
          <XAxis
            dataKey="date"
            height={60}
            angle={-60}
            dy={20}
            minTickGap={15}
            tickLine={false}
            hide={true}
          />
          <YAxis
            hide={true}
            tickLine={false}
            domain={[getMin(data), getMax(data)]}
            type="number"
            dataKey="price"
          />
          <Tooltip
            content={({ active, payload }) => {
              const data = payload?.[0]?.payload;
              if (active && payload) {
                setTooltipData(data);
              }
              return null;
            }}
          />
        </LineChart>
      )}
      {ticker && (
        <div className={"wrapper__timeframe-buttons"}>
          <Button
            className={timeFrame[3] === "1w" ? "info" : "ternary"}
            text={"1w"}
            onClick={() => handleTimeFrame("1w")}
          />
          <Button
            className={timeFrame[3] === "1m" ? "info" : "ternary"}
            text={"1m"}
            onClick={() => handleTimeFrame("1m")}
          />
          <Button
            className={timeFrame[3] === "3m" ? "info" : "ternary"}
            text={"3m"}
            onClick={() => handleTimeFrame("3m")}
          />
          <Button
            className={timeFrame[3] === "1y" ? "info" : "ternary"}
            text={"1y"}
            onClick={() => handleTimeFrame("1y")}
          />
        </div>
      )}
      <br />
      <Searchfield makeCall={makeCall} />
    </div>
  );
};

export default Test;
