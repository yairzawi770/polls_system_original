const express = require('express')
const question_dal = require('../dals/question_dal')

const router = express.Router()

// --- /api/question
router.get('', async(request, response) => {
    const result = await question_dal.get_all_questions()
    // 200 = success
    // 201 created 204 no content
    response.status(200).json(result.data)
})

// ============================================== FIX THIS CODE + TEST

// prefix: /api/question/:id
// example: /api/question/3
router.get('/:id', async (request, response) => {
    const id = request.params.id
    const result = await question_dal.get_question_by_id(id)
    response.status(200).json(result.data ? result.data : {})
})

router.post('', async (request, response) => {
        const new_question = request.body
        const result = await question_dal.insert_question(new_question)
       if (result.status == "success") 
            response.status(201).json({ new_question: result.data, url: `/api/question/${result.data.id}` })
        else
            response.status(result.internal ? 500: 400).json({ status: "Failed to insert new question", error: result.error })
})


router.patch('/:id', async (request, response) => {
    const id = request.params.id
    const updated_question = request.body    
    const result = await question_dal.patch_question(id, updated_question)

    response.status(200).json({ result: result.data ? "question updated" : "question not found" })
})

router.delete('/:id', async (request, response) => {
    const id = request.params.id
    const result = await question_dal.delete_question(id)
    console.log(result);
    response.status(200).json({ result: result.data ? "question deleted" : "question not found" })
})

router.delete('/table/question-delete-table', async (request, response) => {
    const result = await question_dal.delete_table1()
    response.status(200).json({ status: "table-deleted" })
})

router.post('/table/question-create-table', async (request, response) => {
    const result = await question_dal.create_table2()
    console.log(result);
    if (result.status == "success")
        
        response.status(201).json({ status: "table-created" })
    else
        response.status(result.internal? 500 : 400).json({ error: result.error })
})

router.post('/table/question-create4', async (request, response) => {
    const result = await question_dal.insert_4questions()
    response.status(201).json({ result: "4 new question created" })
})

module.exports = router