"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useModal } from '@/hooks/use-modal-store';
import { DialogDescription } from '@radix-ui/react-dialog';
import { ServerWithMembersWithProfiles } from '@/types';
import { ScrollArea } from '../ui/scroll-area';
import UserAvatar from '../user-avatar';
import { Check, Gavel, Loader2, MoreVertical, School, ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuTrigger, DropdownMenuSubTrigger } from '../ui/dropdown-menu';
import { MemeberRole } from '@prisma/client';
import qs from "query-string";
import axios from 'axios';
import { useRouter } from 'next/navigation';

const roleIconMap = {
    "STUDENT": <School className="text-purple-500 ml-2 w-4 h-4" />,
    "COORDINATOR": <ShieldCheck className="text-green-500 ml-2 w-4 h-4" />,
    "ADMIN": <ShieldAlert className="text-indigo-400 w-4 h-4 ml-2" />
}

export const MembersModal = () => {
    const router = useRouter();
    const { isOpen, onClose, type, data, onOpen } = useModal();
    const [loadingId, setLoadingId] = useState("");

    const isModalOpen = isOpen && type === "members"
    const { community } = data as { community: ServerWithMembersWithProfiles };

    const onKick = async (memberId: string) => {
        try {
            setLoadingId(memberId);
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    communityId: community.id,
                },
            });
            const response = await axios.delete(url);

            router.refresh();
            onOpen("members", { community: response.data });
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingId("");
        }
    }

    const onRoleChange = async (memberId: string, role: MemeberRole) => {
        try {
            setLoadingId(memberId);
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    communityId: community.id,
                }
            });
            const response = await axios.patch(url, { role });

            router.refresh();
            onOpen("members", { community: response.data });
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingId("");
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className='bg-white text-black overflow-hidden'>
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle className='text-2xl text-center font-bold text-blue-600'>
                        Manage Members
                    </DialogTitle>
                    <DialogDescription className='text-center text-zinc-500'>
                        {community?.members?.length} members
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className='mt-8 max-h-[420px] pr-6'>
                    {community?.members?.map((member) => (
                        <div key={member.id} className='flex items-center gap-x-2 mb-6'>
                            <UserAvatar src={member.profile.imageUrl} />
                            <div className='flex flex-col gap-y-1'>
                                <div className='text-xs font-semibold flex items-center gap-x-1'>
                                    {member.profile.name}
                                    {roleIconMap[member.role]}
                                </div>
                                <p className='text-xs text-zinc-500'>
                                    {member.profile.email}
                                </p>
                            </div>
                            {community.profileId !== member.profileId && loadingId !== member.id && (
                                <div className='ml-auto'>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <MoreVertical className='h-4 w-4 text-zinc-500' />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent side='left'>
                                            <DropdownMenuSub>
                                                <DropdownMenuSubTrigger className='flex items-center'>
                                                    <ShieldQuestion className='w-4 h-4 mr-2' />
                                                    <span>
                                                        Role
                                                    </span>
                                                </DropdownMenuSubTrigger>
                                                <DropdownMenuPortal>
                                                    <DropdownMenuSubContent>
                                                        <DropdownMenuItem onClick={() => onRoleChange(member.id, "STUDENT")}>
                                                            <School className="mr-2 w-4 h-4" />
                                                            Student
                                                            {member.role === "STUDENT" && (
                                                                <Check className='h-4 w-4 ml-auto' />
                                                            )}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => onRoleChange(member.id, "COORDINATOR")}>
                                                            <ShieldCheck className="mr-2 w-4 h-4" />
                                                            Coordinator
                                                            {member.role === "COORDINATOR" && (
                                                                <Check className='h-4 w-4 ml-auto' />
                                                            )}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuSubContent>
                                                </DropdownMenuPortal>
                                            </DropdownMenuSub>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => onKick(member.id)}>
                                                <Gavel className='w-4 h-4 mr-2' />
                                                Kick
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            )}
                            {loadingId === member.id && (
                                <Loader2 className='animate-spin text-sky-400 ml-auto w-4 h-4' />
                            )}
                        </div>
                    ))}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}