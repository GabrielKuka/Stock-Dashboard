import React, { useEffect, useState } from "react";
import tradeService from "../../../services/trade";
import Button from "../../Core/button";
import { Link } from "react-router-dom";
import "./stocklistspage.scss";

import StockRow from "./StockRow";
import { useDispatch } from "react-redux";
import { changeTicker } from "../../../reducers/tradeReducer";

const Lists = ({ stockLists }) => {
  const dispatch = useDispatch();
  return (
    <div className="list-wrapper">
      {stockLists &&
        stockLists.map((list) => {
          return (
            <div
              key={list.id}
              className="card shadow p-3 mb-5 rounded"
              style={{ width: "16em" }}
            >
              <Link className="card-body" to={"/stocklist/" + list.title}>
                <h2 className="card-title">{list.title}</h2>
              </Link>
              <div className="list-group list-group-flush">
                {list.stocks.map((stonk) => {
                  return (
                    <Link
                      onClick={() => dispatch(changeTicker(stonk.ticker))}
                      key={stonk.ticker}
                      to={{ pathname: "/dashboard" }}
                      className="list-group-item list-group-item-action"
                    >
                      <StockRow ticker={stonk.ticker} />
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
    </div>
  );
};

const StockListsPage = ({ user }) => {
  const [stockLists, setLists] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await tradeService.listAction("GET_ALL_LISTS");
      setLists(result);
    };
    fetchData();
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div className="main-wrapper">
      <p className="main-wrapper__header">
        <Link to="/createlist">
          <Button text={"+"} className={"add-list-button"} />
        </Link>
        <span> </span>
        My stock lists:
      </p>
      <Lists stockLists={stockLists} />
    </div>
  );
};

export default StockListsPage;
