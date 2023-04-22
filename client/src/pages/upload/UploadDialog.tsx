import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import axios from "axios";
import { API_BASE } from "@/global";
import { localGet } from "@/utils";

type ActivityType = {
  id: number;
  name: string;
};

type UploadDialogPropsType = {
  open: boolean;
  handleClose: () => void;
  setCheckedActivity: Dispatch<SetStateAction<string>>;
};

export const UploadDialog = ({
  open,
  handleClose,
  setCheckedActivity,
}: UploadDialogPropsType) => {
  const activitysRef = useRef<ActivityType[]>([]);
  const [activityID, setActivityID] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    loadActivitys();
  }, []);

  const handleSubmitUpdate = (e: SyntheticEvent) => {
    e.preventDefault();
    const postData = {
      activityID,
      password,
      userID: localGet("userID"),
    };
    axios.post(`${API_BASE}/users/join`, postData).then((res) => {
      if (res.data) {
        console.log(res.data);
        handleClose();
        setCheckedActivity(res.data.name);
      }
    });
  };

  const handleChange = (event: SelectChangeEvent) => {
    setActivityID(event.target.value);
  };

  const loadActivitys = () => {
    axios.get(`${API_BASE}/activitys`).then((res) => {
      if (res.data) {
        activitysRef.current = res.data;
      }
    });
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>更新信息</DialogTitle>
      <DialogContent sx={{ maxWidth: "500px" }}>
        <form className="w-full" onSubmit={handleSubmitUpdate}>
          <FormControl fullWidth>
            <InputLabel id="inputLabelID" className="my-2">
              活动
            </InputLabel>
            <Select
              labelId="inputLabelID"
              label="Age"
              sx={{ width: "400px" }}
              value={activityID}
              onChange={handleChange}
              className="my-2"
              required
            >
              {activitysRef.current.map((activity) => (
                <MenuItem value={activity.id} key={activity.id}>
                  {activity.name}
                </MenuItem>
              ))}
            </Select>

            <TextField
              autoFocus
              margin="dense"
              label="参加密码"
              type="password"
              fullWidth
              required
              variant="outlined"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />

            <div className="flex w-full flex-row-reverse">
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
          </FormControl>
        </form>
      </DialogContent>
    </Dialog>
  );
};
