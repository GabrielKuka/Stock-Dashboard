import React from "react";
import { LineChart, Line, XAxis, YAxis } from "recharts";

const Test = () => {
  const data = [
    {
      name: "MSFT",
      price: 280,
    },
    {
      name: "AAPL",
      price: 160,
    },
    {
      name: "TSLA",
      price: 1000,
    },
    {
      name: "TWTR",
      price: 50,
    },
    {
      name: "AAL",
      price: 20,
    },
  ];

  return (
    <div style={{ marginTop: "8%" }}>
      <LineChart width={600} height={300} data={data}>
        <Line type="monotone" dataKey="price" stroke="#8884d8" />
        <XAxis dataKey="name" />
        <YAxis dataKey="price" />
      </LineChart>
    </div>
  );
};

export default Test;
