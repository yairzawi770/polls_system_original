const students_dal = require('./dals/students_dal')
const assert = require('assert')

describe('Testing students dal', () => {
    
    // run before each test
    beforeEach(async () => {
        // ARRANGE
        await students_dal.delete_table();
        await students_dal.create_table();
        await students_dal.insert_students5();
    })

    it('test get students', async () => {
        // ACT
        const result = await students_dal.get_all_students();

        // ASSERT
        assert.strictEqual(result.status, 'success')
        assert.strictEqual(result.data.length, 5)
        // this is how to check object fields

        assert.deepStrictEqual(result.data[0], {
            id: 1,
            name: 'Arya Stark',
            age: 18,
            email: 'arya.stark@example.com',
            city: 'Winterfell'
          })

    })
    
    // add test for insert
    // call add and then get by id and then assert the result of the get
    it('test insert student', async () => {
        // ARRANGE
        const result = await students_dal.insert_student({
            name: 'Tom Harley',
            age: 22,
            email: 'tom.harrley@example.com',
            city: 'London'
          })

        // ASSERT
        assert.strictEqual(result.status, 'success')
        assert.deepStrictEqual(result.data,{
            id: 6,
            name: 'Tom Harley',
            age: 22,
            email: 'tom.harrley@example.com',
            city: 'London'
          })
          // more options: get by id -- 6 + assert
          // assert by field name
          assert.strictEqual(result.data.name, 'Tom Harley');
    });

    // run once after all of the tests
    after(async () => {
        await students_dal.data_base.destroy()
    })
})

