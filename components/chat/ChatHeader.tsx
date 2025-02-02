import React from 'react'
import { MobileToggle } from "@/components/mobile-toggle";
import { Group } from 'lucide-react';
import UserAvatar from '../user-avatar';
import { SocketIndicator } from '../socket-indicator';

interface ChatHeaderProps {
    serverId: string;
    name: string;
    type: "channel" | "message";
    imageUrl?: string;
}

const ChatHeader = ({ serverId, name, type, imageUrl }: ChatHeaderProps) => {
    return (
        <div className='text-lg font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2'>
            <MobileToggle serverId={serverId} />
            {type === "channel" && (
                <Group className='w-5 h-5 text-green-700 dark:text-green-400 mr-2' />
            )}
            {type === "message" && (
                <UserAvatar src={imageUrl} className='h-8 w-8 mr-2' />
            )}
            <p className='font-semibold text-lg text-black dark:text-white'>
                {name}
            </p>
            <div className='ml-auto flex items-center'>
                <SocketIndicator />
            </div>
        </div>
    )
}

export default ChatHeader
