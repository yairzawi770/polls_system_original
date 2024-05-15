const knex = require('knex')
const config = require('config')

const data_base = knex({
    client: 'pg',
    connection: {
        host: config.db_connection.host,
        question: config.db_connection.question,
        password: config.db_connection.password,
        database: config.db_connection.database
    }
})

async function create_table() {
    try {
        const result = await data_base.raw(`CREATE TABLE if not exists questions (
            id SERIAL PRIMARY KEY,
            question_title VARCHAR(50) NOT NULL,
            first_answer VARCHAR(50) NOT NULL,
            second_answer VARCHAR(50) UNIQUE NOT NULL,
            third_answer VARCHAR(50) NOT NULL,
            fourth_answer VARCHAR(50) NOT NULL,
        );`)
        console.log('create finished successfully');
        return {
            status: "success",
        }
    }
    catch (e) {
        console.log('create failed');
        console.log(e.message);
    }
}

async function insert_4question() {
    try {
        const query = `INSERT INTO questions (question_title, first_answer, second_answer, third_answer, fourth_answer) VALUES
        ('What is the capital city of America?', 'Chicago, IL', 'New York, NY', 'Washington, DC', 'Los Angeles, CA'),
        ('Who was the first American president?', 'Thomas Jefferson', 'Abraham Lincoln', 'John Adams', 'George Washington'),
        ('In which city is the Empire State Building located?', 'Washington, DC', 'New York, NY', 'Seattle, WA', 'Dallas, TX'),
        ('What is the capital city of Louisiana?', 'New Orleans', 'Baton Rouge', 'Shreveport', 'Lafayette');`
            await data_base.raw (query + ';') 
    }
    catch (e) {
        console.log('insert 4 failed');
        console.log(e.message);
    }

}

async function get_all_questions() {
    // add try catch
    const questions = await data_base.raw("select * from questions")
    //console.log(questions.rows.map(s => `[${s.id}] ${s.name}`));
    return {
        status: "success",
        data: questions.rows
    }
}

async function get_question_by_id(id) {
    const questions = await data_base.raw(`select * from questions where id = ${id}`)
    console.log(`By id = [${questions.rows[0].id}] ${questions.rows[0].name}`);
    console.log(questions.rows[0]);
    return {
        status: "success",
        data: questions.rows[0]
    }
}

async function insert_question(new_question) {
    try {
        delete new_question.id
        const result_ids = await data_base('questions').insert(new_question).returning('id');
        //console.log(result_ids[0]);

        const id = result_ids[0].id // the new id
        return {
            status: "success",
            data: { id, ...new_question }
        }
        // url: `/api/questions/${id}`
        console.log('insert successed!');
    }
    catch (e) {
        console.log('insert failed!');
        return {
            status: "error",
            internal: false,
            error: e.message.replaceAll("\"", "'")
        }
    }
}

async function update_question(id, updated_question) {
    // add try-catch
    // can fail due to duplication
    const result = await data_base.raw(`UPDATE questions set question_title=?,first_answer=?,second_answer=?,third_answer=?,fourth_answer=? where id=?`,
        [updated_question.question_title ? updated_question.question_title : '',
        updated_question.first_answer ? updated_question.first_answer : '',
        updated_question.second_answer ? updated_question.second_answer : '',
        updated_question.third_answer ? updated_question.third_answer : '',
        updated_question.fourth_answer ? updated_question.fourth_answer : '',
            id])
    console.log('updated succeeded for id ' + id);
    return {
        status: "success",
        data: result.rowCount
    }
}

async function patch_question(id, updated_question) {
    // add try-catch to figure out if there was
    // a unique constrain error, if so the question should get error-400
    const query_arr = []
    for (let key in updated_question) {
        query_arr.push(`${key}='${updated_question[key]}'`)
    }

    if (query_arr.length > 0) {
        // check how many employess updated?
        const query = `UPDATE questions set ${query_arr.join(', ')} where id=${id}`
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

async function delete_question(id) {
    const result = await data_base.raw(`DELETE from questions where id=${id}`)
    console.log(result.rowCount);
    return {
        status: "success",
        data: result.rowCount
    }
}

async function delete_table() {
    // delete table
    // try catch in case table does not exist
    await data_base.raw(`DROP table if exists questions`)
    return {
        status: "success"
    }
}

module.exports = {
    get_all_questions, get_question_by_id, insert_question,
    update_question, patch_question, delete_question, delete_table,
    create_table, insert_4question, 
}