import db from "@/lib/db";

export const getOrCreateConversation = async (memberOneId: string, memberTwoId: string) => {
    const [firstMemberId, secondMemberId] = 
        memberOneId < memberTwoId 
            ? [memberOneId, memberTwoId] 
            : [memberTwoId, memberOneId];

    let conversation = await findConversation(firstMemberId, secondMemberId);

    if (!conversation) {
        conversation = await createNewConversation(firstMemberId, secondMemberId);
    }

    return conversation;
}

const findConversation = async (memberOneId: string, memberTwoId: string) => {
    try {
        return await db.conversation.findFirst({
            where: {
                AND: [
                    { memberOneId },
                    { memberTwoId },
                ]
            },
            include: {
                memberOne: {
                    include: { profile: true }
                },
                memberTwo: {
                    include: { profile: true }
                }
            }
        });
    } catch {
        return null;
    }
}

const createNewConversation = async (memberOneId: string, memberTwoId: string) => {
    try {
        return await db.conversation.create({
            data: {
                memberOneId,
                memberTwoId,
            },
            include: {
                memberOne: { include: { profile: true } },
                memberTwo: { include: { profile: true } }
            }
        });
    } catch {
        return null;
    }
}