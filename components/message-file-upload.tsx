"use client";
import { X, File } from 'lucide-react';
import Image from 'next/image';
import { UploadDropzone } from "@/lib/uploadthing";

interface FileUploadProps {
    onChange: (url?: string) => void;
    value: string;
    endpoint: "messageFile" | "serverImage";
}

export const MessageFileUpload = ({ onChange, value, endpoint }: FileUploadProps) => {
    const fileType = value?.split('.').pop();
    const isPDF = value && (fileType === 'pdf' || value.startsWith('https://utfs.io/f/'));

    if (value) {
        if (isPDF) {
            return (
                <div className='relative flex items-center p-2 mt-2 rounded-md bg-background/10'>
                    <File className='h-10 w-10 fill-indigo-200 stroke-indigo-400' />
                    <a
                        href={value}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline'
                    >
                        View File
                    </a>
                    <button
                        type='button'
                        onClick={() => onChange("")}
                        className='bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2'
                    >
                        <X className='h-4 w-4' />
                    </button>
                </div>
            );
        }

        return (
            <div className='relative h-20 w-20'>
                <Image
                    fill
                    src={value}
                    alt='Upload'
                    className='rounded-full'
                />
                <button
                    type='button'
                    onClick={() => onChange("")}
                    className='bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0'
                >
                    <X className='h-4 w-4' />
                </button>
            </div>
        );
    }

    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                onChange(res?.[0].url);
            }}
            onUploadError={(error: Error) => {
                console.error(error);
            }}
        />
    );
};