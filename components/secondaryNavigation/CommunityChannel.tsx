"use client";
import { Channel, ChannelType, MemeberRole, Server } from '@prisma/client';
import { Edit, Hash, Lock, Mic, Trash, Video } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react'
import { cn } from '@/lib/utils';
import ActionTooltip from '../action-tooltip';
import { ModalType, useModal } from '@/hooks/use-modal-store';

interface CommunityChannelProps {
    channel: Channel;
    community: Server;
    role?: MemeberRole
}

const iconMap = {
    [ChannelType.TEXT]: Hash,
    [ChannelType.AUDIO]: Mic,
    [ChannelType.VIDEO]: Video,
}

const CommunityChannel = ({ channel, community, role }: CommunityChannelProps) => {
    const { onOpen } = useModal();
    const params = useParams();
    const router = useRouter();

    const Icon = iconMap[channel.type]

    const onClick = () => {
        router.push(`/communities/${params?.serverId}/channels/${channel.id}`)
    }

    const onAction = (e: React.MouseEvent, action: ModalType) => {
        e.stopPropagation();
        onOpen(action, { community, channel })
    }

    return (
        <button onClick={onClick} className={cn("group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1", params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700")}>
            <Icon className='flex-shrink-0 w-5 h-5
             text-zinc-500 dark:text-zinc-400' />
            <p className={cn("line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition", params?.channelId === channel.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white")}>
                {channel.name}
            </p>
            {channel.name !== "general" && role !== MemeberRole.STUDENT && role !== MemeberRole.COORDINATOR && (
                <div className='ml-auto gap-x-2 flex items-center'>
                    <ActionTooltip label='Edit'>
                        <Edit onClick={(e) => onAction(e, "editChannel")} className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition" />
                    </ActionTooltip>
                    <ActionTooltip label='Delete'>
                        <Trash onClick={(e) => onAction(e, "deleteChannel")} className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition" />
                    </ActionTooltip>
                </div>
            )}
            {channel.name === "general" && (
                <Lock
                    className='ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400'
                />
            )}
        </button>
    )
}

export default CommunityChannel
