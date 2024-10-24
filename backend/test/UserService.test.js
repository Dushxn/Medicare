const UserService = require('../Services/UserService');
const setup = require('./setup');

beforeAll(async () => {
  await setup();
});

afterAll(async () => {
  await setup.teardown();
});

describe('UserService', () => {
  it('should register a new user', async () => {
    const userData = { name: 'Jane Doe', email: 'jane@example.com', password: 'password123' };
    const user = await UserService.register(userData);

    expect(user).toHaveProperty('email', 'jane@example.com');
  });

  it('should login a user with valid credentials', async () => {
    const email = 'jane@example.com';
    const password = 'password123';

    const { token, user } = await UserService.login(email, password);

    expect(user).toHaveProperty('email', email);
    expect(token).toBeDefined();
  });

  it('should fail login with invalid credentials', async () => {
    const email = 'jane@example.com';
    const password = 'wrongpassword';

    await expect(UserService.login(email, password)).rejects.toThrow('Invalid email or password');
  });
});
