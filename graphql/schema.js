const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type User {
    id: ID!
    username: String!
    email: String!
    role: String
  }

  type Course {
    id: ID!
    courseName: String!
    courseCode: String
    teacherName: String
  }

  type Attendance {
    id: ID!
    UserId: ID!
    courseName: String!
    delivered: Int!
    attended: Int!
    percentage: Float!
    date: String
  }

  type Query {
    users: [User!]!
    courses: [Course!]!
    userAttendance(userId: ID!): [Attendance!]!
    allAttendance: [Attendance!]!
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): User!
    markAttendance(userId: ID!, courseName: String!, delivered: Int!, attended: Int!): Attendance!
  }
`);
