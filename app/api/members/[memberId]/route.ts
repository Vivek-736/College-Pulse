import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function DELETE(req: Request, { params }: { params: { memberId: string } }) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);
        const communityId = searchParams.get("communityId");

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!communityId) {
            return new NextResponse("community ID missing", { status: 400 })
        }

        if (!params.memberId) {
            return new NextResponse("member ID missing", { status: 400 })
        }

        const community = await db.server.update({
            where: {
                id: communityId,
                profileId: profile.id,
            },
            data: {
                members: {
                    deleteMany: {
                        id: params.memberId,
                        profileId: {
                            not: profile.id
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true
                    },
                    orderBy: {
                        role: "asc",
                    }
                }
            }
        });
        return NextResponse.json(community);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: { memberId: string } }) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);
        const { role } = await req.json();

        const communityId = searchParams.get("communityId");

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!communityId) {
            return new NextResponse("community ID missing", { status: 400 })
        }

        if (!params.memberId) {
            return new NextResponse("member ID missing", { status: 400 })
        }

        const community = await db.server.update({
            where: {
                id: communityId,
                profileId: profile.id
            },
            data: {
                members: {
                    update: {
                        where: {
                            id: params.memberId,
                            profileId: {
                                not: profile.id
                            }
                        },
                        data: {
                            role
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true
                    },
                    orderBy: {
                        role: "asc"
                    }
                },
            }
        });

        return NextResponse.json(community);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}