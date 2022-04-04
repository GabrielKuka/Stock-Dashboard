import React from "react";

const News = ({ data }) => {
  const styles = {
    cardStyle: {
      marginTop: "0.5rem",
    },
  };

  const timeFormat = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };

  const date = (date) => {
    return new Intl.DateTimeFormat("en-US", timeFormat).format(date);
  };

  return (
    <div className="card-columns">
      {data?.map?.((item) => {
        return (
          <div className="card" style={styles.cardStyle}>
            <a href={item?.url}>
              <img
                src={item?.image}
                alt={item?.datetime}
                className="card-img-top"
              />
            </a>
            <div className="card-body">
              <div className="card-title">{item?.headline}</div>
              <hr />
              <p className="card-text">
                <small className="text-muted">{date(item?.datetime)}</small>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default News;
