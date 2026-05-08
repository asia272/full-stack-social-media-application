import { BellIcon, HomeIcon, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SignInButton, UserButton } from "@clerk/nextjs";
import ThemeToggle from "./ThemeToggle";
import { currentUser } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/app/actions/user.action";
import NotificationBadge from "./NotificationBadge";
import ProfileDropdown from "./ProfileDropdown";
import CreateDropdown from "./CreateDropdown";

async function DesktopNavbar() {
    const autheUser = await currentUser();

    let user = null; //  define outside

    if (autheUser) {
        user = await getUserByClerkId(autheUser.id);
    }

    return (
      <div className="hidden md:flex items-center space-x-4">
        <ThemeToggle />

        {user ? (
          <>
            <Button variant="ghost" className="flex items-center gap-2" asChild>
              <Link href="/notifications">
                <div className="relative">
                  <BellIcon className="w-4 h-4" />
                  <NotificationBadge />
                </div>
                {/* <span className="hidden lg:inline">Notifications</span> */}
              </Link>
            </Button>
            {/* <CreateDropdown /> */}
            <ProfileDropdown user={user} />
          </>
        ) : (
          <SignInButton mode="modal">
            <Button variant="default">Sign In</Button>
          </SignInButton>
        )}
      </div>
    );
}
export default DesktopNavbar;