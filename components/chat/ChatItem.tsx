"use client";

import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { Member, MemeberRole, Profile } from '@prisma/client';
import React, { useEffect, useState } from 'react'
import UserAvatar from '../user-avatar';
import ActionTooltip from '../action-tooltip';
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Form, FormControl, FormField, FormItem } from '../ui/form';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { useRouter, useParams } from "next/navigation";

interface ChatItemProps {
    id: string;
    content: string;
    member: Member & {
        profile: Profile;
    };
    timeStamp: string;
    fileUrl: string | null;
    deleted: boolean;
    currentMember: Member;
    isUpdated: boolean;
    socketUrl: string;
    socketQuery: Record<string, string>;
}

const roleIconMap = {
    'STUDENT': null,
    'COORDINATOR': <ShieldCheck className='h-4 w-4 ml-2 text-green-400' />,
    'ADMIN': <ShieldAlert className='h-4 w-4 ml-2 text-indigo-400' />
}

const formSchema = z.object({
    content: z.string().min(1),
});

const ChatItem = ({
    id, content, member, timeStamp, fileUrl, deleted, currentMember, isUpdated, socketQuery, socketUrl
}: ChatItemProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const { onOpen } = useModal();

    const params = useParams();
    const router = useRouter();

    const onMemberClick = () => {
        if(member.id === currentMember.id) {
            return;
        }
        router.push(`/communities/${params?.serverId}/conversations/${member.id}`)
    }

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleKeyDown = (e: any) => {
            if (e.key === 'Escape' || e.keyCode === 27) {
                setIsEditing(false);
            }
        }

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: content
        }
    })

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: `${socketUrl}/${id}`,
                query: socketQuery
            });
            await axios.patch(url, values);
            form.reset();
            setIsEditing(false);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        form.reset({
            content: content
        })
    }, [content, form]);

    const fileType = fileUrl?.split('.').pop();
    const isAdmin = currentMember.role === MemeberRole.ADMIN;
    const isCoordinator = currentMember.role === MemeberRole.COORDINATOR;
    const isOwner = currentMember.id === member.id;
    const canDeleteMessage = !deleted && (isAdmin || isCoordinator || isOwner);
    const canEditMessage = !deleted && isOwner && !fileUrl;
    const file = fileType !== 'pdf' && fileUrl;

    return (
        <div className={cn(
            'relative group flex items-center hover:bg-black/5 p-4 transition w-full',
            isOwner && 'justify-end'
        )}>
            <div className={cn(
                'group flex gap-x-3 items-start w-full',
                isOwner && 'flex-row-reverse'
            )}>
                <div onClick={onMemberClick} className='cursor-pointer hover:drop-shadow-md transition'>
                    <UserAvatar src={member.profile.imageUrl} />
                </div>
                <div className='flex flex-col w-fit max-w-[70%]'>
                    <div className='flex items-center gap-x-2'>
                        <div className='flex items-center'>
                            <p onClick={onMemberClick} className='font-semibold text-sm hover:underline cursor-pointer'>
                                {member.profile.name}
                            </p>
                            <ActionTooltip label={member.role}>
                                {roleIconMap[member.role]}
                            </ActionTooltip>
                        </div>
                        <span className='text-xs text-zinc-500 dark:text-zinc-400'>
                            {timeStamp}
                        </span>
                    </div>
                    {file && (
                        <div className={cn(
                            'relative flex items-center p-2 mt-2 rounded-md',
                            isOwner
                                ? 'ml-auto bg-green-500 dark:bg-green-600'
                                : 'bg-indigo-100 dark:bg-indigo-700'
                        )}>
                            <FileIcon className={cn(
                                'h-10 w-10',
                                isOwner
                                    ? 'fill-green-100 stroke-green-200'
                                    : 'fill-indigo-200 stroke-indigo-400'
                            )} />
                            <a href={fileUrl} target='_blank' rel='noopener noreferrer' className={cn(
                                'text-sm ml-2 hover:underline',
                                isOwner
                                    ? 'text-green-100 dark:text-green-200'
                                    : 'text-indigo-500 dark:text-indigo-400'
                            )}>
                                Open File
                            </a>
                        </div>
                    )}
                    {!fileUrl && !isEditing && (
                        <div className={cn(
                            'p-2 rounded-lg mt-2 w-fit',
                            isOwner
                                ? 'ml-auto bg-green-500 dark:bg-green-600'
                                : 'bg-indigo-100 dark:bg-indigo-700'
                        )}>
                            <p className={cn(
                                "text-sm",
                                deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs",
                                isOwner ? 'text-white' : 'text-zinc-600 dark:text-zinc-300'
                            )}>
                                {content}
                                {isUpdated && !deleted && (
                                    <span className={cn(
                                        'text-[10px] mx-2',
                                        isOwner
                                            ? 'text-green-200 dark:text-green-300'
                                            : 'text-indigo-500 dark:text-indigo-400'
                                    )}>
                                        (edited)
                                    </span>
                                )}
                            </p>
                        </div>
                    )}
                    {!fileUrl && isEditing && (
                        <Form {...form}>
                            <form className="flex items-center w-full gap-x-2 pt-2" onSubmit={form.handleSubmit(onSubmit)}>
                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <div className="relative w-full">
                                                    <Input
                                                        disabled={isLoading}
                                                        className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200" placeholder="Edit your message"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <Button disabled={isLoading} size="sm" variant="primary">
                                    Save
                                </Button>
                            </form>
                            <span className="text-[10px] mt-1 text-zinc-400">
                                Press escape to cancel, enter to save
                            </span>
                        </Form>
                    )}
                </div>
            </div>
            {canDeleteMessage && (
                <div className={cn(
                    'hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 bg-white dark:bg-zinc-800 border',
                    isOwner ? 'right-5' : 'left-5'
                )}>
                    {canEditMessage && (
                        <ActionTooltip label='Edit'>
                            <Edit
                                onClick={() => setIsEditing(true)}
                                className='cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition'
                            />
                        </ActionTooltip>
                    )}
                    <ActionTooltip label='Delete'>
                        <Trash
                            onClick={() => onOpen("deleteMessage",{
                                apiUrl: `${socketUrl}/${id}`,
                                query: socketQuery
                            })}
                            className='cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition'
                        />
                    </ActionTooltip>
                </div>
            )}
        </div>
    )
}

export default ChatItem;
