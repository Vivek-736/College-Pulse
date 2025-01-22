import { currentProfile } from '@/lib/current-profile';
import { redirect } from 'next/navigation';
import React from 'react'
import db from '@/lib/db';
import { ChannelSegregation, ChannelType } from '@prisma/client';
import SecHeader from './SecHeader';

interface SecondarySidebarProps {
    serverId: string;
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

    if(!community) {
        return redirect("/");
    }

    const role = community.members.find((member) => member.profileId === profile.id)?.role;

    return (
        <div className='flex flex-col h-full text-primary w-full bg-[#837df2] dark:bg-[#2a1b5a]'>
            <SecHeader
                community={community}
                role={role}
            />
        </div>
    )
}

export default SecondarySidebar
