"use client";
import { ServerWithMembersWithProfiles } from '@/types';
import { ChannelSegregation, ChannelType, MemeberRole } from '@prisma/client';
import React from 'react'
import ActionTooltip from '../action-tooltip';
import { Plus, Settings } from 'lucide-react';
import { useModal } from '@/hooks/use-modal-store';

interface ChannelSectionProps {
    label: string;
    role?: MemeberRole;
    sectionType: "channels" | "members";
    channelType?: ChannelType;
    channelSegregation?: ChannelSegregation;
    community?: ServerWithMembersWithProfiles;
}

const ChannelSection = ({
    label,
    role,
    sectionType,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    channelType,
    channelSegregation,
    community
}: ChannelSectionProps) => {
    const { onOpen } = useModal();
    return (
        <div className='flex items-center justify-between py-2'>
            <p className='text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-300'>
                {label}
            </p>

            {role !== MemeberRole.STUDENT && sectionType === "channels" && (
                <ActionTooltip label='Create Channel' side='top'>
                    <button onClick={() => onOpen("createChannel", {channelSegregation})} className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-300 dark:hover:text-zinc-100 transition'>
                        <Plus className='h-4 w-4' />
                    </button>
                </ActionTooltip>
            )}

            {role === MemeberRole.ADMIN && sectionType === "members" && (
                <ActionTooltip label='Manage Members' side='top'>
                    <button onClick={() => onOpen("members", {community})} className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-300 dark:hover:text-zinc-100 transition'>
                        <Settings className='h-4 w-4' />
                    </button>
                </ActionTooltip>
            )}

        </div>
    )
}

export default ChannelSection
