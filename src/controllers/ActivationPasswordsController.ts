import { inject } from 'inversify';
import { Types } from '../constants/Types';
import { Alert } from '../responseObjects/Alert';
import { Logger } from '@overnightjs/logger';
import { HttpResponse } from '../constants/HttpResponse';
import { Request, Response } from 'express';
import { ActivationPasswordRepository } from '../data/repositories/ActivationPasswordRepository';
import { BaseHttpController, controller, httpGet, request, response } from 'inversify-express-utils';

@controller('/api/activation')
export class ActivationPasswordsController extends BaseHttpController {
    private readonly activationPasswordRepository: ActivationPasswordRepository;

    public constructor(
        @inject(Types.ActivationPasswordRepository)
        activationPasswordRepository: ActivationPasswordRepository,
    ) {
        super();
        this.activationPasswordRepository = activationPasswordRepository;
    }

    @httpGet('/:password')
    public async ActivateAccount(@request() req: Request, @response() res: Response) {
        try {
            const activationPassword = await this.activationPasswordRepository.Get(req.params.password);

            if (!activationPassword) return this.badRequest(HttpResponse.INVALID_PASSWORD);

            await this.activationPasswordRepository.Update(activationPassword);

            return this.ok(new Alert(HttpResponse.USER_ACTIVATED));
        } catch (error) {
            Logger.Err('ERROR IN ACTIVATION PASSWORD ROUTE', error);
            return this.internalServerError();
        }
    }
}
