import { API_BASE } from "@/global";
import CloseIcon from "@mui/icons-material/Close";
import {
  Alert,
  Backdrop,
  Button,
  CircularProgress,
  Collapse,
  IconButton,
  TextField,
} from "@mui/material";
import axios from "axios";
import { SyntheticEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [enableBackdrop, setEnableBackdrop] = useState(false);
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    setEnableBackdrop(true);
    setIsError(false);

    const target = event.target as typeof event.target & {
      phoneNumber: { value: string };
      name: { value: string };
      password: { value: string };
    };

    const postData = {
      phoneNumber: target.phoneNumber.value,
      name: target.name.value,
      password: target.password.value,
    };
    if (!isLogin) {
      // 注册
      axios
        .post(`${API_BASE}/users`, postData)
        .then((res) => {
          console.log(res);
          navigate("/home");
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => setEnableBackdrop(false));
    } else {
      // 登陆
      axios
        .post(`${API_BASE}/users/login`, postData)
        .then((res) => {
          console.log(res);
          if (res.data) {
            navigate("/home");
          } else {
            throw "帐号或密码错误";
          }
        })
        .catch((error) => {
          setIsError(true);
          console.error(error);
        })
        .finally(() => setEnableBackdrop(false));
    }
  };

  return (
    <>
      <div className="flex h-screen w-full items-center justify-center bg-blue-100 bg-login-page bg-contain bg-bottom bg-no-repeat">
        <form
          className="flex  flex-col space-y-4 rounded-md border bg-white p-10 shadow-md  sm:w-full md:w-1/2 lg:w-1/4"
          onSubmit={handleSubmit}
        >
          <Collapse in={isError}>
            <Alert
              severity="error"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setIsError(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              帐号或密码错误!
            </Alert>
          </Collapse>
          <TextField
            label="号 码"
            variant="outlined"
            name="phoneNumber"
            required
          />
          <TextField
            label="密 码"
            variant="outlined"
            name="password"
            type="password"
            required
          />
          {!isLogin && (
            <>
              <TextField label="重复密码" variant="outlined" required />
              <TextField
                label="姓 名"
                variant="outlined"
                name="name"
                required
              />
            </>
          )}

          <Button variant="contained" type="submit">
            {isLogin ? "登 陆" : "注册"}
          </Button>

          <p
            className=" w-max self-end text-sm text-gray-400 hover:cursor-pointer"
            onClick={() => setIsLogin(!isLogin)}
          >
            还没有账户？{!isLogin ? "登 陆" : "注册"}
          </p>
        </form>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={enableBackdrop}
          onClick={() => {
            setEnableBackdrop(false);
          }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    </>
  );
};
