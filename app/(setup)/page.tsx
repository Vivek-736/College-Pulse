import { initialProfile } from '@/lib/initial-profile'
import React from 'react'
import db from "@/lib/db"
import { redirect } from 'next/navigation'
import InitialModal from '../../components/models/initial-modal'

const SetupPage = async () => {
    const profile = await initialProfile();
    const server = await db.server.findFirst({
        where: {
            members: {
                some: {
                    profileId: profile && 'id' in profile ? profile.id : undefined
                }
            }
        }
    })

    if(server) {
        return redirect(`/communities/${server.id}`);
    }

    return <InitialModal />
}

export default SetupPage
