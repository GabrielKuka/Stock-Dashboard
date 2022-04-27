import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { alpaca } from "../../config/alpaca";
import Button from "../Core/button";

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

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return <div>${payload[0].value}</div>;
  }
  return null;
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

  const getPeriod = (period) => {
    if (!period) {
      return;
    }

    switch (period) {
      case "1w":
        return "1 Week";
      case "1m":
        return "1 Month";
      case "3m":
        return "3 Months";
      case "1y":
        return "1 Year";
    }
  };

  const makeCall = async (t, timeFrame = defaultTimeFrame) => {
    if (t.length > 0) {
      setTicker(t);
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
          price: b.ClosePrice,
          date: new Date(b.Timestamp).toLocaleDateString("en-US"),
        });
      }
      setData([...prices]);
    }
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

  return (
    <div style={{ marginTop: "8%" }}>
      {ticker && timeFrame && (
        <div>
          <h1>{ticker}</h1>
          <span>{getPeriod(timeFrame[3])}</span>
        </div>
      )}
      {data?.length > 0 && (
        <LineChart width={800} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <Line dot={false} dataKey="price" stroke="#8884d8" />
          <XAxis
            dataKey="date"
            height={60}
            angle={-60}
            dy={20}
            hide={true}
            minTickGap={15}
            tickLine={false}
          />
          <YAxis
            hide={true}
            tickLine={false}
            domain={[getMin(data), getMax(data)]}
            type="number"
            dataKey="price"
          />
          <Tooltip content={<CustomTooltip />} />
        </LineChart>
      )}
      {ticker && (
        <div className={"buttons"}>
          <Button
            className={"info"}
            text={"1w"}
            onClick={() => handleTimeFrame("1w")}
          />
          <Button
            className={"info"}
            text={"1m"}
            onClick={() => handleTimeFrame("1m")}
          />
          <Button
            className={"info"}
            text={"3m"}
            onClick={() => handleTimeFrame("3m")}
          />
          <Button
            className={"info"}
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
