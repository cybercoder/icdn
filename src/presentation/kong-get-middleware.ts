import { BadRequestException, NestMiddleware } from '@nestjs/common';
import { RequestHandler } from '@nestjs/common/interfaces';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Request } from 'http-proxy-middleware/dist/types';

export class KongGetMiddlewareV1Alpha1 implements NestMiddleware {
  private proxy?: RequestHandler;
  constructor() {
    this.proxy = createProxyMiddleware({
      target: process.env.KONG_ADMIN_API_URI,
      ws: true,
    });
  }

  async use(req: Request, res, next: (error?: any) => void) {
    const { query }: any = req;
    const namespaceMatch = req.originalUrl.match(
      /^\/apis\/cdn\.ik8s\.ir\/v1alpha1\/namespaces\/([^\/]*)\/(.*)$/,
    );
    const namespace = namespaceMatch ? namespaceMatch[1] : undefined;
    if (!namespace) throw new BadRequestException();

    const modifiedQuerString = Object.entries(query).reduce(
      (r: string, [key, value]) => {
        key !== 'tags' &&
          (r += (r.length === 0 ? '?' : `&`) + `${key}=${value.toString()}`);
        return r;
      },
      `?tags=ns-${namespace}`,
    );

    const url = '/' + namespaceMatch[2].split('?')[0] + modifiedQuerString;

    const modifiedReq: Request = Object.create(req, {
      url: { value: url, writable: true },
      originalUrl: { value: url, writable: true },
    });

    this.proxy(modifiedReq, res, next);
  }
}
