import type { User } from "@clerk/nextjs/dist/api";
export const filterUserForClient = (user: User) => {
    return {
      id: user.id,
      username: user.username,
      profilePicture: user.profileImageUrl,
      joined: user.createdAt,
      birthday: user.birthday,
      lastOnline: user.lastSignInAt,
      externalUsername: user.externalAccounts.find((externalAccount) => externalAccount.provider === "oauth_github")?.username || null
    };
  };