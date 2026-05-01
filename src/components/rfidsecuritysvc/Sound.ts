import { type AxiosResponse, AxiosInstance } from "axios";
import { Sound } from "@/components/model";
import { combineURLs } from "@/composables/useAxios";

const BASE_URL = "/sounds";

export const soundSvc = (axios: AxiosInstance) => ({
  async create(name: string, content: File): Promise<Sound> {
    // This API need to be a multipart form data request, so we need to convert the Sound object to a FormData object
    const soundData = new FormData();
    soundData.append("name", name);
    soundData.append("content", content);
    const response = await axios.post<Sound>(BASE_URL, soundData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return Sound.fromApi(response.data);
  },
  delete(id: number): Promise<AxiosResponse> {
    return axios.delete<void>(combineURLs(BASE_URL, String(id)), {});
  },
  async get(id: number): Promise<Sound> {
    const response = await axios.get<Sound>(
      combineURLs(BASE_URL, String(id)),
      {},
    );
    return Sound.fromApi(response.data);
  },
  async list(): Promise<Sound[]> {
    const response = await axios.get<Sound[]>(BASE_URL, {});
    return response.data.map((item) => Sound.fromApi(item));
  },
  update(id: number, name: string, content: File): Promise<AxiosResponse> {
    const soundData = new FormData();
    soundData.append("name", name);
    soundData.append("content", content);

    return axios.put<void>(combineURLs(BASE_URL, String(id)), soundData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
});
