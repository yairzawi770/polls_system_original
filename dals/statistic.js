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

async function question_answer(questionId) {
    try {
        const checkQuestionId = await data_base.raw("SELECT id FROM questions WHERE id = ?", [questionId])
        console.log(checkQuestionId);
        if (checkQuestionId.rowCount > 0) {
            const result = await data_base.raw(`SELECT
    q.question_title AS question,
    q.first_answer AS answer_1,
    COUNT(CASE WHEN a.selected_answer = q.first_answer THEN 1 END) AS answer_1_count,
    q.second_answer AS answer_2,
    COUNT(CASE WHEN a.selected_answer = q.second_answer THEN 1 END) AS answer_2_count,
    q.third_answer AS answer_3,
    COUNT(CASE WHEN a.selected_answer = q.third_answer THEN 1 END) AS answer_3_count,
    q.fourth_answer AS answer_4,
    COUNT(CASE WHEN a.selected_answer = q.fourth_answer THEN 1 END) AS answer_4_count
FROM
answers a
JOIN
    questions q ON a.question_id = q.id
WHERE
    q.id = ${questionId}
GROUP BY
    q.question_title,
    q.first_answer,
    q.second_answer,
    q.third_answer,
    q.fourth_answer;
`)
console.log(result);
            if (result.rowCount > 0) {
                return {
                    status: "success",
                    data: result.rows
                }
            }
            else {
                return {
                    status: "failed",
                    message: "user didnt answer the question"
                }
            }
        }
        else {
            return {
                status: "failed",
                message: "question doesnt exisit"
            }
        }

    } catch (error) {
        return {
            status: "failed",
            error: error.message
        };
    }
}

question_answer(1)

module.exports = { get_all_statistic }