import { TestBed } from '@angular/core/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ToastAlertService } from './toast-alert.service';

describe('ToastAlertService', () => {
  let service: ToastAlertService;
  let toastrServiceSpy: jasmine.SpyObj<ToastrService>;

  beforeEach(() => {
    toastrServiceSpy = jasmine.createSpyObj('ToastrService', [
      'success',
      'error',
      'info',
      'warning',
    ]);

    TestBed.configureTestingModule({
      imports: [
        ToastrModule.forRoot()
      ],
      providers: [
        { provide: ToastrService, useValue: toastrServiceSpy },
        ToastAlertService
      ],
    });

    service = TestBed.inject(ToastAlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('success', () => {
    it('should call toastrService.success with default parameters', () => {
      service.success('Operation successful');

      expect(toastrServiceSpy.success).toHaveBeenCalledWith(
        'Operation successful',
        'Ok',
        jasmine.objectContaining({
          timeOut: 5000,
          positionClass: 'toast-top-right',
        })
      );
    });

    it('should call toastrService.success with custom title', () => {
      service.success('Message', 'Custom Title');

      expect(toastrServiceSpy.success).toHaveBeenCalledWith(
        'Message',
        'Custom Title',
        jasmine.objectContaining({
          timeOut: 5000,
          positionClass: 'toast-top-right',
        })
      );
    });

    it('should call toastrService.success with custom time', () => {
      service.success('Message', 'Title', 10000);

      expect(toastrServiceSpy.success).toHaveBeenCalledWith(
        'Message',
        'Title',
        jasmine.objectContaining({
          timeOut: 10000,
          positionClass: 'toast-top-right',
        })
      );
    });
  });

  describe('error', () => {
    it('should call toastrService.error with default parameters', () => {
      service.error('An error occurred');

      expect(toastrServiceSpy.error).toHaveBeenCalledWith(
        'An error occurred',
        'Error!',
        jasmine.objectContaining({
          timeOut: 7000,
          positionClass: 'toast-top-right',
        })
      );
    });

    it('should call toastrService.error with custom title', () => {
      service.error('Error message', 'Custom Error');

      expect(toastrServiceSpy.error).toHaveBeenCalledWith(
        'Error message',
        'Custom Error',
        jasmine.objectContaining({
          timeOut: 7000,
          positionClass: 'toast-top-right',
        })
      );
    });

    it('should call toastrService.error with custom time', () => {
      service.error('Error message', 'Error!', 10000);

      expect(toastrServiceSpy.error).toHaveBeenCalledWith(
        'Error message',
        'Error!',
        jasmine.objectContaining({
          timeOut: 10000,
          positionClass: 'toast-top-right',
        })
      );
    });
  });

  describe('info', () => {
    it('should call toastrService.info with default parameters', () => {
      service.info('Information message');

      expect(toastrServiceSpy.info).toHaveBeenCalledWith(
        'Information message',
        'Alerta!',
        jasmine.objectContaining({
          timeOut: 5000,
          positionClass: 'toast-top-right',
        })
      );
    });

    it('should call toastrService.info with custom title', () => {
      service.info('Info message', 'Custom Info');

      expect(toastrServiceSpy.info).toHaveBeenCalledWith(
        'Info message',
        'Custom Info',
        jasmine.objectContaining({
          timeOut: 5000,
          positionClass: 'toast-top-right',
        })
      );
    });
  });

  describe('warning', () => {
    it('should call toastrService.warning with default parameters', () => {
      service.warning('Warning message');

      expect(toastrServiceSpy.warning).toHaveBeenCalledWith(
        'Warning message',
        'Atención!',
        jasmine.objectContaining({
          timeOut: 5000,
          positionClass: 'toast-top-right',
        })
      );
    });

    it('should call toastrService.warning with custom title', () => {
      service.warning('Warning message', 'Custom Warning');

      expect(toastrServiceSpy.warning).toHaveBeenCalledWith(
        'Warning message',
        'Custom Warning',
        jasmine.objectContaining({
          timeOut: 5000,
          positionClass: 'toast-top-right',
        })
      );
    });
  });

  describe('Edge cases', () => {
    it('should handle empty message', () => {
      service.success('');

      expect(toastrServiceSpy.success).toHaveBeenCalledWith(
        '',
        'Ok',
        jasmine.any(Object)
      );
    });

    it('should handle special characters in message', () => {
      service.success('Message with <script>alert("xss")</script>');

      expect(toastrServiceSpy.success).toHaveBeenCalledWith(
        'Message with <script>alert("xss")</script>',
        'Ok',
        jasmine.any(Object)
      );
    });

    it('should handle very long message', () => {
      const longMessage = 'A'.repeat(1000);
      service.success(longMessage);

      expect(toastrServiceSpy.success).toHaveBeenCalledWith(
        longMessage,
        'Ok',
        jasmine.any(Object)
      );
    });
  });
});
