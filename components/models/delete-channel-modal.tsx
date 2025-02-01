"use client";

import qs from "query-string";
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useModal } from '@/hooks/use-modal-store';
import { Button } from '../ui/button';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export const DeleteChannelModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();

    const isModalOpen = isOpen && type === "deleteChannel"
    const { community, channel } = data;

    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);
            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query: {
                    communityId: community?.id
                }
            });
            await axios.delete(url);
            onClose();
            router.push(`/communities/${community?.id}`);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
            router.refresh();
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className='bg-white text-black p-0 overflow-hidden'>
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle className='text-2xl text-center font-bold text-rose-400'>
                        Delete Channel
                    </DialogTitle>
                    <DialogDescription className='text-center text-zinc-500'>
                        Are you sure that you want to delete the <span className='lowercase font-bold'> {channel?.segregation} </span> <span className='font-semibold text-rose-500'>{channel?.name}</span>?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className='bg-gray-100 px-6 py-4'>
                    <div className='flex items-center justify-between w-full'>
                        <Button disabled={isLoading} onClick={onClose} variant="ghost">
                            Cancel
                        </Button>
                        <Button disabled={isLoading} onClick={onClick} variant="danger">
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}