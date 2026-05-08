import { getUserByClerkId, syncUser } from "@/app/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import CreateDropdown from "./CreateDropdown";
import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";
import { Code2Icon } from "lucide-react";

const Navbar = async () => {
  // Get current Clerk user
  const clerkUser = await currentUser();

  let user = null;

  if (clerkUser) {
    await syncUser();
    user = await getUserByClerkId(clerkUser.id);
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mb-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* LEFT SIDE */}
          <Link
            href="/"
            className="group flex items-center gap-2 sm:gap-3 shrink-0"
          >
            {/* Logo */}
            <div className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10">
              {/* Rotating Dot */}
              <div className="absolute inset-0 animate-spin-slow">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-primary border border-background" />
              </div>

              {/* Ring */}
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-[1.5px] border-primary/70 flex items-center justify-center transition-all duration-300 group-hover:border-primary">
                <Code2Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary transition-transform duration-300 group-hover:scale-110" />
              </div>
            </div>

            {/* Brand */}
            <h2 className="text-lg sm:text-xl font-black tracking-tight whitespace-nowrap">
              <span className="text-foreground">Dev</span>
              <span className="text-primary">Connect</span>
            </h2>
          </Link>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Create Dropdown */}
            {clerkUser && (
              <div className="flex items-center">
                <CreateDropdown />
              </div>
            )}

            {/* Desktop Navbar */}
            <div className="hidden md:flex items-center">
              <DesktopNavbar />
            </div>

            {/* Mobile Navbar */}
            <div className="flex md:hidden items-center">
              <MobileNavbar user={user} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
