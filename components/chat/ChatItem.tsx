"use client";

import { Member, MemeberRole, Profile } from '@prisma/client';
import React from 'react'
import UserAvatar from '../user-avatar';
import ActionTooltip from '../action-tooltip';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

interface ChatItemProps {
    id: string;
    content: string;
    member: Member & {
        profile: Profile;
    };
    timeStamp: string;
    fileUrl: string | null;
    deleted: boolean;
    currentMember: Member;
    isUpdated: boolean;
    socketUrl: string;
    socketQuery: Record<string, string>;
}

const roleIconMap = {
    'STUDENT': null,
    'COORDINATOR': <ShieldCheck className='h-4 w-4 ml-2 text-green-400' />,
    'ADMIN': <ShieldAlert className='h-4 m-4 ml-2 text-rose-400' />
}

const ChatItem = ({
    id, content, member, timeStamp, fileUrl, deleted, currentMember, isUpdated, socketQuery, socketUrl
}: ChatItemProps) => {
    const fileType = fileUrl?.split('.').pop();
    const isAdmin = currentMember.role === MemeberRole.ADMIN;
    const isCoordinator = currentMember.role === MemeberRole.COORDINATOR
    const isOwner = currentMember.id === member.id
    const canDeleteMessage = !deleted && (isAdmin || isCoordinator || isOwner);
    const canEditMessage = !deleted && isOwner && !fileUrl;
    const isPDF = fileType === 'pdf' && fileUrl;
    const isImage = !isPDF && fileUrl;

    return (
        <div className='relative group flex items-center hover:bg-black/5 p-4 transition w-full'>
            <div className='group flex gap-x-2 items-start w-full'>
                <div className='cursor-pointer hover:drop-shadow-md transition'>
                    <UserAvatar src={member.profile.imageUrl} />
                </div>
                <div className='flex flex-col w-full'>
                    <div className='flex items-center gap-x-2'>
                        <div className='flex items-center'>
                            <p className='font-semibold text-sm hover:underline cursor-pointer'>
                                {member.profile.name}
                            </p>
                            <ActionTooltip label={member.role}>
                                {roleIconMap[member.role]}
                            </ActionTooltip>
                        </div>
                        <span className='text-xs text-zinc-500 dark:text-zinc-400'>
                            {timeStamp}
                        </span>
                    </div>
                    {content}
                </div>
            </div>
        </div>
    )
}

export default ChatItem
