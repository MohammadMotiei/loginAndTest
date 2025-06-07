const { AuthManager } = require('./auth');

describe('AuthManager', () => {
    let authManager;
  
    // نمونه کاربر برای تست
    const testUser = {
      id: '123',
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      password: 'password123',
      birthday: '1990-01-01',
      gender: 'male',
      createdAt: new Date().toISOString()
    };
  
    beforeEach(() => {
      // ایجاد یک نمونه جدید قبل از هر تست
      authManager = new AuthManager();
      
      // پاک کردن localStorage قبل از هر تست
      localStorage.clear();
    });
  
    afterEach(() => {
      // پاک کردن localStorage بعد از هر تست
      localStorage.clear();
    });
  
    describe('User Management', () => {
      test('should initialize with empty users', () => {
        expect(authManager.getUsers()).toEqual([]);
      });
  
      test('should save and retrieve users', () => {
        const users = [testUser];
        authManager.saveUsers(users);
        expect(authManager.getUsers()).toEqual(users);
      });
    });
  
    describe('Current User Management', () => {
      test('should return null when no current user', () => {
        expect(authManager.getCurrentUser()).toBeNull();
      });
  
      test('should set and get current user', () => {
        authManager.setCurrentUser(testUser);
        expect(authManager.getCurrentUser()).toEqual(testUser);
      });
  
      test('should remove current user', () => {
        authManager.setCurrentUser(testUser);
        authManager.removeCurrentUser();
        expect(authManager.getCurrentUser()).toBeNull();
      });
  
      test('should check if user is logged in', () => {
        expect(authManager.isLoggedIn()).toBe(false);
        authManager.setCurrentUser(testUser);
        expect(authManager.isLoggedIn()).toBe(true);
      });
    });
  
    describe('Registration', () => {
      test('should register a new user', () => {
        const newUser = authManager.register({
          firstName: 'Jane',
          lastName: 'Doe',
          username: 'janedoe',
          password: 'password456',
          confirmPassword: 'password456',
          birthday: '1995-05-15',
          gender: 'female'
        });
  
        expect(newUser).toHaveProperty('id');
        expect(newUser.firstName).toBe('Jane');
        expect(authManager.getUsers()).toHaveLength(1);
      });
  
      test('should throw error for duplicate username', () => {
        authManager.register(testUser);
        expect(() => {
          authManager.register({
            ...testUser,
            firstName: 'Different'
          });
        }).toThrow('Username already exists');
      });
    });
  
    describe('Login', () => {
      beforeEach(() => {
        authManager.saveUsers([testUser]);
      });
  
      test('should login with valid credentials', () => {
        const user = authManager.login('johndoe', 'password123');
        expect(user).toEqual(testUser);
        expect(authManager.getCurrentUser()).toEqual(testUser);
      });
  
      test('should throw error for invalid username', () => {
        expect(() => {
          authManager.login('wronguser', 'password123');
        }).toThrow('Invalid username or password');
      });
  
      test('should throw error for invalid password', () => {
        expect(() => {
          authManager.login('johndoe', 'wrongpassword');
        }).toThrow('Invalid username or password');
      });
  
      test('should logout user', () => {
        authManager.login('johndoe', 'password123');
        authManager.logout();
        expect(authManager.getCurrentUser()).toBeNull();
      });
    });
  
    describe('Validation', () => {
      test('should validate signup data', () => {
        const errors = authManager.validateSignupData({
          firstName: 'J',
          lastName: '',
          username: 'jd',
          password: 'pass',
          confirmPassword: 'pass1',
          birthday: '',
          gender: ''
        });
  
        expect(errors.firstName).toBe('First name must be at least 2 characters');
        expect(errors.lastName).toBe('Last name must be at least 2 characters');
        expect(errors.username).toBe('Username must be at least 3 characters');
        expect(errors.password).toBe('Password must be at least 6 characters');
        expect(errors.confirmPassword).toBe('Passwords do not match');
        expect(errors.birthday).toBe('Birthday is required');
        expect(errors.gender).toBe('Please select a gender');
      });
  
      test('should validate age requirement', () => {
        const recentDate = new Date();
        recentDate.setFullYear(recentDate.getFullYear() - 10); // 10 سال پیش
  
        const errors = authManager.validateSignupData({
          firstName: 'John',
          lastName: 'Doe',
          username: 'johndoe',
          password: 'password123',
          confirmPassword: 'password123',
          birthday: recentDate.toISOString().split('T')[0],
          gender: 'male'
        });
  
        expect(errors.birthday).toBe('You must be at least 13 years old');
      });
    });
  
    describe('Utility Methods', () => {
      test('should format date correctly', () => {
        const formatted = authManager.formatDate('2023-01-15');
        expect(formatted).toMatch(/January 15, 2023/);
      });
  
      test('should get user initials', () => {
        const initials = authManager.getUserInitials({
          firstName: 'John',
          lastName: 'Doe'
        });
        expect(initials).toBe('JD');
      });
    });
  });