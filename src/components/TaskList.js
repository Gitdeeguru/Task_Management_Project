import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Container, Typography, Grid, Card, CardContent, Button, Pagination } from "@mui/material";
import "../index.css";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(1);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/tasks/?page=${page}`)
      .then(response => {
        setTasks(response.data.results);
        setCount(response.data.count);
      })
      .catch(error => console.error("Error fetching tasks:", error));
  }, [page]);

  return (
    <Container className="task-container">
      <Typography variant="h3" textAlign="center">📋 Task List</Typography>
      
      <Button 
        component={Link} 
        to="/task/new" 
        className="button-primary"
        sx={{ display: "block", margin: "20px auto" }}
      >
        ➕ Add New Task
      </Button>

      <Grid container spacing={3}>
        {tasks.map(task => (
          <Grid item xs={12} sm={6} md={4} key={task.id}>
            <Card className="task-card">
              <CardContent>
                <Typography variant="h5">{task.title}</Typography>
                <Typography variant="body2">{task.description || "No description provided."}</Typography>
                <Button 
                  component={Link} 
                  to={`/task/${task.id}`} 
                  className="button-primary"
                  sx={{ marginTop: "10px" }}
                >
                  View Task
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

         {/* pagination controls  */}
      <div className="pagination-container">
        <Pagination
          count={Math.ceil(count / 5)}
          page={page}
          onChange={(e, value) => setPage(value)}
        />
      </div>
    </Container>
  );
};

export default TaskList;
