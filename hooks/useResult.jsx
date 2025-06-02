import {useQuery} from "@tanstack/react-query";
import api from "@/api/axiosConfig.js";

export default function useResult() {
    return useQuery({
        queryKey: ['userStats'],
        queryFn: async () => {
            const res = await api.get('/me');
            return res.data.stats;
        },
        staleTime: 60 * 1000,
    })
}