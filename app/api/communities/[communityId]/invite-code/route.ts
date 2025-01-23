import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import db from "@/lib/db";
import { v4 as uuid } from "uuid";

export async function PATCH(req: Request, {params}: {params: {communityId: string}}) {
    try {
        const profile = await currentProfile();

        if(!profile) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        if(!params.communityId) {
            return new NextResponse("Server ID Missing", {status: 400});
        }

        const community = await db.server.update({
            where: {
                id: params.communityId,
                profileId: profile.id
            },
            data: {
                inviteCode: uuid()
            }
        });

        return NextResponse.json(community);
    }
    catch(error) {
        console.log("[SERVER_ID]", error);
        return new NextResponse("Internal Error", {status: 500});
    }
}