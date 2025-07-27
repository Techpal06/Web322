/********************************************************************************
*  WEB322 – Assignment 05
*
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
*
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
*  Name: Gopal Sapkota Student ID: 153389234 Date:2025/07/23
*
*  Published URL: 
********************************************************************************/

const express = require("express");
const path = require("path");
const app = express();
const projectData = require("./modules/projects");

const HTTP_PORT = process.env.PORT || 8080;

// Add middleware for form data
app.use(express.urlencoded({ extended: true }));

// configuring ejs
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.static("public"));
app.use(express.static(__dirname + '/public'));

projectData.initialize().then(() => {
    app.listen(HTTP_PORT, () => {
        console.log(`Server listening on port ${HTTP_PORT}`);
    });
}).catch(err => {
    console.error("Failed to initialize project data:", err);
});

// Routes
app.get("/", (req, res) => {
    res.render("home", { page: "/" });
});

app.get("/about", (req, res) => {
    res.render("about", { page: '/about' });
});

// Updated combined projects route with sector filtering
app.get("/solutions/projects", (req, res) => {
    const sector = req.query.sector;

    if (sector) {
        projectData.getProjectsBySector(sector)
            .then(data => {
              console.log(data);
                if (data.length > 0) {
                    res.render("projects", { projects: data, page: '/solutions/projects' });
                } else {
                    res.status(404).render("404", {
                        message: `No projects found for sector: ${sector}`
                    });
                }
            })
            .catch(err => res.status(404).render("404", { message: err }));
    } else {
        projectData.getAllProjects()
            .then(data => res.render("projects", { projects: data, page: '/solutions/projects' }))
            .catch(err => res.status(404).render("404", { message: err }));
    }
});

// Updated project by ID route
app.get("/solutions/projects/:id", (req, res) => {
    projectData.getProjectById(parseInt(req.params.id))
        .then(data => {
            if (data) {
                res.render("project", {
                    project: data,
                    page: ''
                });
            } else {
                res.status(404).render("404", {
                    message: `No project found with ID: ${req.params.id}`
                });
            }
        })
        .catch(err => res.status(404).render("404", { message: err }));
});

// Add Project routes
app.get("/solutions/addProject", (req, res) => {
    projectData.getAllSectors()
        .then((sectorData) => {
            res.render("addProject", { sectors: sectorData });
        })
        .catch((err) => {
            res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
        });
});

app.post("/solutions/addProject", (req, res) => {
    projectData.addProject(req.body)
        .then(() => {
            res.redirect("/solutions/projects");
        })
        .catch((err) => {
            res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
        });
});

// Edit Project routes
app.get("/solutions/editProject/:id", (req, res) => {
    Promise.all([
        projectData.getProjectById(parseInt(req.params.id)),
        projectData.getAllSectors()
    ])
    .then(([projectData, sectorData]) => {
        res.render("editProject", { sectors: sectorData, project: projectData });
    })
    .catch((err) => {
        res.status(404).render("404", { message: err });
    });
});

app.post("/solutions/editProject", (req, res) => {
    projectData.editProject(req.body.id, req.body)
        .then(() => {
            res.redirect("/solutions/projects");
        })
        .catch((err) => {
            res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
        });
});

// Delete Project route
app.get("/solutions/deleteProject/:id", (req, res) => {
    projectData.deleteProject(parseInt(req.params.id))
        .then(() => {
            res.redirect("/solutions/projects");
        })
        .catch((err) => {
            res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
        });
});

// 404 catch-all route
app.use((req, res) => {
    res.status(404).render("404", {
        message: "I'm sorry, we're unable to find what you're looking for"
    });
});