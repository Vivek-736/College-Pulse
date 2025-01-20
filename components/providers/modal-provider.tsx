"use client";

import { CreateCommunityModal } from "@/components/models/create-community-modal";
import { useEffect, useState } from "react";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return <CreateCommunityModal />
};