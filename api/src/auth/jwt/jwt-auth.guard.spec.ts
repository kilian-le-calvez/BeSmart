import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JsonWebTokenError } from '@nestjs/jwt';

describe('JwtAuthGuard', () => {
  let jwtAuthGuard: JwtAuthGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    jwtAuthGuard = new JwtAuthGuard(reflector);
  });

  describe('canActivate', () => {
    it('should return true if the route is public', () => {
      const context = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
      } as unknown as ExecutionContext;

      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

      const result = jwtAuthGuard.canActivate(context);

      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(
        expect.anything(),
        [context.getHandler(), context.getClass()],
      );
      expect(result).toBe(true);
    });

    it('should call super.canActivate if the route is not public', () => {
      const context = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
      } as unknown as ExecutionContext;

      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
      // Some tricky code to mock the super class method 'canActivate'
      jest.spyOn(jwtAuthGuard as any, 'handleAuth').mockReturnValue(true);

      const result = jwtAuthGuard.canActivate(context);

      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(
        expect.anything(),
        [context.getHandler(), context.getClass()],
      );
      expect((jwtAuthGuard as any).handleAuth).toHaveBeenCalledWith(context);
      expect(result).toBe(true);
    });
  });

  describe('handleRequest', () => {
    it('should return the user if no error and user is provided', () => {
      const user = { id: 1, username: 'testuser' };
      const result = jwtAuthGuard.handleRequest(null, user);

      expect(result).toBe(user);
    });

    it('should throw UnauthorizedException if no user is provided', () => {
      expect(() => {
        jwtAuthGuard.handleRequest(null, null);
      }).toThrow('Unauthorized. Invalid or expired token.');
    });

    it('should throw the error if an error is provided', () => {
      const error = new JsonWebTokenError('Token error');

      expect(() => {
        jwtAuthGuard.handleRequest(error, null);
      }).toThrow('Unauthorized. Invalid or expired token.');
    });
  });

  describe('handleAuth', () => {
    let jwtAuthGuard: JwtAuthGuard;

    beforeEach(() => {
      const reflector = { getAllAndOverride: jest.fn() } as any;
      jwtAuthGuard = new JwtAuthGuard(reflector);
    });

    it('should delegate to super.canActivate and return its result', () => {
      const context = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
      } as unknown as ExecutionContext;

      // Spy on JwtAuthGuard's parent class method directly
      const superProto = Object.getPrototypeOf(JwtAuthGuard.prototype);
      const canActivateSpy = jest
        .spyOn(superProto, 'canActivate')
        .mockReturnValue(true);

      const result = jwtAuthGuard['handleAuth'](context);

      expect(canActivateSpy).toHaveBeenCalledWith(context);
      expect(result).toBe(true);
    });

    it('should propagate errors from super.canActivate', () => {
      const context = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
      } as unknown as ExecutionContext;

      const error = new Error('Super canActivate error');
      const superProto = Object.getPrototypeOf(JwtAuthGuard.prototype);
      jest.spyOn(superProto, 'canActivate').mockImplementation(() => {
        throw error;
      });

      expect(() => jwtAuthGuard['handleAuth'](context)).toThrow(error);
    });
  });
});
