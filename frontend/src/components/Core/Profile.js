import React from "react";

import LoggedOut from "./LoggedOut";
import StockListsPage from "../Trade/StockLists/StockListsPage";

import "./style.css";

const ProfileItem = ({ data, label }) => {
  const itemStyle = {
    label: {
      color: "gray",
      textDecoration: "underline",
      fontSize: "0.8rem",
    },
    data: {
      fontSize: "1.3rem",
    },
  };
  return (
    <div className="list-group-item">
      <span style={itemStyle.label}>{label}</span>
      <p style={itemStyle.data}>{data}</p>
    </div>
  );
};

const Profile = ({ user }) => {
  if (!user) {
    return <LoggedOut />;
  }

  return (
    <div className="row profile-wrapper">
      <div className="col-md-4">
        <div className="card profile-data shadow p-3 mb-5 ">
          <div className="card-body">
            <h2 className="card-title">{user.name}</h2>
            <div className="list-group list-group-flush">
              <ProfileItem data={user?.email} label="Email" />
              <ProfileItem data={user?.phone} label="Phone Number" />
              <ProfileItem data={user?.birthday} label="Date of Birth" />
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-8">
        <div className="card trades-watchlists shadow p-3 mb-5 rounded">
          <div className="card-body">
            <p className="card-title">Trades</p>
            <div>Here we are going to list trades performed by the user</div>
          </div>
        </div>
        <StockListsPage user={user} />
      </div>
    </div>
  );
};

export default Profile;
