import { getUserAllPosts, getUserLikedPosts, getProfileByUsername, isFollowing } from "@/app/actions/profile.action";
import ProfilePageClient from "@/components/ProfilePageClient";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { username: string } }) {
    const user = await getProfileByUsername(params.username);
    if (!user) return;

    return {
        title: `${user.name ?? user.username}`,
        description: user.bio || `Check out ${user.username}'s profile.`,
    };
}


const ProfilePage = async ({ params }: { params: { username: string } }) => {
    const user = await getProfileByUsername(params.username)
    if (!user) notFound();

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
        />
    )
}

export default ProfilePage;
