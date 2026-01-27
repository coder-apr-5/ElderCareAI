/**
 * ElderNest AI - Auth Routes
 */

import { Router } from 'express';
import * as authController from '../controllers/auth.controller';

const router = Router();

// Elder Signup Flow
router.post('/elder/signup/step1', authController.elderSignupStep1);
router.post('/elder/signup/step2', authController.elderSignupStep2);
router.post('/elder/signup/step3', authController.elderSignupStep3);
router.post('/elder/signup/step4', authController.elderSignupStep4);

// Family Signup
router.post('/family/signup', authController.familySignup);

// Login
router.post('/login/phone', authController.phoneLoginStep1);
router.post('/login/phone/verify', authController.phoneLoginStep2);

// TODO: Implement email/google login routes in controller
// router.post('/login/email', authController.emailLogin);

export default router;
