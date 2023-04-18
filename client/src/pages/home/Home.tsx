import { Chart } from "./components/chart/Chart";
import { Featured } from "./components/featured/Featured";
import { Widget } from "./components/widget/Widget";
import "./home.scss";

export const Home = () => {
  return (
    <div className="home">
      <div className="homeContainer">
        <div className="widgets">
          <Widget type="user" />
          <Widget type="signed" />
          <Widget type="unsigned" />
          <Widget type="unregistered" />
        </div>
        <div className="charts">
          <Featured />
          <Chart />
        </div>
      </div>
    </div>
  );
};
