import { currentProfile } from '@/lib/current-profile'
import { RedirectToSignIn } from '@clerk/nextjs'
import db from "@/lib/db"
import { redirect } from 'next/navigation'

interface ServerIdPageProps {
  params: {
    serverId: string
  }
}

const ServerIdPage = async ({ params }: ServerIdPageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return RedirectToSignIn({ redirectUrl: "/" });
  }

  const community = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id
        }
      }
    },
    include: {
      channels: {
        where: {
          name: "general"
        },
        orderBy: {
          createdAt: "asc"
        }
      }
    }
  });

  const initialChannel = community?.channels[0];

  if (initialChannel?.name !== "general") {
    return null;
  }

  return redirect(`/communities/${params.serverId}/channels/${initialChannel?.id}`);
}

export default ServerIdPage
