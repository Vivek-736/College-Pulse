import { currentProfile } from '@/lib/current-profile';
import { RedirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react';
import db from "@/lib/db";

interface InviteCodePageProps {
    params: {
        inviteCode: string;
    }
}

const InviteCodePage: React.FC<InviteCodePageProps> = async ({
    params
}: InviteCodePageProps) => {
    const profile = await currentProfile();

    if (!profile) {
        return RedirectToSignIn({ redirectUrl: "/" });
    }

    if(!params.inviteCode) {
        return redirect("/");
    }

    const existingCommunity = await db.server.findFirst({
        where: {
            inviteCode: params.inviteCode,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    if(existingCommunity) {
        return redirect(`/communities/${existingCommunity.id}`);
    }

    const community = await db.server.update({
        where: {
            inviteCode: params.inviteCode
        },
        data: {
            members: {
                create: [
                    {
                        profileId: profile.id
                    }
                ]
            }
        }
    })

    if(community) {
        return redirect(`/communities/${community.id}`);
    }

    return (
        <div>

        </div>
    )
}

export default InviteCodePage
