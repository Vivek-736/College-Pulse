import db from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { communityId: string } }) {
    try {
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!params.communityId) {
            return new NextResponse("Invalid delete Request", { status: 400 });
        }

        const community = await db.server.delete({
            where: {
                id: params.communityId,
                profileId: profile.id
            }
        });

        return NextResponse.json(community);
    } catch (error) {
        console.log("error", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}