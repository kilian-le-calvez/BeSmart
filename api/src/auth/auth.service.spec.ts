import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import getMockPrismaService from '@tests/mock-prisma-service';

const BCRYPT_HASH_LENGTH = 10;

// Mock the dependencies
const mockJwtService = {
  sign: jest.fn().mockReturnValue('jwt_token'),
};

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: PrismaService, useValue: getMockPrismaService() },
      ],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const registerDto = {
      username: 'test',
      email: 'test@example.com',
      password: 'password',
    };

    it('should successfully register a user and return a success message', async () => {
      const mockCreate = jest.fn().mockResolvedValue({
        email: registerDto.email,
      });
      prisma.user.create = mockCreate;

      const result = await service.register(registerDto);

      expect(result).toBe('test@example.com');
      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          username: 'test',
          email: registerDto.email,
          password: expect.any(String),
        },
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      prisma.user.findUnique = jest.fn().mockResolvedValue({
        email: registerDto.email,
      });

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException for invalid credentials', async () => {
      const loginDto = { email: 'test@example.com', password: 'wrongpassword' };
      prisma.user.findUnique = jest.fn().mockResolvedValue({
        email: loginDto.email,
        password: 'hashedpassword',
      });

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return a JWT token on successful login', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'correctpassword',
      };
      const mockFindUnique = jest.fn().mockResolvedValue({
        id: 1,
        email: loginDto.email,
        password: await bcrypt.hash('correctpassword', BCRYPT_HASH_LENGTH),
      });
      prisma.user.findUnique = mockFindUnique;

      const result = await service.login(loginDto);

      expect(result).toBe('jwt_token');
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: expect.any(Number),
        email: loginDto.email,
      });
    });
  });
});
