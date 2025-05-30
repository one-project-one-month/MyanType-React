import {useQuery} from "@tanstack/react-query";
import axios from "@/lib/axios.js";

export default function useResult() {
    return useQuery({
        queryKey: ['userStats'],
        queryFn: async () => {
            const res = await axios.get('/me');
            return res.data;
        },
        staleTime: 60 * 1000,
    })
}