import Image from "next/image";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="h-full flex flex-col lg:flex-row items-center justify-center lg:gap-x-52 p-4">
            <div className="flex md:flex-col flex-row gap-y-10 items-center mb-10 lg:mb-0 mt-2 md:mt-0">
                <Image
                    src={`/logo.png`}
                    width={200}
                    height={200}
                    alt="Logo"
                    className="w-32 h-32 lg:w-48 lg:h-48"
                />
                <h1 className="text-indigo-500 text-center text-4xl font-bold">
                    College Pulse
                </h1>
            </div>
            <div className="w-full lg:w-auto">
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;
