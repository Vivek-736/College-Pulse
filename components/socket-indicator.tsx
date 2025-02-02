"use client";

import { useSocket } from "./providers/socket-provider";
import { Badge } from "./ui/badge";

export const SocketIndicator = () => {
    const {isConnected} = useSocket();
    
    if(!isConnected) {
        return (
            <Badge variant="outline" className="bg-yellow-600 text-white md:p-2">
                Loading.....
            </Badge>
        )
    }

    return (
        <Badge variant="outline" className="bg-green-600 text-white md:p-2">
            Welcome to College Pulse
        </Badge>
    )
}