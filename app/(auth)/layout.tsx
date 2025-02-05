"use client";
import { useState } from 'react';
import Image from "next/image";
import { Dialog } from '@headlessui/react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    const [showInfoModal, setShowInfoModal] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center px-4 py-8">
            <div className="container mx-auto flex flex-col lg:flex-row items-center justify-center gap-12">
                <div className="flex-1 max-w-2xl space-y-8 lg:ml-12">
                    <div className="flex items-center gap-4 mb-12">
                        <Image
                            src="/logo.png"
                            width={80}
                            height={80}
                            alt="Campus Connect"
                            className="rounded-lg shadow-lg mb-6"
                        />
                        <h1 className="text-5xl pb-6 font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                            College Pulse
                        </h1>
                    </div>

                    <h2 className="text-3xl font-semibold text-gray-800 mb-4">
                        Unified Hub for Campus Life
                    </h2>

                    <div className="space-y-6 text-gray-600">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-100 rounded-lg">
                                <span className="text-indigo-600">🎯</span>
                            </div>
                            <p className="flex-1">
                                Connect with clubs, departments, and peers through a single integrated platform
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <span className="text-blue-600">✨</span>
                            </div>
                            <p className="flex-1">
                                Collaborate across colleges with our inter-campus network features
                            </p>
                        </div>

                        <button
                            onClick={() => setShowInfoModal(true)}
                            className="mt-6 text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-2"
                        >
                            Learn more about features
                            <span className="text-lg">→</span>
                        </button>
                    </div>
                </div>

                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 lg:p-10 flex items-center justify-center mx-auto">
                    {children}
                </div>
            </div>

            <Dialog
                open={showInfoModal}
                onClose={() => setShowInfoModal(false)}
                className="fixed inset-0 z-10 overflow-y-auto flex items-center justify-center"
            >
                <div className="fixed inset-0 bg-black/30" />

                <div className="relative bg-white rounded-2xl max-w-2xl mx-4 p-8 space-y-6 shadow-lg w-full">
                    <Dialog.Title className="text-2xl font-bold text-indigo-600 text-center">
                        Revolutionizing Campus Connections
                    </Dialog.Title>

                    <div className="space-y-4 text-gray-600 text-center">
                        <p>
                            Campus Connect eliminates the fragmentation of college communication by providing:
                        </p>

                        <ul className="list-disc pl-6 space-y-3 text-left">
                            <li>📌 Department-specific collaboration spaces</li>
                            <li>🗓️ Integrated event management system</li>
                            <li>🌐 Inter-college project networking</li>
                            <li>🔐 Secure academic/resource sharing</li>
                            <li>🎓 Alumni interaction portals</li>
                        </ul>
                    </div>

                    <button
                        onClick={() => setShowInfoModal(false)}
                        className="w-full py-2 px-4 border border-transparent rounded-md bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none"
                    >
                        Get Started
                    </button>
                </div>
            </Dialog>
        </div>
    );
};

export default AuthLayout;
