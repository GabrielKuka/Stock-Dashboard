import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";

import LoggedOut from "../../Core/LoggedOut";
import Sidebar from "./Sidebar";

import Header from "./Header";
import Overview from "./Overview";
import Stats from "./Stats";
import News from "./News";
import Technicals from "./Technicals";

import "./dashboard.css";

const Dashboard = (props) => {
  // Get stonk and the dashboard view: Overview, Technicals, News, or Stats
  let stonk = useSelector(({ trade }) => trade.ticker);
  let tickerView = useSelector(({ trade }) => trade.tickerView);

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
    <Container fluid>
      <Row>
        <Col xs={4} id="sidebar-wrapper">
          <Sidebar tickerData={tickerData} ticker={stonk} />
        </Col>
        <Col xs={8} id="page-content-wrapper">
          {stonk && stonk.length > 0 && (
            <div className="card content-card">
              <h5 style={{ textAlign: "center" }}>
                <b>{tickerView}</b>
              </h5>
              <div className="card-body">
                <Header header={header} />
                <hr />
                <div className="card-text">{handleViewRendering()}</div>
              </div>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
