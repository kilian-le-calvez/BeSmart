import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './auth.dto';
import { Response } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: Partial<Record<keyof AuthService, jest.Mock>>;

  beforeEach(async () => {
    mockAuthService = {
      register: jest.fn(),
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call AuthService.register with correct data', async () => {
      const dto: RegisterDto = {
        username: 'test',
        email: 'test@example.com',
        password: 'pass',
      };
      const resultService = dto.email;
      mockAuthService.register.mockResolvedValue(resultService);

      const response = await controller.register(dto);

      const result = {
        message:
          'Your account has been created successfully with email: ' +
          resultService,
      };
      expect(mockAuthService.register).toHaveBeenCalledWith(dto);
      expect(response).toEqual(result);
    });
  });

  describe('login', () => {
    const originalEnv = process.env.NODE_ENV;

    afterEach(() => {
      process.env.NODE_ENV = originalEnv; // Reset after each test
    });

    it('should set a secure cookie when NODE_ENV is production', async () => {
      process.env.NODE_ENV = 'production'; // Simulate prod

      const dto: LoginDto = { email: 'test@example.com', password: 'pass' };
      const mockJwt = 'mock-jwt-token';
      const mockRes: Partial<Response> = {
        cookie: jest.fn(),
      };

      mockAuthService.login.mockResolvedValue(mockJwt);

      const response = await controller.login(dto, mockRes as Response);

      expect(mockRes.cookie).toHaveBeenCalledWith(
        'jwt',
        mockJwt,
        expect.objectContaining({
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
        }),
      );
      expect(response).toEqual({ message: 'Login successful', jwt: mockJwt });
    });

    it('should set a non-secure cookie when NODE_ENV is not production', async () => {
      process.env.NODE_ENV = 'development'; // Simulate dev

      const dto: LoginDto = { email: 'test@example.com', password: 'pass' };
      const mockJwt = 'mock-jwt-token';
      const mockRes: Partial<Response> = {
        cookie: jest.fn(),
      };

      mockAuthService.login.mockResolvedValue(mockJwt);

      const response = await controller.login(dto, mockRes as Response);

      expect(mockRes.cookie).toHaveBeenCalledWith(
        'jwt',
        mockJwt,
        expect.objectContaining({
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
        }),
      );
      expect(response).toEqual({ message: 'Login successful', jwt: mockJwt });
    });
  });
});
