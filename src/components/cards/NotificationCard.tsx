import { ReactElement, useMemo } from "react";
import { useRouter } from "next/router";
import Avatar from "@/components/ui/Avatar";
import DateManager from "@/utilities/DateManager";
import { Notification } from "@/types/notification";
import ReplyToInvitation from "./challenge/_partials/ReplyToInvitation";

/**
 * User interface
 * @date 3/28/2023 - 9:00:57 PM
 *
 * @interface User
 * @typedef {User}
 */
interface User {
  displayName?: string;
  username?: string;
  avatar?: string;
}

/**
 * Interface for notification component props
 * @date 3/28/2023 - 8:57:52 PM
 *
 * @interface NotificationCardProps
 * @typedef {NotificationCardProps}
 */
interface NotificationCardProps {
  user: User;
  notification: Notification;
  extended?: boolean;
}

/**
 * Enum for notification types
 * @date 3/28/2023 - 9:04:03 PM
 * @enum {string}
 * @typedef {TYPES}
 * @property {string} SUBMISSION
 * @property {string} REFERRAL
 * @property {string} FEEDBACK
 * @readonly
 *
 * */
enum TYPES {
  SUBMISSION = "SUBMISSION",
  REFERRAL = "REFERRAL",
  FEEDBACK = "FEEDBACK",
}

/**
 * NotificationCard component
 * @date 3/28/2023 - 8:57:59 PM
 *
 * @export
 * @param {NotificationCardProps} {
  user = {},
  notification,
  extended = false,
}
 * @returns {ReactElement}
 */
export default function NotificationCard({ user = {}, notification, extended = false }: NotificationCardProps): ReactElement {
  const router = useRouter();

  /**
   * Format the date to a human-readable string
   * @date 4/28/2023 - 8:39:18 PM
   *
   * @type {string}
   */
  const humanizedDate: string = useMemo(() => DateManager.fromNow(notification.created_at as Date, router.locale), [notification.created_at, router.locale]);

  const date = useMemo(() => DateManager.intlFormat(notification.created_at, router.locale), [notification.created_at, router.locale]);

  /**
   * Generate the notification link according to the type of notification
   * @date 4/28/2023 - 8:40:01 PM
   *
   * @type {string}
   */
  const link: string = useMemo(() => {
    const { type } = notification;

    if (type === TYPES.SUBMISSION || type === TYPES.REFERRAL || type === TYPES.FEEDBACK) {
      return `/${notification.metadata.submission}`;
    } else {
      return notification.link;
    }
  }, [notification]);

  const notificationsLink = useMemo(() => {
    if (!link) return "";
    return `${link}`;
  }, [link, router.locale]);

  const goToLink = () => {
    if (!link) return;
    if (link.startsWith("/")) {
      router.push(notificationsLink);
    } else {
      window.open(link, "_blank");
    }
  };

  return (
    <>
      <div onClick={goToLink} className="w-full">
        <div
          className={`
            flex flex-col sm:flex-row
            hover:bg-secondary
            py-[0.75rem] sm:py-[1rem]
            px-[0.75rem] sm:px-[1.25rem]
            -mx-[0.5rem] sm:-mx-[1.25rem]
            cursor-pointer
            transition-colors
            duration-200
            ${extended ? "rounded-[1rem] sm:rounded-[1.5rem]" : ""}
            gap-[0.5rem] sm:gap-[1rem]
          `}
        >
          <div className="flex-shrink-0">
            <Avatar
              user={user}
              className="w-[2rem] h-[2rem] sm:w-[2.5rem] sm:h-[2.5rem]"
            />
          </div>
          <div className="flex flex-col justify-center space-y-[0.25rem]">
            <span className="text-[0.875rem] sm:text-[1rem] text-gray-700 break-words leading-[1.25]">
              {notification.message}
            </span>
            <span
              title={date}
              className="text-[0.75rem] sm:text-[0.875rem] text-gray-900 font-medium leading-[1.2]"
            >
              {humanizedDate}
            </span>
          </div>
        </div>
        {notification?.type === "TEAM_INVITE" && (
          <div className="px-[0.75rem] sm:px-[1.25rem]">
            <ReplyToInvitation
              team_ref={notification.metadata?.team}
              invite_id={notification.metadata?.invite_id as string}
            />
          </div>
        )}
      </div>
    </>
  );
}
