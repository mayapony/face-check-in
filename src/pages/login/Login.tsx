import { Button, TextField } from "@mui/material";

export const Login = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-blue-100 bg-login-page bg-contain bg-bottom bg-no-repeat">
      <form
        action=""
        className="flex  flex-col space-y-4 rounded-md border bg-white p-10 shadow-md dark:bg-slate-700 sm:w-full md:w-1/2 lg:w-1/4"
      >
        <TextField label="用户名" variant="outlined" />
        <TextField label="密 码" variant="outlined" />
        <Button variant="contained">登 陆</Button>
        <a className=" text-right text-sm text-gray-400" href="_blank">
          还没有账户？去注册
        </a>
      </form>
    </div>
  );
};
