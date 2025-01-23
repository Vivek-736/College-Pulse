"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { useModal } from '@/hooks/use-modal-store';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Check, Copy, RefreshCw } from 'lucide-react';
import { useOrigin } from '@/hooks/use-origin';
import axios from 'axios';

export const InviteModal = () => {
    const router = useRouter();
    const { isOpen, onClose, type, data, onOpen } = useModal();
    const origin = useOrigin();

    const isModalOpen = isOpen && type === "invite"
    const { community } = data;

    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const inviteUrl = `${origin}/invite/${community?.inviteCode}`;

    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    const onNew = async () => {
        try {
            setIsLoading(true);
            const response = await axios.patch(`/api/communities/${community?.id}/invite-code`)
            onOpen("invite", { community: response.data });
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className='bg-white text-black p-0 overflow-hidden'>
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle className='text-2xl text-center font-bold text-blue-600'>
                        Invite People
                    </DialogTitle>
                </DialogHeader>
                <div className='p-6'>
                    <Label className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary'>
                        Server invite link
                    </Label>
                    <div className='flex items-center mt-2 gap-x-2'>
                        <Input
                            disabled={isLoading}
                            className='bg-zinc-300 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0' value={inviteUrl}
                        />
                        <Button onClick={onCopy} size="icon">
                            {copied
                                ? <Check className='w-4 h-4' /> : <Copy className='w-4 h-4' />
                            }
                        </Button>
                    </div>
                    <Button onClick={onNew} disabled={isLoading} variant="link" size="sm" className='text-xs text-zinc-500 mt-4'>
                        Generate a new link
                        <RefreshCw className='w-4 h-4 ml-2' />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}