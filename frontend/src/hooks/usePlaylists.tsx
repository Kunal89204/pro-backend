import { myQuery } from "@/api/query";
import { RootState } from "@/lib/store";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

const usePlaylists = () => {
  const { token } = useSelector((state: RootState) => state);
  return useQuery({
    queryKey: ["playlists"],
    queryFn: () => myQuery.getPlaylists(token),
  });
};

export default usePlaylists;
