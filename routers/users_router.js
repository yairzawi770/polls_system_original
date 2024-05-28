const express = require('express')
const users_dal = require('../dals/users_dal')

const router = express.Router()

/**
*  @swagger
*  components:
*     schemas:
*       user:
*         type: object
*         required:
*           - id
*           - First_Name
*           - Last_Name
*           - Email
*           - Date_Of_Birth
*           - Address
*           - password 
*         properties:
*           id:
*             type: number
*             description: The auto-generated id of the user.
*           First_Name:
*             type: string
*             description: The First_Name of the user.
*           Last_Name:
*             type: string
*             description: The Last_Name of the user.
*           Email:
*             type: string
*             description: Email of the user
*           Date_Of_Birth:
*             type: date
*             description: The Date_Of_Birth of the user.
*           Address:
*             type: string
*             description: Address of the user
*           password:
*             type: string
*             description: password of the user
*         example:
*           First_Name: Kim
*           Last_Name: john
*           Email: kim.2@gmail.com
*           Date_Of_Birth: 02/02/1997
*           Address: soul
*           password: 123456
*/

// '/api/users'
// GET 
/**
*  @swagger
*   /api/users/:
*     get:
*       summary: List all of the users
*       responses:
*         "200":
*           description: The list of users.
*           content:
*             application/json:
*               schema:
*                 $ref: '#/components/schemas/users'
*/

// --- /api/users
router.get('', async(request, response) => {
    const result = await users_dal.get_all_users()
    // 200 = success
    // 201 created 204 no content
    response.status(200).json(result.data)
})


// ============================================== FIX THIS CODE + TEST

// prefix: /api/users/:id
// example: /api/users/3
router.get('/:id', async (request, response) => {
    const id = request.params.id
    const result = await users_dal.get_user_by_id(id)
    response.status(200).json(result.data ? result.data : {})
})

router.post('', async (request, response) => {
        const new_user = request.body
        const result = await users_dal.insert_user(new_user)
       if (result.status == "success") 
            response.status(201).json({ new_user: result.data, url: `/api/users/${result.data.id}` })
        else
            response.status(result.internal ? 500: 400).json({ status: "Failed to insert new user", error: result.error })
})

router.put('/:id', async (request, response) => {
    const id = request.params.id
    const updated_user = request.body
    const result = await users_dal.update_user(id, updated_user)

    response.status(200).json({ result: result.data ? "user updated" : "user not found" })
})

router.patch('/:id', async (request, response) => {
    const id = request.params.id
    const updated_user = request.body    
    const result = await users_dal.patch_user(id, updated_user)

    response.status(200).json({ result: result.data ? "user updated" : "user not found" })
})

router.delete('/:id', async (request, response) => {
    const id = request.params.id
    const result = await users_dal.delete_user(id)
    console.log(result);
    response.status(200).json({ result: result.data ? "user deleted" : "user not found" })
})

router.delete('/table/users-delete-table', async (request, response) => {
    const result = await users_dal.delete_table()
    response.status(200).json({ status: "table-deleted" })
})

router.post('/table/users-create-table', async (request, response) => {
    const result = await users_dal.create_table()
    console.log(result);
    if (result.status == "success") 
        response.status(201).json({ status: "table-created" })
    else
        response.status(result.internal? 500 : 400).json({ error: result.error })
})

router.post('/table/users-create5', async (request, response) => {
    const result = await users_dal.insert_5users()
    response.status(201).json({ result: "5 new users created" })
})

module.exports = router