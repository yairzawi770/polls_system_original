const questions_dal = require('./dals/questions_dal')
const assert = require('assert')

describe('Testing questions dal', () => {
    
    // run before each test
    beforeEach(async () => {
        // ARRANGE
        await questions_dal.delete_table();
        await questions_dal.create_table();
        await questions_dal.insert_questions5();
    })

    it('test get questions', async () => {
        // ACT
        const result = await questions_dal.get_all_questions();

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
        const result = await questions_dal.insert_student({
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
        await questions_dal.data_base.destroy()
    })
})
