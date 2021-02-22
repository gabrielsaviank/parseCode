const uuid = require('uuid/v4');
const { validationResult } = require('express-validator')
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Goal = require('../models/goal');
const User = require('../models/user');

const getGoals = async(req, res, next) => {
    console.log("here")
    let goals;
    try {
        goals = await Goal.find();
    } catch (err) {
        return next(new HttpError('Zagonel - Falha consultado duchas em DB.', 500));
    }
    res.json({ goals: goals.map(show => show.toObject({ getters: true })) });
}; 

const getGoalsById = async(req, res, next) => {
    const goalId = req.params.GoalId;
    let goal;

    try {
        goal = await Goal.findById(goalId);
    } catch (err) {
        const error = new HttpError('Zagonel - Nâo foi possivel retornar a meta do DB.', 500);
        return next(error);
    }

    if (!goal) {
        return next(new HttpError('Zagonel - Náo foi encontrado nenhuma meta com essa Id.', 404));
    }
    res.json({ goal: goal.toObject({ getters: true }) });
}

const getGoalsByUserId = async(req, res, next) => {
    const userId = req.params.UserId;
    let goals; 

    try {
        goals = await Goals.find({ user: userId });

    } catch (err) {
        const error = new HttpError('Zagonel - Falha consultando o DB...', 500);
        return next(error);
    }

    if (!goals || goals.user === 0) {
        
        const error = new HttpError('Zagonel - Náo foi possivel encontrar um usuário com esta id', 404);
        return next(error);
    }

    res.json({ goals: goals.map(shr => shr.toObject({ getters: true })) })
}


const createGoal = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Zagonel - parämetros inválidos.', 422));
    }

    const { waterGoal, electricityGoal, user } = req.body;


    const goalToCreate = new Goal({
        waterGoal,
        electricityGoal,
        user
    });


    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        goalToCreate.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError('Zagonel - Falha ao criar metas no DB.', 500);
        return next(error);
    }
    res.status(201).json({ Goal: goalToCreate.toObject({ getters: true }) });
}

const deleteGoal = async(req, res, next) => {
    const goalId = req.params.goalId;
    let toDeleteGoal;

    try {
        toDeleteGoal = await Goal.findById(goalId).populate('user');;
    } catch (err) {
        return next(new HttpError('Zagonel - Não foi possivel retornar uma resposta do DB', 500));
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        toDeleteGoal.remove({ session: sess });
        toDeleteGoal.user.goals.pull(toDeleteGoal);
        toDeleteGoal.user.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        return next(new HttpError('Zagonel - Não foi possivel deletar a Meta no DB.', 500));
    }
    res.status(200).json({ message: 'Zagnonel - Shower deleted' });
}

exports.getGoals = getGoals;
exports.getGoalsById = getGoalsById;
exports.getGoalsByUserId = getGoalsByUserId;
exports.createGoal = createGoal;
exports.deleteGoal = deleteGoal;