"use client";

import { useState } from "react";
import { getUserFollowers, getUserFollowing } from "@/app/actions/profile.action";
import FollowListModal from "./FollowListModal";
import { Separator } from "./ui/separator";

type ModalUser = {
    id: string;
    username: string;
    name?: string;
    bio?: string;
    image?: string;
};

interface Props {
    userId: string;
    followersCount: number;
    followingCount: number;
}

const FollowStats = ({ userId, followersCount, followingCount }: Props) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [users, setUsers] = useState<ModalUser[]>([]);

    const openFollowers = async () => {
        const data = await getUserFollowers(userId);

        setUsers(
            data.map((u) => ({
                ...u,
                name: u.name ?? undefined,
                bio: u.bio ?? undefined,
                image: u.image ?? undefined,
            }))
        );

        setModalTitle("Followers");
        setModalOpen(true);
    };

    const openFollowing = async () => {
        const data = await getUserFollowing(userId);

        setUsers(
            data.map((u) => ({
                ...u,
                name: u.name ?? undefined,
                bio: u.bio ?? undefined,
                image: u.image ?? undefined,
            }))
        );

        setModalTitle("Following");
        setModalOpen(true);
    };

    return (
        <>

            <div
                className="cursor-pointer px-3 py-2 rounded-md transition-colors hover:bg-muted"
                onClick={openFollowing}>
                <p className="font-medium">{followingCount}</p>
                <p className="text-xs text-muted-foreground">Following</p>
            </div>

            <Separator orientation="vertical" />

            <div
                className="cursor-pointer px-3 py-2 rounded-md transition-colors hover:bg-muted"
                onClick={openFollowers}>
                <p className="font-medium">{followersCount}</p>
                <p className="text-xs text-muted-foreground">Followers</p>
            </div>


            <FollowListModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                users={users}
                title={modalTitle}
            />
        </>
    );
};

export default FollowStats;