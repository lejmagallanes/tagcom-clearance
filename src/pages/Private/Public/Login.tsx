const Login = () => {
  const handleLogin = () => {
    localStorage.setItem("token", "sample-token");
    window.location.href = "/dashboard";
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleLogin}>Log In</button>
    </div>
  );
};

export default Login;
