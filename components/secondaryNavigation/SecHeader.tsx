"use client";
import { ServerWithMembersWithProfiles } from '@/types';
import { MemeberRole } from '@prisma/client';
import React from 'react'
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from 'lucide-react';
import { DropdownMenuContent, DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu';
import { useModal } from '@/hooks/use-modal-store';

interface SecHeaderProps {
    community: ServerWithMembersWithProfiles;
    role?: MemeberRole;
}

const SecHeader: React.FC<SecHeaderProps> = ({
    community,
    role
}) => {
    const { onOpen } = useModal();
    const isAdmin = role === MemeberRole.ADMIN;
    const isCoordinator = isAdmin || role === MemeberRole.COORDINATOR;
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className='focus:outline-none' asChild>
                <button className='w-full text-lg font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-700 border-b-2 hover:bg-indigo-400 dark:hover:bg-indigo-800 transition'>
                    {community.name}
                    <ChevronDown className='h-5 w-5 ml-auto' />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56 text-xs bg-white dark:bg-black font-medium text-black dark:text-neutral-400 space-y-4'>
                {isCoordinator && (
                    <DropdownMenuItem
                        onClick={() => onOpen('invite', { community })}
                        className='text-indigo-600 dark:hover:text-white dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer'>
                        Invite People
                        <UserPlus className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem onClick={() => onOpen("editCommunity", { community })} className='px-3 py-2 text-sm cursor-pointer'>
                        Edit Community
                        <Settings className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem onClick={() => onOpen("members", { community })} className='px-3 py-2 text-sm cursor-pointer'>
                        Manage Members
                        <Users className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isCoordinator && (
                    <DropdownMenuItem className='px-3 py-2 text-sm cursor-pointer' onClick={() => onOpen("createChannel", { community })}>
                        Create Channel
                        <PlusCircle className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}
                {isCoordinator && (
                    <DropdownMenuSeparator />
                )}
                {isAdmin && (
                    <DropdownMenuItem onClick={() => { onOpen("deleteCommunity", { community }) }} className='text-rose-500 px-3 py-2 text-sm cursor-pointer'>
                        Delete Community
                        <Trash className='h-4 w-4 ml-auto' />
                    </DropdownMenuItem>
                )}
                {!isAdmin && (
                    <DropdownMenuItem onClick={() => onOpen("leaveCommunity", { community })}
                        className='text-rose-500 px-3 py-2 text-sm cursor-pointer pb-1'>
                        Leave Community
                        <LogOut className='h-4 w-4 ml-auto' />
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default SecHeader
