/********************************************************************************
*  WEB322 – Assignment 03
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Gopal Sapkota Student ID: 153389234 Date: 2025/06/11
*
*  Published URL: [Your Vercel URL]
*
********************************************************************************/

const express = require("express"); 
const path = require("path");
const app = express(); 
const projectData = require("./modules/projects"); 

const HTTP_PORT = process.env.PORT || 8080; 

app.use(express.static("public")); 

projectData.initialize().then(() => { 
    app.listen(HTTP_PORT, () => { 
        console.log(`Server listening on port ${HTTP_PORT}`);
    });
}).catch(err => { 
    console.error("Failed to initialize project data:", err); 
});

// Routes
app.get("/", (req, res) => { 
    res.sendFile(path.join(__dirname, "/views/home.html"));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/about.html"));
});

// Updated combined projects route with sector filtering
app.get("/solutions/projects", (req, res) => { 
    const sector = req.query.sector;
    
    if (sector) {
        projectData.getProjectsBySector(sector)
        .then(data => res.json(data))
        .catch(err => res.status(404).json({message: err})); 
    } else {
        projectData.getAllProjects()
        .then(data => res.json(data))
        .catch(err => res.status(404).json({message: err}));
    }
}); 

// Updated project by ID route
app.get("/solutions/projects/:id", (req, res) => { 
    projectData.getProjectById(parseInt(req.params.id))
    .then(data => res.json(data))
    .catch(err => res.status(404).json({message: err}));
});

// 404 error handling
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "/views/404.html"));
});