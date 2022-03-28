import {NextFunction, Request, Response} from "express";

// Log api requests to console
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    res.once('finish', () => {
        // Log request url/method
        const log = [req.method, req.path];
        
        // Log POST/PUT JSON body
        if (req.body && Object.keys(req.body).length > 0) {
            log.push(JSON.stringify(req.body));
        }
        
        // Log query params
        if (req.query && Object.keys(req.query).length > 0) {
            log.push(JSON.stringify(req.query));
        }
        
        // Log status code
        log.push('->', res.statusCode.toString(10));
        
        console.log(log.join(' '));
    });
    next();
}

export const cors = (req: Request, res: Response, next: NextFunction) => {
    // Origins that are allowed
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Methods that are allowed
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT');

    // Headers that are allowed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    
    next();
}
