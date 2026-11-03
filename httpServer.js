import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Employee task array
let tasks = [
  {
    id: 1,
    taskName: "Develop Login Page",
    assignedTo: "Rahul Sharma",
    status: "Pending",
  },
  {
    id: 2,
    taskName: "Create Dashboard",
    assignedTo: "Amit Kumar",
    status: "Completed",
  },
  {
    id: 3,
    taskName: "Test Website",
    assignedTo: "Priya Sharma",
    status: "Pending",
  },
];

// Create HTTP server
const server = http.createServer((req, res) => {
  // A2: Welcome route
  if (req.url === "/" && req.method === "GET") {
    res.writeHead(200, {
      "Content-Type": "text/html",
    });

    res.end("<h1>Welcome to Employee Task Management System</h1>");
  }

  // A2 and A3: Get all tasks
  else if (req.url === "/tasks" && req.method === "GET") {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });

    res.end(JSON.stringify(tasks));
  }

  // A2: About route
  else if (req.url === "/about" && req.method === "GET") {
    res.writeHead(200, {
      "Content-Type": "text/html",
    });

    res.end(
      "<h1>Employee Task Management Application</h1><p>Manage employee tasks using Node.js.</p>",
    );
  }

  // A2 and A4: Serve HTML using FS module
  else if (req.url === "/home" && req.method === "GET") {
    const filePath = path.join(__dirname, "public", "index.html");

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, {
          "Content-Type": "text/plain",
        });

        res.end("Error reading HTML file");
        return;
      }

      res.writeHead(200, {
        "Content-Type": "text/html",
      });

      res.end(data);
    });
  }

  // A3: Add new task
  else if (req.url === "/add-task" && req.method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const newTask = JSON.parse(body);

        // A5: Validate required fields
        if (
          newTask.id === undefined ||
          !newTask.taskName ||
          !newTask.assignedTo ||
          !newTask.status
        ) {
          res.writeHead(400, {
            "Content-Type": "application/json",
          });

          res.end(
            JSON.stringify({
              message: "All required fields are necessary",
            }),
          );

          return;
        }

        tasks.push(newTask);

        res.writeHead(201, {
          "Content-Type": "application/json",
        });

        res.end(
          JSON.stringify({
            message: "Task added successfully",
            task: newTask,
          }),
        );
      } catch (error) {
        res.writeHead(400, {
          "Content-Type": "application/json",
        });

        res.end(
          JSON.stringify({
            message: "Invalid JSON data",
          }),
        );
      }
    });
  }

  // A5: Invalid route
  else {
    res.writeHead(404, {
      "Content-Type": "text/plain",
    });

    res.end("404 - Page Not Found");
  }
});

// A1: Start server on port 3000
server.listen(3000, () => {
  console.log("HTTP Server running at http://localhost:3000");
});