"use client";

import { CreateCommunityModal } from "@/components/models/create-community-modal";
import { useEffect, useState } from "react";
import { InviteModal } from "../models/invite-modal";
import { EditCommunityModal } from "../models/edit-community-modal";
import { MembersModal } from "../models/members-modal";
import { CreateChannelModal } from "../models/create-channel-modal";
import { LeaveCommunityModal } from "../models/leave-community-modal";
import { DeleteCommunityModal } from "../models/delete-community-modal";
import { DeleteChannelModal } from "../models/delete-channel-modal";
import { EditChannelModal } from "../models/edit-channel-modal";
import MessageFileModal from "../models/message-file-modal";
import { DeleteMessageModal } from "../models/delete-message-modal";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <CreateCommunityModal />
            <InviteModal />
            <EditCommunityModal />
            <MembersModal />
            <CreateChannelModal />
            <LeaveCommunityModal />
            <DeleteCommunityModal />
            <DeleteChannelModal />
            <EditChannelModal />
            <MessageFileModal />
            <DeleteMessageModal />
        </>
    )

};