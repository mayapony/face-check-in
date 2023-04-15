import { ResponsiveLine } from "@nivo/line";
import { data } from "./data";

export const Chart = () => {
  return (
    <div className="flex w-2/3  flex-col rounded-md p-3 shadow-xl">
      <h1 className="font-bold text-gray-500">过去6个月签到人数</h1>
      <ResponsiveLine
        data={data}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: true,
        }}
        yFormat=".2f"
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "签到人数",
          legendOffset: 40,
          legendPosition: "middle",
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "count",
          legendOffset: -40,
          legendPosition: "middle",
        }}
        pointSize={10}
        margin={{ top: 20, right: 50, bottom: 50, left: 50 }}
        enableArea={true}
        curve="natural"
      />
    </div>
  );
};
