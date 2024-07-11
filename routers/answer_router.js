const express = require('express')
const answer_dal = require('../dals/answers_dal')
const statistics_dal = require('../dals/statistics_dal')
const my_logger = require('../logger/my_logger')
const router = express.Router()

// --- /api/answer
router.get('', async(request, response) => {
    const result = await answer_dal.get_all_answers()
    // 200 = success
    // 201 created 204 no content
    response.status(200).json(result.data)
})

// ============================================== FIX THIS CODE + TEST

// prefix: /api/answer/:id
// example: /api/answer/3
router.get('/:id', async (request, response) => {
    const id = request.params.id
    const result = await answer_dal.get_answer_by_id(id)
    response.status(200).json(result.data ? result.data : {})
})

router.post('', async (request, response) => {
        const new_answer = request.body
        console.log(request.cookies);
        const id = request.cookies.auth.split('_')[1] 
        new_answer.user_id = id
        console.log(new_answer);
        const result = await answer_dal.insert_answer(new_answer)
       if (result.status == "success") 
            response.status(201).json({ new_answer: result.data, url: `/api/answers/${result.data.id}` })
        else
            response.status(result.internal ? 500: 400).json({ status: "Failed to insert new answer", error: result.error })
})

router.patch('/:id', async (request, response) => {
    const id = request.params.id
    const updated_answer = request.body    
    const result = await answer_dal.patch_answer(id, updated_answer)

    response.status(200).json({ result: result.data ? "answer updated" : "answer not found" })
})

router.delete('/:id', async (request, response) => {
    const id = request.params.id
    const result = await answer_dal.delete_answer(id)
    console.log(result);
    response.status(200).json({ result: result.data ? "answer deleted" : "answer not found" })
})

router.delete('/table/answer-delete-table', async (request, response) => {
    const result = await answer_dal.delete_table1()
    response.status(200).json({ status: "table-deleted" })
})

router.post('/table/answer-create-table', async (request, response) => {
    const result = await answer_dal.create_table2()
    console.log(result);
    if (result.status == "success")
        
        response.status(201).json({ status: "table-created" })
    else
        response.status(result.internal? 500 : 400).json({ error: result.error })
})

router.post('/table/answer-create4', async (request, response) => {
    const result = await answer_dal.insert_4answers()
    response.status(201).json({ result: "4 new answer created" })
})

router.get('/statistics/1-answers-per-question/:id' , async (request, response) => {
    const id = request.params.id
    const result = await statistics_dal.statistics1(id)
    response.status(200).json(result)
})

router.get('/statistics/2-total-answers-per-question/:id' , async (request, response) => {
    const id = request.params.id
    const result = await statistics_dal.statistics2(id)
    response.status(200).json(result)
})

router.get('/statistics/3-users-answers/:id' , async (request, response) => {
    const id = request.params.id
    const result = await statistics_dal.statistics3(id)
    response.status(200).json(result)
})

module.exports = router