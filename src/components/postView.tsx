import Image from "next/image";
import Link from "next/link";
import type { RouterOutputs } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["posts"]["getAll"][number];
export const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div key={post.id} className="flex border-b border-slate-800 shadow-sm">
      <Image
        src={author?.profilePicture}
        alt={`${author.username} Profile Image`}
        className="h-16 w-16 rounded-full p-2"
        width={64}
        height={64}
      />
      <div className="flex flex-col text-clip">
        <div className="text-slate-300">
         <Link href={`/${author.username}`}><span className="font-semibold hover:text-emerald-800">{`>${author.username}`}</span></Link>
          <span className="font-light">{`. ${dayjs(post.createdAt).fromNow()}`}</span>
        </div>
        <Link href={`/post/${post.id}`}><span className="text-2xl">{post.content}</span></Link>
      </div>
    </div>
  );
};