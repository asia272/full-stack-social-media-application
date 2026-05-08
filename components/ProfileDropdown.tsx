"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { HomeIcon, LogOutIcon, UserIcon } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { Separator } from "./ui/separator";

function ProfileDropdown({ user }: { user: any }) {
  return (
    <DropdownMenu>
      {/* Avatar Button */}
      <DropdownMenuTrigger asChild>
        <button className="outline-none">
          <img
            src={user?.image || "/avatar.png"}
            alt={user?.name || "User Avatar"}
            className="w-9 h-9 rounded-full object-cover border border-border cursor-pointer"
          />
        </button>
      </DropdownMenuTrigger>

      {/* Dropdown */}
      <DropdownMenuContent align="end" className="w-56 max-md:hidden">
        {/* User Info */}
        <div className="flex items-center gap-3 px-3 py-3 ">
          <img
            src={user?.image || "/avatar.png"}
            alt={user?.name || "User Avatar"}
            className="w-11 h-11 rounded-full object-cover border border-border"
          />
          <div className="min-w-0">
            <p className="font-medium text-sm truncate">{user?.name}</p>

            <p className="text-xs text-muted-foreground truncate">
              @{user?.username}
            </p>
          </div>
        </div>
        <Separator className="my-2" />
        {/* Home */}
        <DropdownMenuItem asChild>
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <HomeIcon className="w-4 h-4" />
            Home
          </Link>
        </DropdownMenuItem>

        {/* Profile */}
        <DropdownMenuItem asChild>
          <Link
            href={`/profile/${user?.username ?? user?.email?.split("@")[0]}`}
            className="flex items-center gap-2 cursor-pointer"
          >
            <UserIcon className="w-4 h-4" />
            Profile
          </Link>
        </DropdownMenuItem>

        {/* Sign Out */}
        <DropdownMenuItem asChild className="w-full cursor-pointer">
          <SignOutButton>
            <button className="flex items-center gap-2 w-full cursor-pointer">
              <LogOutIcon className="w-4 h-4 text-red-500" />
              <span className="text-red-500">Sign Out</span>
            </button>
          </SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ProfileDropdown;
