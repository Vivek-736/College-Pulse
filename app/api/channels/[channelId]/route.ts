import { currentProfile } from "@/lib/current-profile";
import db from "@/lib/db";
import { MemeberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { channelId: string } }) {
    try {
        const profile = await currentProfile();

        if (!profile) {
            return new Response('Unauthorized', { status: 401 });
        }

        const { searchParams } = new URL(req.url);

        const communityId = searchParams.get('communityId');

        if (!communityId) {
            return new NextResponse('Bad request', { status: 400 });
        }

        if (!params.channelId) {
            return new NextResponse('Bad request', { status: 400 });
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
                    delete: {
                        id: params.channelId,
                        name: {
                            not: "general",
                        }
                    }
                }
            }
        });

        return NextResponse.json(community);
    } catch (error) {
        console.error(error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: { channelId: string } }) {
    try {
        const profile = await currentProfile();
        const { name, type } = await req.json();

        if (!profile) {
            return new Response('Unauthorized', { status: 401 });
        }

        const { searchParams } = new URL(req.url);

        const communityId = searchParams.get('communityId');

        if (!communityId) {
            return new NextResponse('Bad request', { status: 400 });
        }

        if (!params.channelId) {
            return new NextResponse('Bad request', { status: 400 });
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
                    update: {
                        where: {
                            id: params.channelId,
                            NOT: {
                                name: "general",
                            },
                        },
                        data: {
                            name,
                            type
                        }
                    }
                }
            }
        });
        
        return NextResponse.json(community);
    } catch (error) {
        console.error(error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}