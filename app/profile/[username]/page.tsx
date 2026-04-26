import { getProfileByUsername, getUserAllPosts, getUserLikedPosts, isFollowing } from "@/app/actions/profile.action";
import { getDbUserId } from "@/app/actions/user.action";
import ProfilePageClient from "@/components/ProfilePageClient";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

const ProfilePage = async ({ params }: { params: { username: string } }) => {
    const param = await params
    const user = await getProfileByUsername(param.username)
    if (!user) notFound();

const clerkUser = await currentUser();
    let dbUserId = null;

    if (clerkUser?.id) {
        try {
            dbUserId = await getDbUserId();
        } catch (error) {
            console.log("DB user not ready yet");
        }
    } 
    
    const [posts, likedPosts, isCurrentUserFollowing] = await Promise.all([
        getUserAllPosts(user.id),
        getUserLikedPosts(user.id),
        isFollowing(user.id)
    ])

    return (
      <ProfilePageClient
        user={user}
        posts={posts}
        likedPosts={likedPosts}
        isFollowing={isCurrentUserFollowing}
        dbUserId={dbUserId}
      />
    );
}

export default ProfilePage;
