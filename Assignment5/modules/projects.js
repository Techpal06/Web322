/********************************************************************************
*  WEB322 – Assignment 05
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Gopal Sapkota Student ID: 153389234 Date: 2025/07/05
*
********************************************************************************/

require('dotenv').config();
require('pg');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
  host: process.env.PGHOST,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
       require: true,
      rejectUnauthorized: false
     }
  }
});

// Define Models
const Sector = sequelize.define('Sector', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sector_name: Sequelize.STRING
}, { timestamps: false });

const Project = sequelize.define('Project', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: Sequelize.STRING,
  feature_img_url: Sequelize.STRING,
  summary_short: Sequelize.TEXT,
  intro_short: Sequelize.TEXT,
  impact: Sequelize.TEXT,
  original_source_url: Sequelize.STRING,
  sector_id: Sequelize.INTEGER
}, { timestamps: false });

// Setup association
Project.belongsTo(Sector, { foreignKey: 'sector_id' });

// Initialize function
function initialize() {
  return new Promise((resolve, reject) => {
    sequelize.sync()
      .then(() => resolve())
      .catch(err => reject(err));
  });
}

// CRUD Functions
function getAllProjects() {
  return new Promise((resolve, reject) => {
    Project.findAll({ include: [Sector] })
      .then(projects => resolve(projects))
      .catch(err => reject("no results returned"));
  });
}

function getProjectById(projectId) {
  return Project.findByPk(projectId, {
    include: [Sector],
    rejectOnEmpty: true
  });
}

function getProjectsBySector(sector) {
  return new Promise((resolve, reject) => {
    Project.findAll({
      include: [Sector],
      where: {
        '$Sector.sector_name$': {
          [Sequelize.Op.iLike]: `%${sector}%`
        }
      }
    })
      .then(projects => {
        if (projects.length > 0) resolve(projects);
        else reject("Unable to find requested projects");
      })
      .catch(err => reject(err));
  });
}

function getAllSectors() {
  return new Promise((resolve, reject) => {
    Sector.findAll()
      .then(sectors => resolve(sectors))
      .catch(err => reject(err));
  });
}

function addProject(projectData) {
  return new Promise((resolve, reject) => {
    Project.create(projectData)
      .then(() => resolve())
      .catch(err => reject(err.errors[0].message));
  });
}

function editProject(id, projectData) {
  return new Promise((resolve, reject) => {
    Project.update(projectData, { where: { id } })
      .then(() => resolve())
      .catch(err => reject(err.errors[0].message));
  });
}

function deleteProject(id) {
  return new Promise((resolve, reject) => {
    Project.destroy({ where: { id } })
      .then(() => resolve())
      .catch(err => reject(err.errors[0].message));
  });
}

module.exports = {
  initialize,
  getAllProjects,
  getProjectById,
  getProjectsBySector,
  getAllSectors,
  addProject,
  editProject,
  deleteProject
};

