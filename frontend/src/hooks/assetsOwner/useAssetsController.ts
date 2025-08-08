import { useRouter } from "next/navigation";

const useAssetsController = () => {
  const router = useRouter();

  const handleDetail = (ass_id: string | number) =>
    router.push(`/owner/assets/${ass_id}`);

  return {
    handleDetail
  };
};

export default useAssetsController;