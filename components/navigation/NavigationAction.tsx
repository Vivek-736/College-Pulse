"use client";
import { Plus } from 'lucide-react';
import ActionTooltip from '../action-tooltip';
import React from 'react'
import { useModal } from '@/hooks/use-modal-store';

export const NavigationAction = () => {
    const { onOpen } = useModal();

    return (
        <div className='group flex items-center'>
            <ActionTooltip side='right' align='center' label='Add a Community' >
                <button onClick={() => onOpen("createCommunity")} className='flex mx-3 mt-1 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-[#2f1c6a] dark:bg-[#4a2ba5] group-hover:bg-emerald-500'>
                    <Plus
                        className="group-hover:text-white transition text-emerald-500"
                    />
                </button>
            </ActionTooltip>
        </div>
    )
}