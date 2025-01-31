"use client";
import { Search } from 'lucide-react';
import React, { useState } from 'react'
import { CommandDialog, CommandEmpty, CommandInput, CommandList } from '../ui/command';

interface SecSidebarSearchProps {
    data: {
        label: string;
        type: "Channel" | "member",
        data: {
            icon: React.ReactNode;
            name: string;
            id: string;
        }[] | undefined
    }[]
}

const SecSidebarSearch = ({
    data
}: SecSidebarSearchProps) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <button onClick={() => setOpen(true)} className='group px-2 py-2 flex rounded-md items-center gap-x-2 w-full hover:bg-zinc-700 dark:hover:bg-zinc-700/50 transition'>
                <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                <p className='font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-300 dark:group-hover:text-zinc-300 transition'>
                    Search
                </p>
                <kbd className='pointer-events-none inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto'>
                    <span className='text-xs'>
                        Ctrl
                    </span>
                    K
                </kbd>
            </button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Search for channels and members" />
                <CommandList>
                    <CommandEmpty>
                        No Results Found
                    </CommandEmpty>
                    {/* {data.map(({ label, type, data }))} */}
                </CommandList>
            </CommandDialog>
        </>
    )
}

export default SecSidebarSearch
