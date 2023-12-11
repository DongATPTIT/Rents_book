import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    BadGatewayException,
    CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserService } from 'src/module/user/user.service';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
    // constructor(private readonly userService: UserService) { }
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next
            .handle()
            .pipe(
                catchError(err => throwError(() => new BadGatewayException())),
            );
        // return next.handle().pipe(
        //     map(data => {
        //         console.log('Response data:', data[0]);
        //         return data[0];
        //     }),
        // );
    }
}
