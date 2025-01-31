import { currentProfile } from '@/lib/current-profile';
import { redirect } from 'next/navigation';
import React from 'react'
import db from '@/lib/db';
import { ChannelSegregation, ChannelType } from '@prisma/client';
import SecHeader from './SecHeader';
import { ScrollArea } from '../ui/scroll-area';
import { Hash, Mic, Video, ShieldCheck, ShieldAlert } from 'lucide-react';
import { MemeberRole } from '@prisma/client';
import SecSidebarSearch from './SecSidebarSearch';

interface SecondarySidebarProps {
    serverId: string;
}

const iconMap = {
    [ChannelType.TEXT]: <Hash className='mr-2 h-4 w-4' />,
    [ChannelType.AUDIO]: <Mic className='mr-2 h-4 w-4' />,
    [ChannelType.VIDEO]: <Video className='mr-2 h-4 w-4' />,
}

const roleIconMap = {
    [MemeberRole.STUDENT]: null,
    [MemeberRole.COORDINATOR]: <ShieldCheck className='text-green-500 h-4 w-4 mr-2' />,
    [MemeberRole.ADMIN]: <ShieldAlert className='text-rose-500 h-4 w-4 mr-2' />
}

const SecondarySidebar = async ({ serverId }: SecondarySidebarProps) => {
    const profile = await currentProfile();

    if (!profile) {
        return redirect('/');
    }

    const community = await db.server.findUnique({
        where: {
            id: serverId
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: 'asc'
                }
            },
            members: {
                include: {
                    profile: true
                },
                orderBy: {
                    role: "asc"
                }
            }
        }
    });

    const textChannels = community?.channels.filter((channel) => channel.type === ChannelType.TEXT)

    const audioChannels = community?.channels.filter((channel) => channel.type === ChannelType.AUDIO)

    const videoChannels = community?.channels.filter((channel) => channel.type === ChannelType.VIDEO)

    const clubChannel = community?.channels.filter((channel) => channel.segregation === ChannelSegregation.CLUB)

    const courseChannel = community?.channels.filter((channel) => channel.segregation === ChannelSegregation.COURSE)

    const classChannel = community?.channels.filter((channel) => channel.segregation === ChannelSegregation.CLASS)

    const otherChannel = community?.channels.filter((channel) => channel.segregation === ChannelSegregation.OTHER)

    const members = community?.members.filter((member) => member.profileId !== profile.id)

    if (!community) {
        return redirect("/");
    }

    const role = community.members.find((member) => member.profileId === profile.id)?.role;

    return (
        <div className='flex flex-col h-full text-primary w-full bg-[#837df2] dark:bg-[#2a1b5a]'>
            <SecHeader
                community={community}
                role={role}
            />
            <ScrollArea>
                <div className='flex-1 px-3'>
                    <div className='mt-2'>
                    <SecSidebarSearch
                            data={[
                                {
                                    label: "Text Channels",
                                    type: "Channel",
                                    data: textChannels?.map((channel) => ({
                                        id: channel.id,
                                        name: channel.name,
                                        icon: iconMap[channel.type]
                                    }))
                                },
                                {
                                    label: "Voice Channels",
                                    type: "Channel",
                                    data: audioChannels?.map((channel) => ({
                                        id: channel.id,
                                        name: channel.name,
                                        icon: iconMap[channel.type]
                                    }))
                                },
                                {
                                    label: "Video Channels",
                                    type: "Channel",
                                    data: videoChannels?.map((channel) => ({
                                        id: channel.id,
                                        name: channel.name,
                                        icon: iconMap[channel.type]
                                    }))
                                },
                                {
                                    label: "Members",
                                    type: "member",
                                    data: members?.map((member) => ({
                                        id: member.id,
                                        name: member.profile.name,
                                        icon: roleIconMap[member.role]
                                    }))
                                }
                            ]}
                        />
                    </div>
                </div>
            </ScrollArea>
        </div>
    )
}

export default SecondarySidebar
