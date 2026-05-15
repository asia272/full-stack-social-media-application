"use client";
import { useEffect, useState } from 'react'
import { getUserNotifications, markAsReadNotifications } from '../actions/notification.action'
import toast from 'react-hot-toast';
import NotificationsSkeleton from '@/components/NotificationsSkeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AvatarImage, Avatar } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HeartIcon, MessageCircleIcon, UserPlusIcon } from 'lucide-react';
import Link from 'next/link';

type Notifications = Awaited<ReturnType<typeof getUserNotifications>>
type Notification = NonNullable<Notifications>[number];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "LIKE":
      return <HeartIcon className="size-4 text-red-500" />;
    case "COMMENT":
      return <MessageCircleIcon className="size-4 text-blue-500" />;
    case "FOLLOW":
      return <UserPlusIcon className="size-4 text-green-500" />;
    default:
      return null;
  }
};


const NotificationPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true);


  // When this page render then automtically fetch all notification
  //  and mark as read if marks as unread
  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const data = await getUserNotifications();
        setNotifications(data ?? []);

        const unreadIds = (data ?? [])
          .filter((n) => !n.read)
          .map((n) => n.id);

        if (unreadIds.length > 0) {
          await markAsReadNotifications(unreadIds);
        }
      } catch (error) {
        toast.error("Failed to fetch notifications");
      } finally {
        setIsLoading(false);
      }
    }

    fetchNotification()
  }, [])
  if (isLoading) return <NotificationsSkeleton />;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>Notifications</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No notifications yet
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start justify-between gap-3 p-3 border-b hover:bg-muted/25 transition-colors ${!notification.read ? "bg-muted/50" : ""
                    }`}
                >
                  {/* LEFT SIDE */}
                  <div className="flex gap-3 flex-1 min-w-0">
                    <Link href={`/profile/${notification.creator.username}`}>
                      <Avatar className="size-8 mt-1">
                        <AvatarImage
                          src={notification.creator.image ?? "/avatar.png"}
                        />
                      </Avatar>
                    </Link>

                    <div className="flex-1 text-sm space-y-1">
                      <div className="flex items-center gap-2">
                        {getNotificationIcon(notification.type)}

                        <span className="leading-snug">
                          <Link
                            href={`/profile/${notification.creator.username}`}
                            className="font-bold hover:underline mr-1"
                          >
                            {notification.creator.name?.trim() ||
                              notification.creator.username}
                          </Link>

                          {notification.type === "FOLLOW"
                            ? "started following you"
                            : notification.type === "LIKE"
                              ? "liked your post"
                              : "commented on your post"}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(
                          new Date(notification.createdAt),
                          {
                            addSuffix: true,
                          },
                        )}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT SIDE */}
                  {notification.post &&
                    (notification.type === "LIKE" ||
                      notification.type === "COMMENT") && (
                      <div className="w-14 h-14 flex-shrink-0 rounded-md overflow-hidden border">

                        {notification.post.image && (
                          <img
                            src={notification.post.image}
                            alt="Post"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    )}
                </div>
              ))
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

export default NotificationPage
