"use client";

import { useEffect, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { useUser } from "@clerk/nextjs";
import Loading from "@/app/loading";

interface MediaRoomProps {
    chatId: string;
    video: boolean;
    audio: boolean;
}

export const MediaRoom = ({ chatId, video, audio }: MediaRoomProps) => {
    const { user } = useUser();
    const [token, setToken] = useState("");

    useEffect(() => {
        if (!user?.id) return;

        const name = user.username || user.fullName || user.primaryEmailAddress?.emailAddress;
        if (!name) return;

        (async () => {
            try {
                const resp = await fetch(
                    `/api/livekit?room=${chatId}&username=${encodeURIComponent(name)}`
                );
                const data = await resp.json();
                setToken(data.token);
            } catch (error) {
                console.error("Error fetching LiveKit token:", error);
            }
        })();
    }, [user?.id, chatId, user?.fullName, user?.primaryEmailAddress, user?.username]);

    if (!token) {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <Loading />
                <p>
                    Loading...
                </p>
            </div>
        )
    }

    return (
        <LiveKitRoom
            data-lk-theme="default"
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
            token={token}
            connect={true}
            video={video}
            audio={audio}
            onConnected={() => console.log("Connected to LiveKit")}
            onDisconnected={() => console.log("Disconnected from LiveKit")}
        >
            <VideoConference />
        </LiveKitRoom>
    )
}