import { Request, Response } from 'express';
import { inject } from 'inversify';
import { HttpResponse } from '../constants/HttpResponse';
import { Types } from '../constants/Types';
import { ActivationPasswordRepository } from '../data/repositories/ActivationPasswordRepository';
import {
  BaseHttpController,
  controller,
  httpGet,
  request,
  response,
} from 'inversify-express-utils';

@controller('/api/activation')
export class ActivationPasswordsController extends BaseHttpController {
  private readonly activationPasswordRepository: ActivationPasswordRepository;

  public constructor(
    @inject(Types.ActivationPasswordRepository)
    activationPasswordRepository: ActivationPasswordRepository
  ) {
    super();
    this.activationPasswordRepository = activationPasswordRepository;
  }

  @httpGet('/:password')
  public async ActivateAccount(
    @request() req: Request,
    @response() res: Response
  ) {
    try {
      const activationPassword = await this.activationPasswordRepository.Get(
        req.params.password
      );

      if (!activationPassword)
        return this.badRequest(HttpResponse.INVALID_PASSWORD);

      await this.activationPasswordRepository.Update(activationPassword);

      return this.ok();
    } catch (error) {
      this.internalServerError();
    }
  }
}
