const knex = require("knex")
const config = require("config")
const logger = require('../logger/my_logger')
const data_base = knex({
    client: 'pg',
    connection: {
        host: config.db_connection.host,
        user: config.db_connection.user,
        password: config.db_connection.password,
        database: config.db_connection.database
    }
})

async function create_table2() {
    try {
        const result = await data_base.raw(`CREATE TABLE answers (
        id SERIAL PRIMARY KEY,
        question_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        selected_answer INTEGER NOT NULL CHECK (selected_answer BETWEEN 1 AND 4),
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (question_id) REFERENCES questions (id),
        UNIQUE (user_id, question_id) );`)
        return {
            status: "success"
        }
    }
    catch (e) {
        const case_number = Math.floor(Math.random() * 1000000) + 1000000
        logger.error(`case number : (${case_number}) error in creating answers table (${e.message})`);
        return {
            staus: 'failed to get students',
            error: e.message
        }
    }
}

async function insert_4answers() {
    `INSERT INTO answers (question_id, user_id, selected_answer) 
    VALUES (1,1,1);
    INSERT INTO answers (question_id, user_id, selected_answer) 
    VALUES (2,2,2);
    INSERT INTO answers (question_id, user_id, selected_answer)
     VALUES (3,3,3);
    INSERT INTO answers (question_id, user_id, selected_answer) 
    VALUES (4,4,4);`
        .replaceAll('\n    ', '')
        .split(';')
        .filter(query => query)
        .forEach(async query => { await data_base.raw(query + ';') })
}

async function get_all_answers() {
    try {
        const answers = await data_base.raw("select * from answers")
        return {
            status: "success",
            data: answers.rows
        }
    }
    catch (e) {
        const case_number = Math.floor(Math.random() * 1000000) + 1000000
        logger.error(`case number : (${case_number}) error in get all answers (${e.message})`);
        return {
            status: "failed to get answers",
            error: e.message
        }
    }
}

async function get_answer_by_id(id) {
    try {
        const answer = await data_base.raw(`select * from answers where id = ${id}`)
        //console.log(`By id = [${answer.rows[0].id}] [${answer.rows[0].answer_title}]`);
        //console.log(answer.rows[0]);
        return {
            status: "success",
            data: answer.rows[0]
        }
    }
    catch (e) {
        const case_number = Math.floor(Math.random() * 1000000) + 1000000
        logger.error(`case number : (${case_number}) error in get answer by id (${e.message})`)
        return {
            status: "failed to get answer",
            error: e.message
        }
    }
}

async function insert_answer(new_answer) {
    try {
        delete new_answer.id
        const result_ids = await data_base('answers').insert(new_answer).returning('id');
        console.log(result_ids[0]);

        const id = result_ids[0].id // the new id
        return {
            status: "success",
            data: { id, ...new_answer }
        }
    }
    catch (e) {
        const case_number = Math.floor(Math.random() * 1000000) + 1000000
        logger.error(`case number : (${case_number}) error in adding answer (${e.message})`)
        return {
            status: "failed to add a new student",
            error: e.message
        }
    }
}

async function patch_answer(id, updated_answer) {
    try {
        const query_arr = []
        for (let key in updated_answer) {
            query_arr.push(`${key}='${updated_answer[key]}'`)
        }
        //console.log(query_arr);

        if (query_arr.length > 0) {
            const query = `UPDATE answers set ${query_arr.join(', ')} where id=${id}`
            const result = await data_base.raw(query)
            return {
                status: "success",
                data: result.rowCount
            }
        }
        return {
            status: "success",
            data: query_arr.length
        }
    }
    catch (e) {
        const case_number = Math.floor(Math.random() * 1000000) + 1000000
        logger.error(`case number : (${case_number}) error in patch answer(${e.message})`)
        return {
            staus: "failed to patch",
            error: e.message
        }
    }
}

async function delete_answer(id) {
    try {
        const result = await data_base.raw(`DELETE from answers where id=${id}`)
        console.log(result.rowCount);
        return {
            status: "success",
            data: result.rowCount
        }
    }
    catch (e) {
        const case_number = Math.floor(Math.random() * 1000000) + 1000000
        logger.error(`case number : (${case_number}) error in deleting answer (${e.message})`);
        return {
            status: "failed to delete user",
            error: e.message
        }
    }
}

async function delete_table1() {
    try {
        await data_base.raw(`DROP table answers CASCADE`)
        return {
            status: "success"
        }
    }
    catch (e) {
        const case_number = Math.floor(Math.random() * 1000000) + 1000000
        logger.error(`case number : (${case_number}) error in delete answer table (${e.message})`);
        return {
            status: "failed to delete table",
            error: e.message
        }
    }
}


async function question_answer(questionId) {
    try {
        const checkQuestionId = await data_base.raw("SELECT id FROM questions WHERE id = ?", [questionId])
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
module.exports = {
    get_all_answers, get_answer_by_id, insert_answer,
    delete_answer, delete_table1,
    create_table2, insert_4answers, patch_answer, data_base
}