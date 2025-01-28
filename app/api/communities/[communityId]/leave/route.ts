import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function PATCH(req: Request, { params }: { params: { communityId: string } }) {
    try {
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!params.communityId) {
            return new NextResponse("Bad Request", { status: 400 });
        }

        const community = await db.server.update({
            where: {
                id: params.communityId,
                profileId: {
                    not: profile.id
                },
                members: {
                    some: {
                        profileId: profile.id
                    }
                }
            },
            data: {
                members: {
                    deleteMany: {
                        profileId: profile.id
                    }
                }
            }
        });

        return NextResponse.json(community);
    } catch (error) {
        console.log("error", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}