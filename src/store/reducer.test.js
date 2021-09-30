import reducer from './reducer';

describe('test organization manipulation', () => {
  test('add org, no parent', () => {
      expect(
          reducer({
            calResources: [
              {
               id: 'id_1234',
                title: 'test_parent',
                parentId: '',
              }
            ]
          },{
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
              parentId: '',
            },
            {
              id: 'id_new_org',
              title: 'new_top_level_org',
              parentId: '',
            }
          ]
      })
  })

  test('add org, with a parent', () => {
    expect(
      reducer({
        calResources: [
          {
            id: 'id_1234',
            title: 'test_parent',
            parentId: '',
          },
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
      calResources: [
        {
          id: 'id_1234',
          title: 'test_parent',
          parentId: '',
        },
        {
          id: 'id_5678',
          title: 'test_child',
          parentId: 'id_1234',
        }
      ],
    })
  })

  test('remove child org', () => {
    expect(
      reducer({
        calResources: [
          {
            id: 'id_1234',
            title: 'test_parent',
            parentId: '',
          },
          {
            id: 'id_5678',
            title: 'test_child',
            parentId: 'id_1234',
          },
          {
            id: 'id_8901',
            title: 'test_sibling',
            parentId: 'id_1234',
          }
        ],
      }, 
      {
        type: "DELETE_ORG",
        payload: {
            id: 'id_5678',
        }
      })
    ).toEqual({
      calResources: [
        {
          id: 'id_1234',
          title: 'test_parent',
          parentId: '',
        },
        {
          id: 'id_8901',
          title: 'test_sibling',
          parentId: 'id_1234',
        }
      ],
    })
  })

  test('remove child org', () => {
    expect(
      reducer({
        calResources: [
          {
            id: 'id_1234',
            title: 'test_parent',
            parentId: '',
          },
          {
            id: 'id_5678',
            title: 'test_child',
            parentId: 'id_1234',
          },
          {
            id: 'id_1111',
            title: 'test_grandchild1',
            parentId: 'id_5678',
          },
          {
            id: 'id_2222',
            title: 'test_grandchild2',
            parentId: 'id_5678',
          },
          {
            id: 'id_9999',
            title: 'test_sibling',
            parentId: 'id_1234',
          },
        ]
      }, 
      {
        type: "DELETE_ORG",
        payload: {
            id: 'id_1111',
        }
      })
    ).toEqual({
      calResources: [
        {
          id: 'id_1234',
          title: 'test_parent',
          parentId: '',
        },
        {
          id: 'id_5678',
          title: 'test_child',
          parentId: 'id_1234',
        },
        {
          id: 'id_2222',
          title: 'test_grandchild2',
          parentId: 'id_5678',
        },
        {
          id: 'id_9999',
          title: 'test_sibling',
          parentId: 'id_1234',
        },
      ]
    })
  })

  test('remove child org, with grandchildren', () => {
    expect(
      reducer({
        calResources: [
          {
            id: 'id_1234',
            title: 'test_parent',
            parentId: '',
          },
          {
            id: 'id_5678',
            title: 'test_child',
            parentId: 'id_1234',
          },
          {
            id: 'id_1111',
            title: 'test_grandchild1',
            parentId: 'id_5678',
          },
          {
            id: 'id_2222',
            title: 'test_grandchild2',
            parentId: 'id_5678',
          },
          {
            id: 'id_9999',
            title: 'test_sibling',
            parentId: 'id_1234',
          },
        ]
      }, 
      {
        type: "DELETE_ORG",
        payload: {
            id: 'id_5678',
        }
      })
    ).toEqual({
      calResources: [
        {
          id: 'id_1234',
          title: 'test_parent',
          parentId: '',
        },
        {
          id: 'id_9999',
          title: 'test_sibling',
          parentId: 'id_1234',
        },
      ]
    })
  })
})

describe('test category manipulation', () => {
  test('create cat', () => {
    expect(
      reducer({
        calCategories: []
      },{
        type: "CREATE_CATEGORY",
        payload: {
          id: 'id_1234',
          name: 'this is a new category',
          color: 'orange',
        }
      })
    ).toEqual({
      calCategories: [
        {
          id: 'id_1234',
          name: 'this is a new category',
          color: 'orange',
        },
      ]
    })
  })

  test('change cat name', () => {
    expect(
      reducer({
        calCategories: [
          {
            id: 'id_1234',
            name: 'old name',
            color: 'orange',
          },
        ]
      },{
        type: "UPDATE_CATEGORY_NAME",
        payload: {
          id: 'id_1234',
          name: 'new name',
        }
      })
    ).toEqual({
      calCategories: [
        {
          id: 'id_1234',
          name: 'new name',
          color: 'orange',
        },
      ]
    })
  })

  test('change cat color', () => {
    expect(
      reducer({
        calCategories: [
          {
            id: 'id_1234',
            name: 'old name',
            color: 'orange',
          },
        ]
      },{
        type: "UPDATE_CATEGORY_COLOR",
        payload: {
          id: 'id_1234',
          color: 'red',
        }
      })
    ).toEqual({
      calCategories: [
        {
          id: 'id_1234',
          name: 'old name',
          color: 'red',
        },
      ]
    })
  })
})