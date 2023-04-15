import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);

  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/home");
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-blue-100 bg-login-page bg-contain bg-bottom bg-no-repeat">
      <form
        action=""
        className="flex  flex-col space-y-4 rounded-md border bg-white p-10 shadow-md  sm:w-full md:w-1/2 lg:w-1/4"
      >
        <TextField label="用户名" variant="outlined" required />
        <TextField label="密 码" variant="outlined" required />
        {!isLogin && <TextField label="重复密码" variant="outlined" required />}

        <Button variant="contained" onClick={handleLogin} style={{}}>
          {isLogin ? "登 陆" : "注册"}
        </Button>

        <p
          className=" w-max self-end text-sm text-gray-400 hover:cursor-pointer"
          onClick={() => setIsLogin(!isLogin)}
        >
          还没有账户？去{!isLogin ? "登 陆" : "注册"}
        </p>
      </form>
    </div>
  );
};
