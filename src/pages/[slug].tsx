import { type NextPage } from "next";
import Head from "next/head";
import { LoadingPage } from "~/components/loadingSpinner";
import { api } from "~/utils/api";



const ProfilePage: NextPage = () => {

  const {data, isLoading} = api.profile.getUserByUsername.useQuery({
    username: "reecesantana",
  })

  if (isLoading) return <LoadingPage />

  if (!data) return <div>404</div>
  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <main className="flex h-screen justify-center">
        <div>Profile</div>
      </main>
    </>
  );
};

export default ProfilePage;
