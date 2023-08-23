"use client";
import React, { useEffect, useState } from "react";
import addData from "@/firebase/firestore/addData";
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
} from "firebase/firestore";
import firebase_app from "@/firebase/config";
import CancelOutlined from "@mui/icons-material/CancelOutlined";
import AddIcon from "@mui/icons-material/Add";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  height: 500,
  bgcolor: "background.paper",
  borderRadius: "5px",
  // border: "2px solid #000",
  boxShadow: 24,
  outline: "none",
  p: 4,
};

export default function Home() {
  const [taskList, setTaskList] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTaskForm, setNewTaskForm] = useState<Record<string, string>>({
    name: "",
    description: "",
    status: "pending",
  });

  const handleChange = (e: any) => {
    const key = e.target.name;
    const value = e.target.value;
    let tempForm: Record<string, string> = { ...newTaskForm };
    tempForm[key] = value;
    setNewTaskForm(tempForm);
  };

  const handleOpenAddModal = () => {
    console.log("inside>>");
    setIsAddModalOpen(true);
  };

  console.log("add modal>>", isAddModalOpen);

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleForm = async () => {
    const data = {
      name: "John snow",
      description: "Stark",
    };
    const { result, error } = await addData("task-list", "user-id", data);

    if (error) {
      return console.log(error);
    }
  };

  const db = getFirestore(firebase_app);

  console.log("form.>>>", newTaskForm);
  // const fetchAllData = async () => {
  //   const response = await getAllData("task-list");
  //   console.log("result>>>>", response);
  // };

  useEffect(() => {
    getAllData("task-list");
  }, []);

  console.log("taskList>>>", taskList);

  function getAllData(col: string) {
    let result = null;
    let error = null;

    try {
      let q = query(collection(db, col));
      let itemsArr: any[] = [];

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          itemsArr.push({ ...doc.data(), id: doc.id });
        });
        console.log(itemsArr);
        setTaskList(itemsArr);
      });
    } catch (e) {
      error = e;
      return error;
    }
  }

  // const handleClickAdd = () => {};

  return (
    <div className="p-6">
      <h1 className="text-center font-bold text-2xl">Task Manager</h1>
      <div className="grid grid-cols-2 gap-4 p-10">
        <div className="border-slate-300 border-2 p-6 w-64 rounded-md flex justify-center items-center flex-col">
          <div className="cursor-pointer" onClick={handleOpenAddModal}>
            <AddIcon style={{ fontSize: "50px" }} />{" "}
          </div>
          {/* <div className="font-medium text-xl"> Add New Task</div> */}
        </div>
        {taskList.map((task) => {
          return (
            <div className="border-slate-300 border-2 p-6 w-64 rounded-md">
              <div className="flex justify-between">
                <div className="text-xl font-semibold">{task?.name}</div>
                <div>
                  <CancelOutlined />{" "}
                </div>
              </div>
              <div>{task?.description}</div>
            </div>
          );
        })}
      </div>
      <Modal
        open={isAddModalOpen}
        onClose={handleCloseAddModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="">
            <div className="flex justify-between">
              <div className="font-semibold text-xl">Add New Task</div>
              <div className="cursor-pointer" onClick={handleCloseAddModal}>
                <CloseIcon />
              </div>
            </div>
            <div>
              <div className="my-2">
                <div className="mb-2">Title</div>
                <div>
                  <TextField
                    size="small"
                    name="name"
                    className="w-full"
                    value={newTaskForm.name}
                    onChange={(e) => handleChange(e)}
                  />{" "}
                </div>
              </div>
              <div className="my-2">
                <div className="mb-2">Description</div>
                <div>
                  <textarea
                    name="description"
                    className="border-slate-300 border w-full p-2"
                    cols={5}
                    rows={5}
                    value={newTaskForm.description}
                    onChange={(e) => handleChange(e)}
                  />
                </div>
              </div>

              <div className="my-2">
                <div>Status</div>
                <div>
                  <FormControl>
                    <RadioGroup
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="status"
                      row
                      value={newTaskForm.status}
                      onChange={(e) => handleChange(e)}
                    >
                      <FormControlLabel
                        value="pending"
                        control={<Radio />}
                        label="Pending"
                      />
                      <FormControlLabel
                        value="completed"
                        control={<Radio />}
                        label="Completed"
                      />
                    </RadioGroup>
                  </FormControl>
                </div>
              </div>
              <div className="my-2">
                <div>
                  <Button variant="contained" fullWidth>
                    Save Task
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
