import { API_BASE, LOGIN_OPTIONS } from "@/global";
import CloseIcon from "@mui/icons-material/Close";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
  Alert,
  Backdrop,
  Button,
  ButtonGroup,
  CircularProgress,
  ClickAwayListener,
  Collapse,
  Grow,
  IconButton,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  TextField,
} from "@mui/material";
import axios from "axios";
import { SyntheticEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { localGet, localSave } from "@/utils";

const options = LOGIN_OPTIONS;

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [enableBackdrop, setEnableBackdrop] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (localGet("role")?.toString() === "0") {
      navigate("/upload");
    } else if (localGet("role")?.toString() === "1") {
      navigate("/home");
    } else {
      navigate("/login");
    }
  }, []);

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
      isAdmin: selectedIndex,
    };

    console.log(postData);
    if (!isLogin) {
      // 注册
      axios
        .post(`${API_BASE}/users`, postData)
        .then((res) => {
          const data = res.data;
          localSave(data.name, data.isAdmin, data.id);
          if (selectedIndex === 0) navigate("/upload");
          else navigate("/home");
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
          if (res.data) {
            const data = res.data;
            console.log(data);
            localSave(data.name, data.isAdmin, data.id);
            if (selectedIndex === 0) navigate("/upload");
            else navigate("/home");
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
              <TextField
                label="重复密码"
                variant="outlined"
                type="password"
                required
              />
              <TextField
                label="姓 名"
                variant="outlined"
                name="name"
                required
              />
            </>
          )}

          <div className="w-full">
            <ButtonGroup
              variant="contained"
              ref={anchorRef}
              aria-label="split button"
              className="w-full"
            >
              <Button type="submit" className="w-full">
                {options[selectedIndex] + (isLogin ? "登陆" : "注册")}
              </Button>
              <Button
                size="small"
                aria-controls={open ? "split-button-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-label="select merge strategy"
                aria-haspopup="menu"
                onClick={() => {
                  setOpen(!open);
                }}
              >
                <ArrowDropDownIcon />
              </Button>
            </ButtonGroup>
            <Popper
              sx={{
                zIndex: 1,
              }}
              open={open}
              anchorEl={anchorRef.current}
              role={undefined}
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === "bottom" ? "center top" : "center bottom",
                  }}
                >
                  <Paper>
                    <ClickAwayListener
                      onClickAway={() => {
                        setOpen(false);
                      }}
                    >
                      <MenuList id="split-button-menu" autoFocusItem>
                        {options.map((option, index) => (
                          <MenuItem
                            key={option}
                            disabled={index === 2}
                            selected={index === selectedIndex}
                            onClick={() => {
                              setSelectedIndex(index);
                              setOpen(false);
                            }}
                          >
                            {option}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </div>

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
