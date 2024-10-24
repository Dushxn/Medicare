const UserRepository = require('../repositories/UserRepository');
const setup = require('./setup');

beforeAll(async () => {
  await setup();
});

afterAll(async () => {
  await setup.teardown();
});

describe('UserRepository', () => {
  it('should create a new user', async () => {
    const userRepo = new UserRepository();
    const userData = { name: 'John Doe', email: 'john@example.com', password: 'password123', userType: 'user' };
    const user = await userRepo.createUser(userData);

    expect(user).toHaveProperty('_id');
    expect(user.email).toBe(userData.email);
  });

  it('should find a user by email', async () => {
    const userRepo = new UserRepository();
    const user = await userRepo.findByEmail('john@example.com');

    expect(user).toHaveProperty('email', 'john@example.com');
  });
});
