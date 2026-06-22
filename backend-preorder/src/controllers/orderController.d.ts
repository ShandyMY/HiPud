import { Request, Response } from 'express';
export declare const createOrder: (req: Request, res: Response) => Promise<any>;
export declare const getOrders: (req: Request, res: Response) => Promise<void>;
export declare const updateOrderStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteOrder: (req: Request, res: Response) => Promise<void>;
export declare const downloadReceipt: (req: Request, res: Response) => Promise<any>;
export declare const cancelOrder: (req: Request, res: Response) => Promise<any>;
//# sourceMappingURL=orderController.d.ts.map