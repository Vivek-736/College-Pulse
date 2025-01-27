import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import db from "@/lib/db";
import { MemeberRole } from "@prisma/client";

export async function POST(req: Request) {
    try {
        const profile = await currentProfile();
        const { name, type, segregation } = await req.json();
        const { searchParams } = new URL(req.url);

        const communityId = searchParams.get("communityId");

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!communityId) {
            return new NextResponse("Community ID is required", { status: 400 });
        }

        if (name === "general") {
            return new NextResponse("Name cannot be general", { status: 400 });
        }

        const community = await db.server.update({
            where: {
                id: communityId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemeberRole.ADMIN, MemeberRole.COORDINATOR]
                        }
                    }
                }
            },
            data: {
                channels: {
                    create: {
                        profileId: profile.id,
                        name,
                        type,
                        segregation
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