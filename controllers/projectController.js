import { request, response } from 'express';
import Project from '../models/Project.js';
import List from '../models/List.js';
import User from '../models/User.js';

const getProjects = async (req = request, res = response) => {
	const projects = await Project.find().where('creator').equals(req.user._id).populate('collaborators');
	res.json(projects);
};

const createNewProject = async (req = request, res = response) => {
	const project = new Project(req.body);
	project.creator = req.user._id;

	try {
		const projectStore = await project.save();
		res.json(projectStore);
	} catch (error) {
		console.log(error);
	}
};

const getProject = async (req = request, res = response) => {
	const { id } = req.params;
	const project = await Project.findById(id);

	if (!project) {
		const error = new Error('No encontrado');
		return res.status(404).json({ msg: error.message });
	}

	if (project.creator.toString() !== req.user._id.toString()) {
		const error = new Error('Acción no valida');
		return res.status(404).json({ msg: error.message });
	}

	res.json(project);

	// Get task from project
	// const tasks = await Taks.find().where('project').equals(project._id);
	// res.json({
	// 	project,
	// 	tasks,
	// });
};

const editProject = async (req = request, res = response) => {
	const { id } = req.params;
	const project = await Project.findById(id);

	if (!project) {
		const error = new Error('No encontrado');
		return res.status(404).json({ msg: error.message });
	}

	if (project.creator.toString() !== req.user._id.toString()) {
		const error = new Error('Acción no valida');
		return res.status(404).json({ msg: error.message });
	}

	project.name = req.body.name || project.name;
	project.name_img = req.body.name_img || project.name_img;
	project.description = req.body.description || project.description;
	project.type = req.body.type || project.type;

	try {
		const projectStore = await project.save();
		res.json(projectStore);
	} catch (error) {
		console.log(error);
	}
};

const deleteProject = async (req = request, res = response) => {
	const { id } = req.params;
	const project = await Project.findById(id);

	// const lists = await List.find().where('project').equals(project._id);

	if (!project) {
		const error = new Error('No encontrado');
		return res.status(404).json({ msg: error.message });
	}

	if (project.creator.toString() !== req.user._id.toString()) {
		const error = new Error('Acción no valida');
		return res.status(404).json({ msg: error.message });
	}

	try {
		await project.delete();
		// await List.deleteMany({ project: project._id });

		res.json({ msg: 'Proyecto Eliminado' });
	} catch (error) {
		console.log(error);
	}
};

const findCollaborator = async (req = request, res = response) => {
	const { email } = req.body;

	const user = await User.findOne({ email }).select('-confirm -createdAt -token -updatedAt -__v -password');

	if (!user) {
		const error = new Error('User not found');
		return res.status(404).json({ msg: error.message });
	}

	res.json(user);
};

const addCollaborator = async (req = request, res = response) => {
	const { id } = req.params;
	const project = await Project.findById(id);

	if (!project) {
		const error = new Error('Project Not Found');
		return res.status(404).json({ msg: error.message });
	}

	if (project.creator.toString() !== req.user._id.toString()) {
		const error = new Error('Valid not action');
		return res.status(404).json({ msg: error.message });
	}

	const { email } = req.body;

	const user = await User.findOne({ email }).select('-confirm -createdAt -token -updatedAt -__v -password');

	if (!user) {
		const error = new Error('User not found');
		return res.status(404).json({ msg: error.message });
	}

	if (project.creator.toString() === user._id.toString()) {
		const error = new Error('El creador no puede agregarse');
		return res.status(404).json({ msg: error.message });
	}

	if (project.collaborators.includes(user._id)) {
		const error = new Error('El usuario ya existe al proyecto');
		return res.status(404).json({ msg: error.message });
	}

	project.collaborators.push(user._id);
	await project.populate('collaborators', 'name _id email');
	await project.save();
	res.json(project);
};

const deleteCollaborator = async (req = request, res = response) => {
	const project = await Project.findById(req.params.id);

	if (!project) {
		const error = new Error('Project Not Found');
		return res.status(404).json({ msg: error.message });
	}

	if (project.creator.toString() !== req.user._id.toString()) {
		const error = new Error('Valid not action');
		return res.status(404).json({ msg: error.message });
	}

	project.collaborators.pull(req.body.id);
	await project.save();
	res.json({ msg: 'Colaborador Eliminado' });
};

export {
	createNewProject,
	getProjects,
	getProject,
	editProject,
	deleteProject,
	addCollaborator,
	findCollaborator,
	deleteCollaborator,
};
