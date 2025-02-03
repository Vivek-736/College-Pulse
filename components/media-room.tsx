"use client";

import { useEffect, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

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

        // Use username or email as fallback
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
    }, [user?.id, chatId, user?.fullName, user?.primaryEmailAddress, user?.username]); // More stable dependency

    if (!token) {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
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