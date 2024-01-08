import { useAuth } from "@clerk/clerk-expo";

interface ILoginStatus {
  isSignedIn: boolean;
}

const useLoginStatus = (): ILoginStatus => {
  const { isSignedIn } = useAuth();

  return {
    isSignedIn,
  };
};

export default useLoginStatus;
