import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function PATCH(req: Request, { params }: { params: { communityId: string } }) {
    try {
        const profile = await currentProfile();
        const { name, imageUrl } = await req.json();

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const community = await db.server.update({
            where: {
                id: params.communityId,
                profileId: profile.id
            },
            data: {
                name,
                imageUrl
            }
        });
        return NextResponse.json(community);
    }
    catch (error) {
        console.log("error", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}