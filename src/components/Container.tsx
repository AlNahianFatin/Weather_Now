import React from "react";
import { cn } from "../utils/cn";

export default function Conatiner(Props: React.HTMLProps<HTMLDivElement>) {
    return (
        <div {...Props} className={cn("w-full bg-white rounded-xl flex py-4 shadow-sm", Props.className)}>
        </div>
    );
}