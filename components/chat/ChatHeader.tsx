import React from 'react'
import { MobileToggle } from "@/components/mobile-toggle";
import { Group } from 'lucide-react';

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
            <p className='font-semibold text-lg text-black dark:text-white'>
                {name} <span className='text-lg text-neutral-600 dark:text-neutral-200'>Channel</span>
            </p>
        </div>
    )
}

export default ChatHeader
