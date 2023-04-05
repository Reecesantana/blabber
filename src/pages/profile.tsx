import { UserProfile } from "@clerk/nextjs";
import type { NextPage } from "next";
import Head from "next/head";
import { DirectoryLayout } from "~/components/directory";
import { PageLayout } from "~/components/layout";


const ProfilePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>My Profile</title>
      </Head>
      <DirectoryLayout/>
      <PageLayout>
      <UserProfile/>
      </PageLayout>
    </>
  );
};


export default ProfilePage;
