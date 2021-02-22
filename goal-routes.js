const express = require('express')
const { check } = require('express-validator');


const router = express.Router();
const goalsControllers = require('../controllers/goals-controllers');

router.get('/', goalsControllers.getGoals);

router.get('/:GoalId', goalsControllers.getGoalsById);

router.get('/user/:UserId', goalsControllers.getGoalsByUserId);

router.post('/', goalsControllers.createGoal);

router.delete('/', goalsControllers.deleteGoal); 

module.exports = router;