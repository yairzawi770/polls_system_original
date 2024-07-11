const config = require("config")
const knex = require("knex")


const data_base = knex({
    client: 'pg',
    connection: {
        host: config.db_connection.host,
        user: config.db_connection.user,
        password: config.db_connection.password,
        database: config.db_connection.database
    }
})

async function statistics1(question_id) {
    try {
        const question = await data_base.raw(`SELECT question_title, first_answer, second_answer,
             third_answer, fourth_answer
            FROM questions WHERE id = ${question_id};`)
        const answers = await data_base.raw(`SELECT selected_answer,count (*)
           FROM answers 
           WHERE question_id = ${question_id}
           GROUP BY selected_answer;`)

        return {
            status: "success",
            data: {
                question: question.rows[0],
                answers: answers.rows
            }
        }
    }
    catch (e) {
        logger.error(`statistics failed  (${e.message})`);
        return {
            staus: 'failed to get statistics',
            error: e.message
        }
    }
}

async function statistics2(question_id) {
    try {
        const answers = await data_base.raw(`SELECT count(*) FROM answers 
           WHERE question_id = ${question_id};`)
        const question = await data_base.raw(`SELECT question_title FROM questions 
           WHERE id = ${question_id};`)

        return {
            status: "success",
            data: {
                question: question.rows[0],
                answers: answers.rows[0]
            }
        }
    }
    catch (e) {
        logger.error(`statistics failed  (${e.message})`);
        return {
            staus: 'failed to get statistics',
            error: e.message
        }
    }
}

async function statistics3(user_id) {
    try {
        const answers = await data_base.raw(`SELECT question_id, selected_answer, user_id,
        u.first_name, u.last_name, q.question_title
        FROM answers a
        JOIN users u on a.user_id = u.id
        JOIN questions q on a.question_id = q.id
        WHERE user_id = ${user_id};`)

        return {
            status: "success",
            data: {
                answers: answers.rows
            }
        }
    }
    catch (e) {
        logger.error(`statistics failed  (${e.message})`);
        return {
            staus: 'failed to get statistics',
            error: e.message
        }
    }
}
module.exports = { statistics1, statistics2, statistics3 }