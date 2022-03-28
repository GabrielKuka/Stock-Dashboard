import React, { useEffect, useState } from "react";
import tradeService from "../../../services/trade";
import Button from "../../Core/button";
import { Link } from "react-router-dom";
import "./stocklistspage.scss";
import StockListCard from "./stocklistcard";

import { useDispatch } from "react-redux";

const Lists = ({ stockLists }) => {
  const dispatch = useDispatch();
  return (
    <div className="list-wrapper">
      {stockLists &&
        stockLists.map((list) => {
          return <StockListCard list={list} />;
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
