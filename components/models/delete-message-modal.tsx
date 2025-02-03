"use client";

import qs from "query-string";
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useModal } from '@/hooks/use-modal-store';
import { Button } from '../ui/button';
import axios from 'axios';

export const DeleteMessageModal = () => {
    const { isOpen, onClose, type, data } = useModal();

    const isModalOpen = isOpen && type === "deleteMessage"
    const { apiUrl, query } = data;

    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);
            const url = qs.stringifyUrl({
                url: apiUrl || "",
                query: query
            });
            await axios.delete(url);
            onClose();
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className='bg-white text-black p-0 overflow-hidden'>
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle className='text-2xl text-center font-bold text-rose-400'>
                        Delete Message
                    </DialogTitle>
                    <DialogDescription className='text-center text-zinc-500'>
                        Are you sure that you want to delete this message? <br/>
                        The message will be permanently deleted.
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