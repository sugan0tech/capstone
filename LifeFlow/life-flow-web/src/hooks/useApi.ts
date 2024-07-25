// useApi.ts
import { get, post, put, del } from "../utils/apiService";

const useApi = () => {
  const getData = async <T>(endpoint: string): Promise<T> => {
    return await get<T>(endpoint);
  };

  const postData = async <T>(endpoint: string, data: any): Promise<T> => {
    return await post<T>(endpoint, data);
  };

  const putData = async <T>(endpoint: string, data: any): Promise<T> => {
    return await put<T>(endpoint, data);
  };

  const deleteData = async <T>(endpoint: string): Promise<T> => {
    return await del<T>(endpoint);
  };

  return { getData, postData, putData, deleteData };
};

export default useApi;
