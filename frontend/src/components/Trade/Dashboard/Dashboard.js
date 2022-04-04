import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import tradeService from "../../../services/trade";

import LoggedOut from "../../Core/LoggedOut";
import Sidebar from "./Sidebar";

import Header from "./Header";
import Overview from "./Overview";
import Stats from "./Stats";
import News from "./News";
import Technicals from "./Technicals";

import "./dashboard.scss";
import { changeTickerView } from "../../../reducers/tradeReducer";

const Dashboard = (props) => {
  const dispatch = useDispatch();
  // Get stonk and the dashboard view: Overview, Technicals, News, or Stats
  let stonk = useSelector(({ trade }) => trade.ticker);
  let tickerView = useSelector(({ trade }) => trade.tickerView);

  useEffect(async () => {
    // Initialize dashboard
    if (typeof tickerView === "undefined") {
      dispatch(changeTickerView("Overview"));
      tickerView = "Overview";

      // Make request to retrieve data
      const result = await tradeService.getTickerData(stonk, tickerView);
      const header = await tradeService.getHeader(stonk);

      tickerData(result, header);
    }

    return () => {};
  }, [tickerView]);

  const [data, setData] = useState([]);
  const [header, setHeader] = useState([]);

  if (!props.user) {
    return <LoggedOut />;
  }

  function tickerData(tickerData, h = header) {
    setHeader(h);
    setData(tickerData);
  }

  function handleViewRendering() {
    switch (tickerView) {
      case "Overview":
        return <Overview data={data} />;
      case "Stats":
        return <Stats data={data} />;
      case "News":
        return <News data={data} />;
      case "Technicals":
        return <Technicals />;
      default:
        return <p>Nothing</p>;
    }
  }

  return (
    <div className={"dashboard-wrapper"}>
      <div className={"sidebar-wrapper"}>
        <Sidebar tickerData={tickerData} ticker={stonk} />
      </div>
      <div id="page-content-wrapper">
        {stonk && tickerView && (
          <>
            <Header header={header} tickerView={tickerView} />
            <hr />
            <div className="card-text">{handleViewRendering()}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
