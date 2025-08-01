export const useAuth = () => {
  const token = localStorage.getItem("ACCESS_TOKEN");
  return { isAuthenticated: !!token };
};
