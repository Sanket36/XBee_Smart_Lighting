import React, { useState, useEffect } from "react";
import { Typography, Button, Switch } from "@mui/material";
import { useParams } from "react-router-dom";
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import axios from "axios";
import url from "./BaseURL";
import { TimeSelecter } from "./TimeSelecter";
import { IntensitySelecter } from "./IntensitySelecter";
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import FormControl from '@mui/material/FormControl';


export const Scheduler = () => {

    const [isToggled, setIsToggled] = useState(false);
    const { id } = useParams();
    const [count, setCount] = useState(0);


    useEffect(() => {
        axios.get(url + "toggle/", {
            params: { id: id, status: isToggled ? "on" : "off" },
        });
    }, [isToggled]);

    return (
        <div className="lg:container md:mx-auto mt-8 z-0">
            <div className="flex grid grid-flow-col grid-cols-6 gap-4 items-center m-8 mx-10 p-4 bg-gray-200 rounded-md  ">

                <div className="flex col-span-1 items-center justify-start">
                    <Typography className="text-lg sm:text-sm text-primary font-bold">
                        Auto / Manual  &nbsp; &nbsp;{" "}
                    </Typography>
                    <Switch
                        checked={isToggled}
                        color="success"
                        onChange={() => setIsToggled(!isToggled)}
                        inputProps={{ "aria-label": "controlled" }}
                    />
                </div>
            </div>
            <div className="flex grid grid-flow-col grid-cols-5 gap-4 items-center m-8 mx-10 p-4 bg-gray-200 rounded-md">
                <div className="flex col-span-1 items-center justify-start p-4 bg-gray-50 rounded-md">
                    <LightModeIcon className="text-yellow-500" /><span> &nbsp; &nbsp; Sunrise Time:</span>
                    <span> &nbsp; &nbsp; 06:00 AM</span>
                </div>

                <div className="flex col-span-1 items-center justify-start p-4 bg-gray-50 rounded-md">
                    <DarkModeIcon className="text-blue-500" /><span> &nbsp; &nbsp; Sunset Time:</span>
                    <span> &nbsp; &nbsp; 06:00 PM</span>
                </div>
            </div>

            <div className="flex grid grid-flow-col grid-cols-12 gap-4 items-center m-8 mx-10 rounded-md">
                <div className="flex col-span-3 items-center justify-start mr-14 p-4 bg-gray-200 rounded-md">
                    <Typography className="text-lg sm:text-sm text-primary font-bold">For Non-Peak Hours:</Typography>
                </div>
                <div className="flex col-start-4 col-span-2 items-center justify-center rounded-md">
                    <TimeSelecter />
                </div>
                <div className="flex col-start-6 col-span-2 items-center justify-center rounded-md">
                    <IntensitySelecter ></IntensitySelecter>
                </div>
                <div className="flex col-start-8 col-span-1 items-center justify-center mr-16 rounded-md">
                    <RemoveCircleIcon color="error" />
                </div>
                <div className="flex col-start-10 col-span-2 items-center justify-center rounded-md">
                    <Button
                        onClick={() => {
                            setCount(count + 1)
                        }}
                        color="primary"
                        variant= "contained"
                    >
                       Add
                    </Button>

                </div>
            </div>
        </div >
    )
}
