import { ErrorHandler } from '../shared/model';
import { AuthService } from './auth.service';
import { LoggerService } from '../shared/services/logger.service';
import { of } from 'rxjs';

describe('AuthService', () => {

  let mockHttp;
  let jsonData;
  let authService;
  beforeEach(() => {
    mockHttp = {
      delete: jasmine.createSpy('delete'),
      get: jasmine.createSpy('get'),
      post: jasmine.createSpy('post')
    };
    jsonData = {
      'authenticationEnabled': true,
      'authenticated': true,
      'username': 'foo',
      'roles':
        [],
      '_links':
        {
          'self':
            {
              'href': 'http://localhost:9393/security/info'
            }
        }
    };

    const errorHandler = new ErrorHandler();
    const loggerService = new LoggerService();
    authService = new AuthService(mockHttp, errorHandler, loggerService);
  });

  describe('loadSecurityInfo', () => {
    it('should call the "security/info" REST endpoint', () => {
      mockHttp.get.and.returnValue(of(jsonData));

      expect(authService.securityInfo).toBeUndefined();
      authService.loadSecurityInfo();

      const httpUri = mockHttp.get.calls.mostRecent().args[0];
      const headerArgs = mockHttp.get.calls.mostRecent().args[1].headers;
      expect(httpUri).toEqual('/security/info');
      expect(headerArgs.get('Content-Type')).toEqual('application/json');
      expect(headerArgs.get('Accept')).toEqual('application/json');

    });
  });

  describe('logout', () => {
    it('should call logout REST endpoint', () => {
      mockHttp.get.and.returnValue(of(jsonData));
      authService.logout();

      const httpUri = mockHttp.get.calls.mostRecent().args[0];
      const headerArgs = mockHttp.get.calls.mostRecent().args[1].headers;
      expect(httpUri).toEqual('/dashboard/logout');
      expect(headerArgs.get('Content-Type')).toEqual('application/json');
      expect(headerArgs.get('Accept')).toEqual('application/json');
    });
  });
});
