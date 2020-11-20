import reducer from './reducer';

describe('test organization manipulation', () => {
  test('add org, no parent', () => {
      expect(
          reducer({
            calResources: [{
              id: 'id_1234',
              title: 'test_parent',
              children: [],
            }
            ]
          }, {
              type: "CREATE_ORG",
              payload: {
                  id: 'id_new_org',
                  title: 'new_top_level_org',
                  parent: 'None',
              }
          })
      ).toEqual({
          calResources: [
            {
              id: 'id_1234',
              title: 'test_parent',
              children: [],
            },
            {
              id: 'id_new_org',
              title: 'new_top_level_org',
              children: [],
            }
          ]
      })
  })

  test('add org, with a parent', () => {
    expect(
      reducer({
        calResources: [{
          id: 'id_1234',
          title: 'test_parent',
          children: [],
        }
        ]
      }, 
      {
        type: "CREATE_ORG",
        payload: {
            id: 'id_5678',
            title: 'test_child',
            parent: 'id_1234',
        }
      })
    ).toEqual({
      calResources: [{
        id: 'id_1234',
        title: 'test_parent',
        children: [{
          id: 'id_5678',
          title: 'test_child',
          children: [],
        }],
      }]
    })
  })

  test('remove child org', () => {
    debugger;
    expect(
      reducer({
        calResources: [{
          id: 'id_1234',
          title: 'test_parent',
          children: [
            {
              id: 'id_5678',
              title: 'test_child',
              children: [],
            },
            {
              id: 'id_8901',
              title: 'test_sibling',
              children: [],
            }
          ],
        }]
      }, 
      {
        type: "DELETE_ORG",
        payload: {
            id: 'id_5678',
        }
      })
    ).toEqual({
      calResources: [{
        id: 'id_1234',
        title: 'test_parent',
        children: [{
          id: 'id_8901',
          title: 'test_sibling',
          children: [],
        }],
      }]
    })
  })

  test('remove child org', () => {
    debugger;
    expect(
      reducer({
        calResources: [{
          id: 'id_1234',
          title: 'test_parent',
          children: [
            {
              id: 'id_5678',
              title: 'test_child',
              children: [
                {
                  id: 'id_1111',
                  title: 'test_child',
                  children: [],
                },
                {
                  id: 'id_2222',
                  title: 'test_sibling',
                  children: [],
                }
              ],
            },
            {
              id: 'id_8901',
              title: 'test_sibling',
              children: [],
            }
          ],
        }]
      }, 
      {
        type: "DELETE_ORG",
        payload: {
            id: 'id_1111',
        }
      })
    ).toEqual({
      calResources: [{
        id: 'id_1234',
        title: 'test_parent',
        children: [{
          id: 'id_5678',
          title: 'test_child',
          children: [
            {
              id: 'id_2222',
              title: 'test_sibling',
              children: [],
            }
          ]
        },
        {
          id: 'id_8901',
          title: 'test_sibling',
          children: [],
        }],
      }]
    })
  })

})