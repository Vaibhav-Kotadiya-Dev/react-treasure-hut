import AxiosInterceptor from './axios-interceptor';

const registorUser = (dataToPost) => {
    return AxiosInterceptor.post(
      "/api/user/create",
      {
        ...dataToPost,
      },
      {
        withCredentials: false,
      }
    );
};

export { registorUser };
