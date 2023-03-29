import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import {generateSSGHelper} from "~/server/helpers/ssgHelper"
import { PageLayout } from "~/components/layout";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { LoadingPage } from "~/components/loadingSpinner";
import { PostView } from "~/components/postView";

dayjs.extend(relativeTime);

const ProfileFeed = (props: {userId: string}) => {
  const {data, isLoading} = api.posts.getPostByUser.useQuery({userId: props.userId})

  if (isLoading) return <LoadingPage />

  if (!data || data.length === 0) return <div>This "user" has nothing to say. They are vibing in their own lane.</div>

  return <div>
    {data.map((fullPost) =>(
      <PostView {...fullPost} key={fullPost.post.id}/>
    )
    )}
  </div>
};

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data } = api.profile.getUserByUsername.useQuery({
    username,
  });

  if (!data) return <div>404</div>
  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      <PageLayout>
        <div className="relative bg-slate-700 h-48">
          <Image
            src={`${data.profilePicture}`}
            alt={`${data.username ?? ""}'s Profile Image`}
            className="rounded-full absolute -m-16 bottom-0 left-0 ml-4 border-slate-900 border-4"
            width={128}
            height={128}
          ></Image>
          </div>
          <div className="h-16"></div>
          <div className="px-4 text-2xl">{`>${data.username}`}</div>
          <div className="px-4 text-xs text-slate-600">Joined: {dayjs(data.joined).format("DD/MM/YY")}</div>
          <div className="border-b border-slate-800"/>
          <ProfileFeed userId={data.id}/>
      </PageLayout>
    </>
  )
};


export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper()

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("No Slug");

  const username = slug.replace(">", "");

  await ssg.profile.getUserByUsername.prefetch({ username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default ProfilePage;
