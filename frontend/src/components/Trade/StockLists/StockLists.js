import React, { useEffect, useState } from "react";
import tradeService from "../../../services/trade";
import { Link } from "react-router-dom";
import "./style.css";

import StockRow from "./StockRow";
import { useDispatch } from "react-redux";
import { changeTicker, changeTickerView } from "../../../reducers/tradeReducer";

const StockLists = ({ user }) => {
  const dispatch = useDispatch();
  const [stockLists, setLists] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await tradeService.listAction("GET_ALL_LISTS");
      setLists(result);
    };
    fetchData();
  }, []);

  const Lists = () => {
    return (
      <div className="card-columns">
        {stockLists &&
          stockLists.length > 0 &&
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
                  {list.stocks &&
                    list.stocks.length > 0 &&
                    list.stocks.map((stonk) => {
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

  return (
    <div className="main_wrapper body">
      {user && (
        <div>
          <p className="header">
            <Link className="btn btn-outline-dark" to="/createlist">
              +
            </Link>
            <span> </span>
            My stock lists:
          </p>
          <Lists />
        </div>
      )}
    </div>
  );
};

export default StockLists;
