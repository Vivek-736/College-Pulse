import { currentProfile } from "@/lib/current-profile";
import db from "@/lib/db";
import { MemeberRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
    try {
        const { name, imageUrl } = await req.json();
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const community = await db.server.create({
            data: {
                profileId: profile.id,
                name,
                imageUrl,
                inviteCode: uuidv4(),
                channels: {
                    create: {
                        name: "general",
                        profileId: profile.id
                    }
                },
                members: {
                    create: {
                        profileId: profile.id,
                        role: MemeberRole.ADMIN
                    }
                }
            }
        });
        return NextResponse.json(community);
    } catch (error) {
        console.log("[SERVERS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
