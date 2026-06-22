import { Request, Response } from 'express';
export declare const getProducts: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getActiveBatchSchedule: (_req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const uploadProductImage: (req: Request, res: Response) => Promise<any>;
export declare const createProduct: (req: Request, res: Response) => Promise<void>;
export declare const updateProduct: (req: Request, res: Response) => Promise<void>;
export declare const deleteProduct: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=productController.d.ts.map