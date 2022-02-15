import express from 'express';
import fs from 'fs';
import multer from 'multer';
import { fromBuffer } from 'file-type';
import crypto from 'crypto';

export default (app: express.Application, storageApiKey: string) => {
    const upload = multer({ storage: multer.memoryStorage() });

    app.use(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const name = new URL(req.url, `${req.protocol}://${req.hostname}`).pathname.slice(1);
        if (req.method !== 'GET') {
            if (req.method === 'POST') {
                if (req.headers.authorization === storageApiKey) {
                    next();
                } else {
                    res.status(403).send();
                }
            } else {
                res.status(405).send();
            }
        } else if (name && fs.existsSync(__dirname + '/../../files/' + name)) {
            const file = fs.readFileSync(__dirname + '/../../files/' + name);
            res.set('Content-Type', ((await fromBuffer(file))?.mime));
            res.set('Cross-Origin-Resource-Policy', 'cross-origin');
            res.send(file);
        } else {
            res.status(404).send();
        }
    });

    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.status(500).send();
    });

    app.post('/', upload.single('file'), async (req: express.Request, res: express.Response) => {
        if (req.file) {
            const fileName = crypto.randomUUID();
            fs.writeFile(__dirname + '/../../files/' + fileName, req.file?.buffer, err => {
                if (!err) {
                    res.status(201).send(fileName);
                } else {
                    res.status(500).send();
                }
            });
        } else {
            res.status(400).send();
        }
    });
};