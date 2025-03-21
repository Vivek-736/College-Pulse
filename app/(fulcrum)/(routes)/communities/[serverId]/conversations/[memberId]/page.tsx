import { currentProfile } from '@/lib/current-profile';
import { RedirectToSignIn } from '@clerk/nextjs';
import React from 'react';
import db from "@/lib/db";
import { getOrCreateConversation } from '@/lib/conversation';
import { redirect } from 'next/navigation';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatInput from '@/components/chat/ChatInput';
import { MediaRoom } from '@/components/media-room';

interface MemberIdPageProps {
    params: {
        memberId: string;
        serverId: string;
    },
    searchParams: {
        video?: boolean;
        audio?: boolean;
    }
}

const MemberIdPage = async ({ params, searchParams }: MemberIdPageProps) => {
    const profile = await currentProfile();

    if (!profile) {
        return RedirectToSignIn({ redirectUrl: "/" });
    }

    const currentMember = await db.member.findFirst({
        where: {
            serverId: params.serverId,
            profileId: profile.id
        },
        include: {
            profile: true
        }
    })

    if (!currentMember) {
        return RedirectToSignIn({ redirectUrl: "/" });
    }

    const conversation = await getOrCreateConversation(currentMember.id, params.memberId);

    if (!conversation) {
        return redirect(`/communities/${params.serverId}`);
    }

    const { memberOne, memberTwo } = conversation;

    const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne;

    return (
        <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
            <ChatHeader
                imageUrl={otherMember.profile.imageUrl}
                name={otherMember.profile.name}
                serverId={params.serverId}
                type='conversation'
            />
            {searchParams.video && (
                <MediaRoom
                    chatId={conversation.id}
                    video={true}
                    audio={true}
                />
            )}
            {searchParams.audio && (
                <MediaRoom
                    chatId={conversation.id}
                    video={false}
                    audio={true}
                />
            )}
            {(!searchParams.video && !searchParams.audio) && (
                <>
                    <ChatMessages
                        member={currentMember}
                        name={otherMember.profile.name}
                        chatId={conversation.id}
                        type='conversation'
                        apiUrl='/api/direct-messages'
                        paramKey='conversationId'
                        paramValue={conversation.id}
                        socketUrl='/api/socket/direct-messages'
                        socketQuery={{
                            conversationId: conversation.id,
                        }}
                    />
                    <ChatInput
                        name={otherMember.profile.name}
                        type='conversation'
                        apiUrl='/api/socket/direct-messages'
                        query={{
                            conversationId: conversation.id,
                        }}
                    />
                </>
            )}
        </div>
    )
}

export default MemberIdPage
