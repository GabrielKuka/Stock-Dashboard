import React from "react";
import { useDispatch } from "react-redux";
import { changeTicker } from "../../../reducers/tradeReducer";
import "./stocklistcard.scss";
import StockRow from "./StockRow";
import { Link } from "react-router-dom";

const StockListCard = ({ list }) => {
  const dispatch = useDispatch();
  return (
    <div className={"card-wrapper"}>
      <div className={"card-wrapper__header"}>
        <Link className={"link header-link"} to={"/stocklist/" + list?.title}>
          <h2 className={"list-title"}>{list?.title}</h2>
        </Link>
      </div>
      <div className={"card-wrapper__list"}>
        {list?.stocks?.map?.((stock) => {
          return (
            <Link
              to={{ pathname: "/dashboard" }}
              key={stock.ticker}
              onClick={() => dispatch(changeTicker(stock?.ticker))}
              className={"link item-link"}
            >
              <StockRow ticker={stock?.ticker} />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default StockListCard;
