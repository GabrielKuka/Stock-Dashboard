import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import tradeService from "../../../services/trade";

import LoggedOut from "../../Core/LoggedOut";
import TickerRow from "./TickerRow";

import "./style.css";
import "./stocklist.scss";
import Moment from "react-moment";
import { errorModal, promptModal } from "../../../reducers/modalReducer";

const StockList = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector(({ user }) => user);
  const confirmPrompt = useSelector(({ modal }) => modal.data.confirm);

  const title = useParams().title;
  const [listDates, setListDates] = useState({});
  const [tickerList, setTickerList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // Retrieve stock list data
      const response = await tradeService.listAction("GET_LIST_DATA", title);
      setTickerList(response);
      setListDates({
        updated_on: response.updated_on,
        created_on: response.created_on,
      });
    };

    fetchData();
  }, []);

  useEffect(() => {
    const deleteList = async () => {
      if (confirmPrompt) {
        try {
          await tradeService.listAction("DELETE", tickerList.id);
          history.push("/lists");
        } catch (exception) {
          dispatch(errorModal("An Error Occurred"));
        }
        dispatch(promptModal("", false, false));
      }
    };

    deleteList();
  }, [confirmPrompt]);

  if (!user) {
    return <LoggedOut />;
  }

  const promptDelete = async () => {
    dispatch(promptModal("Are you sure you want to delete the list?"));
  };

  const handleEdit = () => {
    history.push(`/editlist/${title}`);
  };

  return (
    <div className="stocklist-table-wrapper">
      <div className="card shadow p-2" style={{ marginTop: "2rem" }}>
        <div className="card-body">
          <h2 className="card-title">{title}</h2>
          <table className="table table-bordered table-sm ">
            <thead className="table-dark">
              <tr key="header">
                <td>Stock</td>
                <td>Price</td>
                <td>Change</td>
              </tr>
            </thead>
            <tbody>
              {tickerList.stocks &&
                tickerList.stocks.map((stock) => {
                  return (
                    <TickerRow
                      ticker={stock.ticker}
                      edit={false}
                      key={stock.ticker}
                    />
                  );
                })}
            </tbody>
          </table>
          <div className="d-grid">
            <button className="btn btn-danger" onClick={() => promptDelete()}>
              Delete List
            </button>

            <button
              className="btn btn-outline-secondary list-option"
              onClick={() => handleEdit()}
            >
              Edit List
            </button>
            <p className="badge bg-info text-light list-badge">
              Created <Moment fromNow>{listDates.created_on}</Moment>
            </p>
            <p className="badge bg-success text-light list-badge">
              Updated <Moment fromNow>{listDates.updated_on}</Moment>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockList;
