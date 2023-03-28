import { SignInButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Image from "next/image";
import { LoadingPage, LoadingSpinner } from "~/components/loadingSpinner";
import { api } from "~/utils/api";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/postView";

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


const Feed = () => {
  const { data, isLoading: postLoading } = api.posts.getAll.useQuery();

  if(postLoading) return <LoadingPage/>

  if(!data) return <div>Something Went Wrong!!!</div>

  return (
    <div className="">
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
      <PageLayout>
        <div>
            {!isSignedIn && (<div className="flex justify-center border border-slate-200 rounded-md p-10 hover:bg-slate-200 hover:text-slate-900"><SignInButton /></div>)}
            {isSignedIn && (<div className="shadow-sm border border-slate-800"><CreatePostWizard /></div>)}
            </div>
         <Feed />
         </PageLayout>
    </>
  );
};

export default Home;
