import React from "react";

import LoggedOut from "./LoggedOut";
import StockListsPage from "../Trade/StockLists/StockListsPage";

import "./style.css";
import "./profile.scss";

const ProfileItem = ({ data, label }) => {
  return (
    <div className={"user-data-item"}>
      <div className={"user-data-item__label"}>{label}</div>
      <div className={"user-data-item__data"}>{data}</div>
    </div>
  );
};

const Profile = ({ user }) => {
  if (!user) {
    return <LoggedOut />;
  }

  return (
    <section className={"profile-wrapper"}>
      <div className={"profile-wrapper__side"}>
        <ProfileItem data={user?.name} label={"Username:"} />
        <ProfileItem data={user?.email} label={"Email:"} />
        <ProfileItem data={user?.birthday} label={"Birthdate:"} />
        <ProfileItem data={user?.phone} label={"Phone number:"} />
      </div>
      <div className={"profile-wrapper__main"}>
        <StockListsPage user={user} />
      </div>
    </section>
  );
};

export default Profile;
