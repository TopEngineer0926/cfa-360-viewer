/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatePano = /* GraphQL */ `
  subscription OnCreatePano {
    onCreatePano {
      id
      title
      img {
        region
        bucket
        key
      }
      thumbnail {
        region
        bucket
        key
      }
      createdAt
      updatedAt
      spots {
        items {
          id
          name
          contents {
            name
            type
            content {
              region
              bucket
              key
            }
            link
          }
          panoID
          createdAt
          updatedAt
          pano {
            id
            title
            img {
              region
              bucket
              key
            }
            thumbnail {
              region
              bucket
              key
            }
            createdAt
            updatedAt
            spots {
              nextToken
            }
          }
          comments {
            items {
              id
              owner
              spotID
              content
              reply
              updatedAt
              repliedAt
              createdAt
            }
            nextToken
          }
        }
        nextToken
      }
    }
  }
`;
export const onUpdatePano = /* GraphQL */ `
  subscription OnUpdatePano {
    onUpdatePano {
      id
      title
      img {
        region
        bucket
        key
      }
      thumbnail {
        region
        bucket
        key
      }
      createdAt
      updatedAt
      spots {
        items {
          id
          name
          contents {
            name
            type
            content {
              region
              bucket
              key
            }
            link
          }
          panoID
          createdAt
          updatedAt
          pano {
            id
            title
            img {
              region
              bucket
              key
            }
            thumbnail {
              region
              bucket
              key
            }
            createdAt
            updatedAt
            spots {
              nextToken
            }
          }
          comments {
            items {
              id
              owner
              spotID
              content
              reply
              updatedAt
              repliedAt
              createdAt
            }
            nextToken
          }
        }
        nextToken
      }
    }
  }
`;
export const onDeletePano = /* GraphQL */ `
  subscription OnDeletePano {
    onDeletePano {
      id
      title
      img {
        region
        bucket
        key
      }
      thumbnail {
        region
        bucket
        key
      }
      createdAt
      updatedAt
      spots {
        items {
          id
          name
          contents {
            name
            type
            content {
              region
              bucket
              key
            }
            link
          }
          panoID
          createdAt
          updatedAt
          pano {
            id
            title
            img {
              region
              bucket
              key
            }
            thumbnail {
              region
              bucket
              key
            }
            createdAt
            updatedAt
            spots {
              nextToken
            }
          }
          comments {
            items {
              id
              owner
              spotID
              content
              reply
              updatedAt
              repliedAt
              createdAt
            }
            nextToken
          }
        }
        nextToken
      }
    }
  }
`;
export const onCreateSpot = /* GraphQL */ `
  subscription OnCreateSpot {
    onCreateSpot {
      id
      name
      contents {
        name
        type
        content {
          region
          bucket
          key
        }
        link
      }
      panoID
      createdAt
      updatedAt
      pano {
        id
        title
        img {
          region
          bucket
          key
        }
        thumbnail {
          region
          bucket
          key
        }
        createdAt
        updatedAt
        spots {
          items {
            id
            name
            contents {
              name
              type
              link
            }
            panoID
            createdAt
            updatedAt
            pano {
              id
              title
              createdAt
              updatedAt
            }
            comments {
              nextToken
            }
          }
          nextToken
        }
      }
      comments {
        items {
          id
          owner
          spotID
          content
          reply
          updatedAt
          repliedAt
          createdAt
          spot {
            id
            name
            contents {
              name
              type
              link
            }
            panoID
            createdAt
            updatedAt
            pano {
              id
              title
              createdAt
              updatedAt
            }
            comments {
              nextToken
            }
          }
        }
        nextToken
      }
    }
  }
`;
export const onUpdateSpot = /* GraphQL */ `
  subscription OnUpdateSpot {
    onUpdateSpot {
      id
      name
      contents {
        name
        type
        content {
          region
          bucket
          key
        }
        link
      }
      panoID
      createdAt
      updatedAt
      pano {
        id
        title
        img {
          region
          bucket
          key
        }
        thumbnail {
          region
          bucket
          key
        }
        createdAt
        updatedAt
        spots {
          items {
            id
            name
            contents {
              name
              type
              link
            }
            panoID
            createdAt
            updatedAt
            pano {
              id
              title
              createdAt
              updatedAt
            }
            comments {
              nextToken
            }
          }
          nextToken
        }
      }
      comments {
        items {
          id
          owner
          spotID
          content
          reply
          updatedAt
          repliedAt
          createdAt
          spot {
            id
            name
            contents {
              name
              type
              link
            }
            panoID
            createdAt
            updatedAt
            pano {
              id
              title
              createdAt
              updatedAt
            }
            comments {
              nextToken
            }
          }
        }
        nextToken
      }
    }
  }
`;
export const onDeleteSpot = /* GraphQL */ `
  subscription OnDeleteSpot {
    onDeleteSpot {
      id
      name
      contents {
        name
        type
        content {
          region
          bucket
          key
        }
        link
      }
      panoID
      createdAt
      updatedAt
      pano {
        id
        title
        img {
          region
          bucket
          key
        }
        thumbnail {
          region
          bucket
          key
        }
        createdAt
        updatedAt
        spots {
          items {
            id
            name
            contents {
              name
              type
              link
            }
            panoID
            createdAt
            updatedAt
            pano {
              id
              title
              createdAt
              updatedAt
            }
            comments {
              nextToken
            }
          }
          nextToken
        }
      }
      comments {
        items {
          id
          owner
          spotID
          content
          reply
          updatedAt
          repliedAt
          createdAt
          spot {
            id
            name
            contents {
              name
              type
              link
            }
            panoID
            createdAt
            updatedAt
            pano {
              id
              title
              createdAt
              updatedAt
            }
            comments {
              nextToken
            }
          }
        }
        nextToken
      }
    }
  }
`;
export const onCreateComment = /* GraphQL */ `
  subscription OnCreateComment {
    onCreateComment {
      id
      owner
      spotID
      content
      reply
      updatedAt
      repliedAt
      createdAt
      spot {
        id
        name
        contents {
          name
          type
          content {
            region
            bucket
            key
          }
          link
        }
        panoID
        createdAt
        updatedAt
        pano {
          id
          title
          img {
            region
            bucket
            key
          }
          thumbnail {
            region
            bucket
            key
          }
          createdAt
          updatedAt
          spots {
            items {
              id
              name
              panoID
              createdAt
              updatedAt
            }
            nextToken
          }
        }
        comments {
          items {
            id
            owner
            spotID
            content
            reply
            updatedAt
            repliedAt
            createdAt
            spot {
              id
              name
              panoID
              createdAt
              updatedAt
            }
          }
          nextToken
        }
      }
    }
  }
`;
export const onUpdateComment = /* GraphQL */ `
  subscription OnUpdateComment {
    onUpdateComment {
      id
      owner
      spotID
      content
      reply
      updatedAt
      repliedAt
      createdAt
      spot {
        id
        name
        contents {
          name
          type
          content {
            region
            bucket
            key
          }
          link
        }
        panoID
        createdAt
        updatedAt
        pano {
          id
          title
          img {
            region
            bucket
            key
          }
          thumbnail {
            region
            bucket
            key
          }
          createdAt
          updatedAt
          spots {
            items {
              id
              name
              panoID
              createdAt
              updatedAt
            }
            nextToken
          }
        }
        comments {
          items {
            id
            owner
            spotID
            content
            reply
            updatedAt
            repliedAt
            createdAt
            spot {
              id
              name
              panoID
              createdAt
              updatedAt
            }
          }
          nextToken
        }
      }
    }
  }
`;
export const onDeleteComment = /* GraphQL */ `
  subscription OnDeleteComment {
    onDeleteComment {
      id
      owner
      spotID
      content
      reply
      updatedAt
      repliedAt
      createdAt
      spot {
        id
        name
        contents {
          name
          type
          content {
            region
            bucket
            key
          }
          link
        }
        panoID
        createdAt
        updatedAt
        pano {
          id
          title
          img {
            region
            bucket
            key
          }
          thumbnail {
            region
            bucket
            key
          }
          createdAt
          updatedAt
          spots {
            items {
              id
              name
              panoID
              createdAt
              updatedAt
            }
            nextToken
          }
        }
        comments {
          items {
            id
            owner
            spotID
            content
            reply
            updatedAt
            repliedAt
            createdAt
            spot {
              id
              name
              panoID
              createdAt
              updatedAt
            }
          }
          nextToken
        }
      }
    }
  }
`;
