import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Container, TextField, Button, Typography } from "@mui/material";
import "../index.css";

const TaskForm = () => {
  const { id } = useParams();  
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      axios.get(`http://127.0.0.1:8000/api/tasks/${id}/`)
        .then(response => {
          setTitle(response.data.title);
          setDescription(response.data.description);
          setLoading(false);
        })
        .catch(error => {
          console.error("Error fetching task:", error);
          navigate("/");
        });
    } else {
      setLoading(false); 
    }
  }, [id, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const taskData = { title, description };

    if (id) {
      axios.put(`http://127.0.0.1:8000/api/tasks/${id}/`, taskData)
        .then(() => navigate("/"));
    } else {
      axios.post("http://127.0.0.1:8000/api/tasks/", taskData)
        .then(() => navigate("/"));
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4">{id ? "Edit Task" : "Add New Task"}</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Task Title" fullWidth sx={{ mb: 2 }} required value={title} onChange={(e) => setTitle(e.target.value)} />
        <TextField label="Description" multiline rows={4} fullWidth sx={{ mb: 2 }} value={description} onChange={(e) => setDescription(e.target.value)} />
        <Button type="submit" variant="contained">{id ? "Update" : "Add"} Task</Button>
      </form>
    </Container>
  );
};

export default TaskForm;
