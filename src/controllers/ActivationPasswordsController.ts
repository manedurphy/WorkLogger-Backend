import { inject } from 'inversify';
import { Types } from '../constants/Types';
import { Alert } from '../responseObjects/Alert';
import { Logger } from '@overnightjs/logger';
import { HttpResponse } from '../constants/HttpResponse';
import { IActivationPasswordRepository } from '../data/interfaces/IActivationPasswordRepository';
import {
    BaseHttpController,
    controller,
    httpGet,
    requestParam,
} from 'inversify-express-utils';

@controller('/api/activation')
export class ActivationPasswordsController extends BaseHttpController {
    private readonly activationPasswordRepository: IActivationPasswordRepository;

    public constructor(
        @inject(Types.ActivationPasswordRepository)
        activationPasswordRepository: IActivationPasswordRepository
    ) {
        super();
        this.activationPasswordRepository = activationPasswordRepository;
    }

    @httpGet('/:password')
    private async activateAccount(@requestParam('password') password: string) {
        try {
            const activationPassword = await this.activationPasswordRepository.get(
                password
            );

            if (!activationPassword)
                return this.json(new Alert(HttpResponse.INVALID_PASSWORD), 400);

            await this.activationPasswordRepository.update(activationPassword);
            return this.ok(new Alert(HttpResponse.USER_ACTIVATED));
        } catch (error) {
            Logger.Err('ERROR IN ACTIVATION PASSWORD ROUTE', error);
            return this.json(new Alert(HttpResponse.SERVER_ERROR), 500);
        }
    }
}
