import { Channel, ChannelSegregation, Server } from '@prisma/client';
import { create } from 'zustand';

export type ModalType = "createCommunity" | "invite" | "editCommunity" | "members" | "createChannel" | "leaveCommunity" | "deleteCommunity" | "deleteChannel" | "editChannel";

interface ModalData {
    community?: Server;
    channelSegregation?: ChannelSegregation;
    channel?: Channel;
}

interface ModalStore {
    type: ModalType | null;
    data: ModalData;
    isOpen: boolean;
    onOpen: (type: ModalType, data?: ModalData) => void;
    onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
    type: null,
    data: {},
    isOpen: false,
    onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
    onClose: () => set({ type: null, isOpen: false }),
}));