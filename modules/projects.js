/********************************************************************************
*  WEB322 – Assignment 02
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Gopal Sapkota Student ID: 153389234 Date: 2025/05/30
*
********************************************************************************/



const projectData = require("../data/projectData"); 
const sectorData = require("../data/sectorData"); 

let projects = []; 


function initialize() { 
    return new Promise((resolve, reject) => { 
        try { 
            projects = projectData.map(project=> { 
                const sector = sectorData.find(sec =>sec.id === project.sector_id);
                return { 
                    ...project,
                    sector: sector? sector.sector_name:"Unknown"
                };
            });
            resolve(); 

        } catch (err) { 
            reject("Unable to initialize project data"); 
        }

    });

}

function getAllProjects() { 
    return new Promise((resolve, reject)=> { 
        projects.length? resolve(projects):reject("No projects available");

    });

}


function getProjectById(projectId) { 
    return new Promise((resolve, reject) => { 
        const project = projects.find(p=>p.id === projectId);
        project ? resolve(project): reject("Project not found"); 

    });
}

function getProjectsBySector(sector) {
    return new Promise((resolve, reject) => { 
        const filtered = projects.filter(p=> p.sector.toLowerCase().includes(sector.toLowerCase())); 
        filtered.length ? resolve(filtered): reject("No projects match the given sector");
    });
}

module.exports = { initialize, getAllProjects, getProjectById, getProjectsBySector };