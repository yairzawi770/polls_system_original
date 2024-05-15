const knex = require('knex')
const config = require('config')

const data_base = knex({
    client: 'pg',
    connection: {
        host: config.db_connection.host,
        user: config.db_connection.user,
        password: config.db_connection.password,
        database: config.db_connection.database
    }
})

async function create_table() {
    try {
        const result = await data_base.raw(`CREATE TABLE if not exists users (
            id SERIAL PRIMARY KEY,
            first_name VARCHAR(50) NOT NULL,
            last_name VARCHAR(50) NOT NULL,
            email VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(50) NOT NULL,
            birthday DATE NOT NULL,
            address VARCHAR(50)
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

async function insert_users5() {
    try {
        const query = `INSERT INTO users (first_name, last_name, email, password, birthday, address) VALUES
        ('Alice', 'Johnson', 'alice.johnson@example.com', 'hashed_password_1', '1990-01-01', '123 Elm Street, Springfield, USA'),
        ('Bob', 'Smith', 'bob.smith@example.com', 'hashed_password_2', '1985-05-23', '456 Oak Avenue, Springfield, USA'),
        ('Carol', 'Williams', 'carol.williams@example.com', 'hashed_password_3', '1992-09-12', '789 Maple Road, Springfield, USA'),
        ('Dave', 'Jones', 'dave.jones@example.com', 'hashed_password_4', '1988-11-03', '135 Pine Lane, Springfield, USA'),
        ('Eve', 'Brown', 'eve.brown@example.com', 'hashed_password_5', '1995-04-30', '246 Cedar Street, Springfield, USA');`
            await data_base.raw (query + ';') 
    }
    catch (e) {
        console.log('insert 5 failed');
        console.log(e.message);
    }

}

async function get_all_users() {
    // add try catch
    const users = await data_base.raw("select * from users")
    //console.log(users.rows.map(s => `[${s.id}] ${s.name}`));
    return {
        status: "success",
        data: users.rows
    }
}

async function get_user_by_id(id) {
    const users = await data_base.raw(`select * from users where id = ${id}`)
    console.log(`By id = [${users.rows[0].id}] ${users.rows[0].name}`);
    console.log(users.rows[0]);
    return {
        status: "success",
        data: users.rows[0]
    }
}

async function insert_user(new_user) {
    try {
        delete new_user.id
        const result_ids = await data_base('users').insert(new_user).returning('id');
        //console.log(result_ids[0]);

        const id = result_ids[0].id // the new id
        return {
            status: "success",
            data: { id, ...new_user }
        }
        // url: `/api/users/${id}`
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

async function update_user(id, updated_user) {
    // add try-catch
    // can fail due to duplication
    const result = await data_base.raw(`UPDATE users set first_name=?,last_name=?,email=?,password=?,birthday=?,address=? where id=?`,
        [updated_user.first_name ? updated_user.first_name : '',
        updated_user.last_name ? updated_user.last_name : '',
        updated_user.email ? updated_user.email : '',
        updated_user.password ? updated_user.password : '',
        updated_user.birthday ? updated_user.birthday : '',
        updated_user.address ? updated_user.address : '',
            id])
    console.log('updated succeeded for id ' + id);
    return {
        status: "success",
        data: result.rowCount
    }
}

async function patch_user(id, updated_user) {
    // add try-catch to figure out if there was
    // a unique constrain error, if so the user should get error-400
    const query_arr = []
    for (let key in updated_user) {
        query_arr.push(`${key}='${updated_user[key]}'`)
    }

    if (query_arr.length > 0) {
        // check how many employess updated?
        const query = `UPDATE users set ${query_arr.join(', ')} where id=${id}`
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

async function delete_user(id) {
    const result = await data_base.raw(`DELETE from users where id=${id}`)
    console.log(result.rowCount);
    return {
        status: "success",
        data: result.rowCount
    }
}

async function delete_table() {
    // delete table
    // try catch in case table does not exist
    await data_base.raw(`DROP table if exists users`)
    return {
        status: "success"
    }
}

module.exports = {
    get_all_users, get_user_by_id, insert_user,
    update_user, patch_user, delete_user, delete_table,
    create_table, insert_users5, data_base
}