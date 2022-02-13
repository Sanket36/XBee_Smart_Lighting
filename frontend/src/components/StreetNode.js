import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Typography, Slider, Switch } from "@mui/material";
import { makeStyles } from "@mui/styles";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";
import Chart from "react-google-charts";
import axios from "axios";
import url from "./BaseURL";
import { Link } from "react-router-dom";
import { useNodeContext } from "../NodeContext";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const useStyles = makeStyles({
  root: {
    width: 600,
  },
});

const StreetNode = () => {
  const { id } = useParams();
  const { nodes, global, setIO, setInstValues } = useNodeContext();

  const item = nodes.find((node) => node.id === id);
  const classes = useStyles();

  const [graphData, setGraphData] = useState({ curr: [], temp: [] });

  useEffect(() => {
    const insterval = setInterval(() => {
      axios
        .get(url + "graphValues/", {
          params: { id: id },
        })
        .then((res) => {
          setGraphData(res.data);
          setInstValues(id, res.data.curr[10][1], res.data.temp[10][1]);
          console.log(res.data);
        });
    }, 7000);
    return () => clearInterval(insterval);
  }, []);

  const marks = [
    {
      value: 25,
      label: "25%",
    },
    {
      value: 50,
      label: "50%",
    },
    {
      value: 75,
      label: "75%",
    },
    {
      value: 100,
      label: "100%",
    },
  ];

  return (
    <div className="lg:container md:mx-auto mt-8 z-0">
      <div className="flex grid grid-flow-col grid-cols-6 gap-4 items-center m-8 mx-10 p-4 bg-gray-200 rounded-md  ">
        <Link to="/">
          <ArrowBackIosNewIcon />
        </Link>
        <div className="flex col-span-5 items-center justify-start text-2xl text-primary font-bold ">
          {id}
        </div>
        <div className="flex col-span-1 items-center justify-end">
          <Typography className="text-lg sm:text-sm text-primary font-bold">
            On/Off&nbsp; &nbsp;{" "}
          </Typography>
          <Switch
            checked={item.relay}
            disabled={global.isGlobal}
            color="success"
            onChange={() => {
              axios
                .get(url + "toggle/", {
                  params: { id: id, status: !item.relay ? "on" : "off" },
                })
                .then((res) => {
                  setIO(item.id, "relay", !item.relay);
                  console.log(item);
                });
            }}
            inputProps={{ "aria-label": "controlled" }}
          />
        </div>
      </div>
      <div className="flex z-99 grid grid-flow-col grid-cols-12 gap-4 items-center m-8 mx-10 ">
        <div className="flex col-span-6 items-center bg-blue-200 bg-opacity-25 rounded-md p-6">
          <span>
            <div className="text-gray-500 font-bold">
              Light Intensity &nbsp; &nbsp;
            </div>
          </span>
          <Slider
            size="large"
            className="mx-16"
            step={null}
            disabled={global.isGlobal}
            defaultValue={item.dim}
            aria-label="Default"
            valueLabelDisplay="auto"
            marks={marks}
            min={25}
            max={100}
            value={item.dim}
            onChange={(event, newValue) => {
              if (newValue !== item.dim) {
                axios
                  .get(url + "dimming/", {
                    params: { id: id, value: newValue },
                  })
                  .then((res) => {
                    setIO(id, "dim", newValue);
                  });
              }
            }}
          ></Slider>
        </div>

        <div className="flex items-center justify-center col-span-3 bg-blue-200 bg-opacity-25 rounded-md py-9 ">
          <span>
            <div className="text-gray-500 font-bold">
              Current flowing &nbsp;
            </div>
          </span>
          <FlashOnIcon className="text-yellow-500" />
          <Typography className="text-gray-600">
            {" "}
            &nbsp;{item.current} mA
          </Typography>
        </div>
        <div className="flex items-center justify-center col-span-3 bg-blue-200 bg-opacity-25 rounded-md py-9">
          <span>
            <div className="text-gray-500 font-bold">Temperature &nbsp;</div>
          </span>
          <DeviceThermostatIcon className="text-red-500" />
          <Typography className="text-gray-600">
            {" "}
            &nbsp;{item.temp} &deg; C
          </Typography>
        </div>
      </div>

      <div className="flex grid grid-flow-col grid-cols-6 gap-4 items-center justify-center mx-20 ">
        <div className="flex grid items-center justify-center col-span-2 mx-20 ">
          <Chart
            width={"550px"}
            height={"300px"}
            chartType="LineChart"
            loader={<div>Loading Chart</div>}
            data={[
              ["x", "light intensity"],
              [0, 0],
              [1, 10],
              [2, 23],
              [3, 17],
              [4, 18],
              [5, 9],
              [6, 11],
              [7, 27],
              [8, 33],
              [9, 40],
              [10, 32],
              [11, 35],
            ]}
            options={{
              hAxis: {
                title: "Time",
                maxValue: 15,
                minValue: 0,
                viewWindow: {
                  max: 10,
                },
              },
              vAxis: {
                title: "Light Intensity",
              },
              colors: ["#3366CC"],

              legend: { position: "none" },
              explorer: { axis: "horizontal" },
              aggregationTarget: "auto",
              animation: {
                startup: true,
                duration: 1000,
                easing: "linear",
              },
            }}
            rootProps={{ "data-testid": "1" }}
          />
          <div className="flex text-gray-500 font-bold items-center justify-center">
            Light Intensity
          </div>
        </div>
        <div className="flex grid items-center justify-center col-span-2 mx-20 ">
          <Chart
            width={"550px"}
            height={"300px"}
            chartType="LineChart"
            loader={<div>Loading Chart</div>}
            data={graphData.curr}
            options={{
              hAxis: {
                title: "Time",
                maxValue: 15,
                minValue: 0,
                viewWindow: {
                  max: 10,
                },
              },
              vAxis: {
                title: "Current",
              },
              colors: ["#F59E0B"],

              legend: { position: "none" },
              explorer: { axis: "horizontal" },
              aggregationTarget: "auto",
              animation: {
                startup: true,
                duration: 1000,
                easing: "linear",
              },
            }}
            rootProps={{ "data-testid": "1" }}
          />
          <div className="flex text-gray-500 font-bold items-center justify-center ">
            Current Flowing
          </div>
        </div>
        <div className="flex grid items-center justify-center col-span-2 mx-20 ">
          <Chart
            width={"550px"}
            height={"300px"}
            chartType="LineChart"
            loader={<div>Loading Chart</div>}
            data={graphData.temp}
            options={{
              hAxis: {
                title: "Time",
                maxValue: 15,
                minValue: 0,
                viewWindow: {
                  max: 10,
                },
              },
              vAxis: {
                title: "Temperature",
              },
              colors: ["#EF4444"],

              legend: { position: "none" },
              explorer: { axis: "horizontal" },
              aggregationTarget: "auto",
              animation: {
                startup: true,
                duration: 1000,
                easing: "linear",
              },
            }}
            rootProps={{ "data-testid": "1" }}
          />
          <div className="flex text-gray-500 font-bold items-center justify-center ">
            Temperature
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreetNode;
