import { SignInButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import { LoadingPage, LoadingSpinner } from "~/components/loadingSpinner";
import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";

dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const { user } = useUser();

  const [input, setInput] = useState("")

  const ctx = api.useContext()

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("")
      void ctx.posts.getAll.invalidate()
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content
      if (errorMessage && errorMessage[0]){
        toast.error(errorMessage[0])
      }
      else {
      toast.error("Failed to post! Try again later!!!")
    }
    }
  })
  

  if (!user) return null;

  return (
    <div className="flex gap-3 py-3">
      <Image
        src={user.profileImageUrl}
        alt="Profile Image"
        className="h-16 w-16 rounded-full p-2"
        width={64}
        height={64}
      />
      <input
        type="text"
        placeholder="Post Something!"
        className="grow bg-transparent outline-none"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isPosting}

        onKeyDown={(e) => {
          if(e.key === "Enter"){
            e.preventDefault()
            if (input !== "") {
              mutate({ content: input})
            }
          }
        }}
      />
      {input !== "" && !isPosting && (<button onClick={() => mutate({ content: input })} className="p-2 text-2xl">+</button>)}
      {isPosting && <div className="justify-center flex items-center px-2"><LoadingSpinner size={20}/></div>}
    </div>
  );
};

type PostWithUser = RouterOutputs["posts"]["getAll"][number];
const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div key={post.id} className="flex gap-3 border-b">
      <Image
        src={author?.profilePicture}
        alt={`${author.username} Profile Image`}
        className="h-16 w-16 rounded-full p-2"
        width={64}
        height={64}
      />
      <div className="flex flex-col text-clip">
        <div className="text-slate-300">
         <Link href={`/${author.username}`}><span className="font-semibold">{`>${author.username}`}</span>{" "}</Link>
          <span className="font-light">{`. ${dayjs(post.createdAt).fromNow()}`}</span>
        </div>
        <Link href={`/post/${post.id}`}><span className="text-2xl">{post.content}</span></Link>
      </div>
    </div>
  );
};

const Feed = () => {
  const { data, isLoading: postLoading } = api.posts.getAll.useQuery();

  if(postLoading) return <LoadingPage/>

  if(!data) return <div>Something Went Wrong!!!</div>

  return (
    <div className="flex flex-col">
    {data.map((fullPost) => (
      <PostView {...fullPost} key={fullPost.post.id} />
    ))}
  </div>
  )
}

const Home: NextPage = () => {
  //to fetch instantly
  api.posts.getAll.useQuery();

  const { isLoaded: userLoaded, isSignedIn } = useUser();

  //Return empty div if user has not loaded yet
  if(!userLoaded) return <div />

  return (
    <>
      <main className="flex h-screen justify-center">
        <div className="h-full w-full border-x border-slate-200 md:max-w-2xl">
          <div className="border-b">
            {!isSignedIn && <SignInButton />}
            {isSignedIn && <CreatePostWizard />}
          </div>
         <Feed />
        </div>
      </main>
    </>
  );
};

export default Home;
