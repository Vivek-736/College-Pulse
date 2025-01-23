import { currentProfile } from '@/lib/current-profile'
import { redirect } from 'next/navigation';
import React from 'react';
import db from "@/lib/db";
import { NavigationAction } from './NavigationAction';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import NavigationItem from './NavigationItem';
import { ModeToggle } from '../mode-toggle';
import { UserButton } from '@clerk/nextjs';

const Sidebar = async () => {
    const profile = await currentProfile();

    if (!profile) {
        return redirect("/");
    }

    const communities = await db.server.findMany({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    return (
        <div className='space-y-4 flex flex-col items-center h-full text-primary w-full bg-[#a29ef2] dark:bg-[#1f1346]'>
            <NavigationAction />
            <Separator className='h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto' />
            <ScrollArea className='flex-1 w-full'>
                {communities.map((community) => (
                    <div key={community.id} className='mb-4'>
                        <NavigationItem id={community.id} name={community.name} imageUrl={community.imageUrl} />
                    </div>
                ))}
            </ScrollArea>
            <div className='pb-3 mt-auto flex items-center flex-col gap-y-4'>
                <ModeToggle />
                <UserButton afterSignOutUrl='/' appearance={{ elements: { avatarBox: "h-[48px] w-[48px]" } }} />
            </div>
        </div>
    )
}

export default Sidebar
