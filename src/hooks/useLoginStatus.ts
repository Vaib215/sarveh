import { useSelector } from "react-redux";

interface ILoginStatus {
  status: boolean | string;
}

const useLoginStatus = (): ILoginStatus => {
  const status = useSelector((state: any) => state.auth.status);

  return {
    status: status,
  };
};

export default useLoginStatus;
