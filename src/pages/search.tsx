import { useUser } from "@clerk/nextjs";
import { NextPage } from "next";
import { DirectoryLayout } from "~/components/directory";
import { PageLayout } from "~/components/layout";
import { LoadingPage } from "~/components/loadingSpinner";
import { api } from "~/utils/api";


const SearchForUser = (input: {username: string}) => {
  const { data, isLoading: isLoading } = api.profile.getUserByUsername.useQuery(input);

  if(isLoading) return <LoadingPage/>

  if(!data) return <div>User not found!</div>

  return (
    <div>
      
    </div>
  )

}

const SearchPage: NextPage = () => {

  
    return (
      <>
      <DirectoryLayout>
      </DirectoryLayout>
        <PageLayout>
            <input type="text" />
           </PageLayout>
      </>
    );
  };
  
  export default SearchPage;