import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { alpaca, auth_data } from "../../config/alpaca";

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
    return <div>{payload[0].value}</div>;
  }
  return null;
};

const Test = () => {
  const [data, setData] = useState([]);

  useEffect(async () => {
    let resp = client.getBarsV2(
      "AAPL",
      {
        start: "2021-02-01",
        end: "2021-02-10",
        timeframe: "1Day",
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
  }, []);

  return (
    <div style={{ marginTop: "8%" }}>
      {data?.length > 0 && (
        <LineChart width={800} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <Line dataKey="price" stroke="#8884d8" />
          {console.log(data.map((item) => item.date))}
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
    </div>
  );
};

export default Test;
