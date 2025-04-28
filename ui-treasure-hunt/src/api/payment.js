import axiosInstance from './axios-interceptor';

const createStripeCheckoutSession = (dataToPost) => {
    return axiosInstance.post("/api/payment/checkout", dataToPost, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: false,
    });
};

export { createStripeCheckoutSession };