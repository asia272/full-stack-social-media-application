"use client";

import { FC } from "react";
import Link from "next/link";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface FollowListModalProps {
    isOpen: boolean;
    onClose: () => void;
    users: {
        id: string;
        username: string;
        name?: string;
        bio?: string;
        image?: string;
    }[];
    title: string;
}

const FollowListModal: FC<FollowListModalProps> = ({
    isOpen,
    onClose,
    users,
    title,
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="w-[400px] max-h-[80vh] overflow-y-auto">
                <DialogHeader className="flex flex-row justify-between items-center">
                    <DialogTitle className="font-bold text-lg">
                        {title}
                    </DialogTitle>
                </DialogHeader>

                {users.length === 0 ? (
                    <p className="text-gray-500">No users found</p>
                ) : (
                    <ul>
                        {users.map((user) => (
                            <li
                                key={user.id}
                                className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                            >
                                <Link
                                    href={`/profile/${user.username}`}
                                    className="font-semibold hover:underline"
                                >
                                    <img
                                        src={user.image || "/default-avatar.png"}
                                        className="w-10 h-10 rounded-full"
                                        alt={user.name}
                                    />
                                </Link>
                                <div className="flex-1">
                                    <Link
                                        href={`/profile/${user.username}`}
                                        className="font-semibold hover:underline"
                                    >
                                        {user.name?.trim() || user.username}
                                    </Link>
                                    <p className="text-sm text-gray-500">
                                        {user.bio}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default FollowListModal;