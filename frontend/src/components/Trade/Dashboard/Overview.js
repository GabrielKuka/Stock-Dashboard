import React from "react";
import Helper from "../../../services/Helper";

const Overview = ({ data }) => {
  return (
    <div className="container-fluid">
      <div className="row">
        {data?.CEO && (
          <div className="col-sm">
            <label>
              <b>CEO</b>
            </label>
            <p>{data.CEO}</p>
          </div>
        )}
        {data?.industry && (
          <div className="col-sm">
            <label>
              <b>Industry</b>
            </label>
            <p>{data.industry}</p>
          </div>
        )}
        {data?.sector && (
          <div className="col-sm">
            <label>
              <b>Sector</b>
            </label>
            <p>{data.sector}</p>
          </div>
        )}
      </div>
      <div className="row">
        <div className="col-sm">
          {data?.employees && (
            <>
              <label>
                <b>Employees</b>
              </label>
              <p>{Helper.formatNumber(data.employees)}</p>
            </>
          )}
        </div>
        {data?.city && data?.country && data?.state && (
          <div className="col-sm">
            <label>
              <b>Address</b>
            </label>
            <p>
              {data.city} {data.state}, {data.country}
            </p>
          </div>
        )}
        {data?.website && (
          <div className="col-sm">
            <label>
              <b>Website</b>
            </label>
            <p>{data.website}</p>
          </div>
        )}
      </div>
      {data?.description && (
        <div className="row">
          <div className="col-sm">
            <label>
              <b>Description</b>
            </label>
            <p>{data.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;
