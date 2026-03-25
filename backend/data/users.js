import bcrypt from "bcrypt";

const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "password123", // bcrypt logic applies via schema
    role: "admin",
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
  },
  {
    name: "Jane Doe",
    email: "jane@example.com",
    password: "password123",
  },
];

export default users;
