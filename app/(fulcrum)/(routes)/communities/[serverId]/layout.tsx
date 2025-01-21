import { currentProfile } from "@/lib/current-profile";
import { RedirectToSignIn } from "@clerk/nextjs";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import SecondarySidebar from "@/components/secondaryNavigation/SecondarySidebar";

const serverIdLayout = async ({ children, params }: { children: React.ReactNode; params: { serverId: string } }) => {
    const profile = await currentProfile();

    if (!profile) {
        return RedirectToSignIn({ redirectUrl: '/' });
    }

    const community = await db.server.findUnique({
        where: {
            id: params.serverId,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    if (!community) {
        return redirect("/");
    }

    return (
        <div className="h-full">
            <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
                <SecondarySidebar serverId={params.serverId} />
            </div>
            <main className="h-full md:pl-60">
                {children}
            </main>
        </div>
    );
}

export default serverIdLayout;
