import { Request, Response } from 'express';
interface AuthRequest extends Request {
    user?: {
        role?: string;
        username?: string;
    };
}
export declare const loginAdmin: (req: Request, res: Response) => Promise<any>;
export declare const getDashboardStats: (req: Request, res: Response) => Promise<void>;
export declare const getAdminSession: (req: AuthRequest, res: Response) => Promise<void>;
export {};
//# sourceMappingURL=adminController.d.ts.map