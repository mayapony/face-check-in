import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { ChangeEvent, useState } from "react";

const INIT_USER_DATA = {
  name: "",
  phoneNumebr: "",
  password: "123456",
};

export const AddUserButton = () => {
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState(INIT_USER_DATA);

  const handleChange = (event: ChangeEvent) => {
    const target = event.target as any as {
      id: string;
      value: string;
    };
    setUserData({
      ...userData,
      [target.id]: target.value,
    });
    console.log(target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <div className="my-1 flex w-full flex-row-reverse border border-gray-200 p-2">
        <Button variant="contained" size="small" onClick={() => setOpen(true)}>
          添加
        </Button>
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>添加用户</DialogTitle>
        <DialogContent sx={{ maxWidth: "400px" }}>
          <form className="w-full">
            {Object.keys(INIT_USER_DATA).map((key) => (
              <TextField
                key={key}
                id={key}
                variant="outlined"
                onChange={(event) => handleChange(event)}
              />
            ))}

            <div className="mt-2 flex w-full flex-row-reverse">
              <Button
                type="submit"
                variant="contained"
                sx={{ marginLeft: "10px" }}
              >
                提交
              </Button>
              <Button onClick={handleClose} variant="contained">
                取消
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
