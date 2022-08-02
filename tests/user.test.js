const request = require("supertest");

const app = require("../src/app");
const User = require("../src/models/user");
const {
  userOne,
  userOneId,
  setupDatabase,
  closeConnection,
} = require("./fixtures/db");
jest.setTimeout(8000);

beforeEach(setupDatabase);

afterAll(closeConnection);

test("Should signup a new user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "joe",
      email: "awldl@gmail.com",
      password: "MayPass#$!",
    })
    .expect(201);

  // Assert that the database was changed correctly
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  // Asertions about the response
  expect(response.body).toMatchObject({
    user: {
      name: "joe",
      email: "awldl@gmail.com",
    },
  });

  expect(user.password).not.toBe("MayPass#$!");
});

test("Should login existing user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(response.body.token).toBe(user.tokens[1].token);
});

test("Should not login nonexistent user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password + "48",
    })
    .expect(400);
});

test("Should get profile for user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get profile for unathenticated user", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("Should upload avatar image", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/proPic.jpg")
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Should update valid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: "Different Name",
    })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.name).toEqual("Different Name");
});

test("Should not update invalid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      location: "philly",
    })
    .expect(400);
});

test("Should delete account for user", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

test("SHould not delete account for unathenticated user", async () => {
  await request(app).delete("/users/me").send().expect(401);
});
