import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Typography, Button, Card, CardContent, TextField, Checkbox, FormControlLabel } from "@mui/material";
import "../index.css";


const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);
  const [tempCompleted, setTempCompleted] = useState(false); // Temporary state for checkbox

  // Fetch task details
  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/tasks/${id}/`)
      .then(response => {
        setTask(response.data);
        setTitle(response.data.title);
        setDescription(response.data.description);
        setCompleted(response.data.completed);
        setTempCompleted(response.data.completed); // Sync tempCompleted with real completed value
      })
      .catch(() => navigate("/"));
  }, [id, navigate]);

  // Handle updating the task (only when Save is clicked)
  const handleUpdateTask = () => {
    axios.put(`http://127.0.0.1:8000/api/tasks/${id}/`, { 
        title, 
        description, 
        completed: tempCompleted // Use tempCompleted, not the original state
      })
      .then(response => {
        setTask(response.data);
        setCompleted(response.data.completed); // Update completed state
        setIsEditing(false); // Exit editing mode
      })
      .catch(error => console.error("Error updating task:", error));
  };

  // Handle deleting the task
  const handleDelete = () => {
    axios.delete(`http://127.0.0.1:8000/api/tasks/${id}/`)
      .then(() => navigate("/"));
  };

  if (!task) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Card>
        <CardContent>
          {completed ? (
            <>
              <Typography variant="h4" sx={{ textDecoration: "line-through", color: "gray" }}>{task.title}</Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>{task.description || "No description provided."}</Typography>
              <Typography variant="subtitle1" sx={{ mt: 2, color: "green" }}>✅ Task Completed</Typography>
            </>
          ) : (
            <>
              {isEditing ? (
                <>
                  <Typography variant="h5">Edit Task</Typography>
                  <TextField
                    fullWidth
                    label="Title"
                    sx={{ mt: 2 }}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Description"
                    sx={{ mt: 2 }}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
      
                  <FormControlLabel
                    control={<Checkbox checked={tempCompleted} onChange={(e) => setTempCompleted(e.target.checked)} />}
                    label="Mark as Completed"
                    sx={{ mt: 2 }}
                  />
                  <Button variant="contained" sx={{ mt: 2, mr: 2 }} onClick={handleUpdateTask}>
                    Save
                  </Button>
                  <Button variant="outlined" sx={{ mt: 2 }} onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Typography variant="h4">{task.title}</Typography>
                  <Typography variant="body1" sx={{ mt: 2 }}>{task.description || "No description provided."}</Typography>
                  <Button variant="contained" sx={{ mt: 3, mr: 2 }} onClick={() => setIsEditing(true)}>
                    Edit
                  </Button>
                  <Button variant="contained" color="error" sx={{ mt: 3 }} onClick={handleDelete}>
                    Delete
                  </Button>
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default TaskDetails;
