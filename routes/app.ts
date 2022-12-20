import { AppController } from '../controllers/app';
import { AuthController } from '../controllers/auth';

import {rateLimiter} from '../utils/middleware/rate-limiter';

export class AppRoutes {
    public appController: AppController = new AppController();

    public authController: AuthController = new AuthController();

    public routes(app): void {
        app.route('/register/users').post(this.authController.registerUser)

        app.route('/register/merchants').post(this.authController.registerMerchant)

        app.route('/sign-in').post(this.authController.signIn)

        app.route('/clients').get(this.appController.clients)

        app.route('/studios/:merchantId').post(this.appController.createSession)
        app.route('/studios/:merchantId').get(this.appController.getSessions)


        app.route('/bookings').post(this.appController.bookSession)
        app.route('/bookings').get(this.appController.getBookings)
    }
}